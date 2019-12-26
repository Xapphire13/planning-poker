import { app, BrowserWindow, ipcMain } from "electron";
import express from "express";
import { createServer } from "http";
import { ApolloServer, PubSub, IResolvers, gql } from "apollo-server-express";
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import internalIp from "internal-ip";
import IpcChannel from ":shared/IpcChannel";
import path from "path";
import User from ":shared/User";

const PORT = 4000;

function createWindow() {
  let win = new BrowserWindow({
    width: 300,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')

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

  input UserInput {
    id: ID!
    name: String!
  }

  type Query {
    noop: VoidResult
  }

  type Mutation {
    join(user: UserInput): VoidResult
  }

  type Subscription {
    votingStarted: VoidResult
  }
`;

enum SubscriptionTrigger {
  VotingStarted = "VOTING_STARTED"
}

let window: BrowserWindow | undefined;
const joinedUsers: Map<string, User> = new Map();
const pubsub = new PubSub();

const resolvers: IResolvers = {
  Query: {
    noop: () => ({
      success: true
    })
  },
  Mutation: {
    join: (_: any, args: Record<string, any>) => {
      const user: User = args.user;
      if (!joinedUsers.has(user.id)) {
        joinedUsers.set(user.id, user);

        if (window) {
          window.webContents.send(IpcChannel.PersonConnected);
        }
      }


      return {
        success: true
      }
    }
  },
  Subscription: {
    votingStarted: {
      subscribe: () => pubsub.asyncIterator([SubscriptionTrigger.VotingStarted])
    }
  }
};

(async () => {
  const expressServer = express();
  const apolloServer = new ApolloServer({
    typeDefs, resolvers
  });
  const httpServer = createServer(expressServer);

  apolloServer.applyMiddleware({ app: expressServer });
  apolloServer.installSubscriptionHandlers(httpServer);
  expressServer.use(express.static(path.resolve(__dirname, "web")));
  // Redirect all other traffic to app entry point
  expressServer.get(/\/.+/, (_, res) => {
    res.redirect("/");
  })

  await new Promise((res) => httpServer.listen(PORT, res));
  console.log(`GraphQL ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  console.log(`GraphQL subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`);

  await app.whenReady();

  ipcMain.handle(IpcChannel.GetIp, () => {
    return internalIp.v4();
  });

  ipcMain.handle(IpcChannel.GetConnectedCount, () => joinedUsers.size);

  await installExtension(REACT_DEVELOPER_TOOLS);
  window = createWindow();

  // TODO, remove
  // Example of how to trigger a subscription
  // setInterval(() => {
  //   pubsub.publish(SubscriptionTrigger.VotingStarted, { votingStarted: { success: true } });
  // }, 1000);
})();