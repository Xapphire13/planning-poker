import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, ipcMain } from 'electron';
import express from 'express';
import { createServer } from 'http';
import {
  ApolloServer,
  PubSub,
  IResolvers,
  gql,
  AuthenticationError
} from 'apollo-server-express';
import internalIp from 'internal-ip';
import path from 'path';
import ReactDomServer from 'react-dom/server';
import { StyleSheetServer } from 'aphrodite';
import { ServerLocation } from '@reach/router';
import { ServerStyleSheets } from '@material-ui/core/styles';
import ngrok from 'ngrok';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as electronDevtoolsInstaller from 'electron-devtools-installer';
import { format as formatUrl } from 'url';
import ConnectionInfo from ':shared/ConnectionInfo';
import isDevelopment from './isDevelopment';
import webTemplate from './webTemplate';
import { Bootstrap } from ':web/index';
import User from ':shared/User';
import IpcChannel from ':shared/IpcChannel';
import { Vote } from ':shared/Vote';

const PORT = 4000;

interface Context {
  userId: string;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 300,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL(
    formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    })
  );

  return win;
}

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
  }

  type VoidResult {
    success: Boolean!
  }

  type Query {
    noop: VoidResult
  }

  type Mutation {
    join(name: String!): VoidResult
    vote(vote: String!): VoidResult
  }

  type Subscription {
    votingStarted: VoidResult
  }
`;

enum SubscriptionTrigger {
  VotingStarted = 'VOTING_STARTED'
}

(async () => {
  let window: BrowserWindow | undefined;
  const joinedUsers: Map<string, User> = new Map();
  let voteResults: Map<string, Vote> = new Map();
  const pubsub = new PubSub();

  const resolvers: IResolvers<any, Context> = {
    Query: {
      noop: () => ({
        success: true
      })
    },
    Mutation: {
      join: (_: any, { name }, { userId }) => {
        if (userId && !joinedUsers.has(userId)) {
          joinedUsers.set(userId, {
            id: userId,
            name
          });

          window?.webContents.send(IpcChannel.PersonConnected);
        }

        return {
          success: true
        };
      },
      vote: (_, { vote }, { userId }) => {
        voteResults.set(userId, vote);
        window?.webContents.send(IpcChannel.VoteCast);

        return {
          success: true
        };
      }
    },
    Subscription: {
      votingStarted: {
        subscribe: () =>
          pubsub.asyncIterator([SubscriptionTrigger.VotingStarted])
      }
    }
  };

  const expressServer = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }): Context => {
      if (!req) {
        // Happens during subscription connection
        return {
          userId: ''
        };
      }

      const userId = req.header('X-USER-ID');

      if (!userId) {
        throw new AuthenticationError(
          'You must have valid user ID to use this API'
        );
      }

      return {
        userId
      };
    },
    subscriptions: {
      onConnect: ({ userId }: any): Promise<Context> => {
        if (!userId) {
          throw new AuthenticationError(
            'You must have valid user ID to use this API'
          );
        }

        return Promise.resolve({
          userId
        });
      },
      onDisconnect: (_, ctx) => {
        if (ctx.initPromise) {
          (async () => {
            const context: Context = await ctx.initPromise;

            const userHadJoined = joinedUsers.delete(context.userId);
            if (userHadJoined) {
              window?.webContents.send(IpcChannel.PersonDisconnected);
            }
          })();
        }
      }
    }
  });
  const httpServer = createServer(expressServer);

  apolloServer.applyMiddleware({ app: expressServer });
  apolloServer.installSubscriptionHandlers(httpServer);
  expressServer.use(express.static(path.resolve(__dirname, 'web')));
  // Web entry point
  expressServer.use(/\/.*/, (req, res) => {
    const muiSheets = new ServerStyleSheets();

    const { html, css } = StyleSheetServer.renderStatic(() =>
      ReactDomServer.renderToString(
        muiSheets.collect(
          <ServerLocation url={req.originalUrl}>
            <Bootstrap port={PORT} />
          </ServerLocation>
        )
      )
    );

    const result = webTemplate(
      html,
      muiSheets.toString(),
      css.content,
      css.renderedClassNames,
      '/web.js'
    );

    res.send(result);
  });

  await new Promise(res => httpServer.listen(PORT, res));
  const ngrokUrl = await (async () => {
    try {
      const url = await ngrok.connect(PORT);
      return url.replace('https://', 'http://');
    } catch (err) {
      console.error("Couldn't connect to ngrok", err);
    }

    return undefined;
  })();
  console.log(
    `GraphQL ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
  console.log(
    `GraphQL subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
  );
  console.log(`Local URL: http://localhost:${PORT}`);
  if (ngrokUrl) {
    console.log(`Remote URL: ${ngrokUrl}`);
  }

  await app.whenReady();

  ipcMain.handle(
    IpcChannel.GetConnectionInfo,
    async (): Promise<ConnectionInfo> => {
      const localIp = await internalIp.v4();

      if (!localIp) {
        throw new Error("Can't get local address");
      }

      return {
        local: `http://${localIp}:${PORT}`,
        remote: ngrokUrl
      };
    }
  );

  ipcMain.handle(IpcChannel.GetConnectedCount, () => joinedUsers.size);

  ipcMain.handle(IpcChannel.GetResults, () => {
    return [...voteResults.entries()].map<[User, Vote]>(([userId, vote]) => [
      joinedUsers.get(userId)!,
      vote
    ]);
  });

  ipcMain.on(IpcChannel.StartVoting, () => {
    voteResults = new Map();
    pubsub.publish(SubscriptionTrigger.VotingStarted, {
      votingStarted: { success: true }
    });
  });

  if (isDevelopment()) {
    /* eslint-disable import/no-extraneous-dependencies, global-require */
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS
    } = require('electron-devtools-installer') as typeof electronDevtoolsInstaller;
    /* eslint-enable import/no-extraneous-dependencies, global-require */

    await installExtension(REACT_DEVELOPER_TOOLS);
  }
  window = createWindow();
})();
