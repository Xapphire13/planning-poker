/* eslint-disable no-console */
import React from 'react';
import express from 'express';
import { createServer } from 'http';
import {
  ApolloServer,
  PubSub,
  IResolvers,
  AuthenticationError
} from 'apollo-server-express';
import path from 'path';
import ReactDomServer from 'react-dom/server';
import { StyleSheetServer } from 'aphrodite';
import { ServerLocation } from '@reach/router';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { importSchema } from 'graphql-import';
import { JssProvider, SheetsRegistry } from 'react-jss';
import webTemplate from './webTemplate';
import Session from './Session';

interface Context {
  userId: string;
}

enum SubscriptionTrigger {
  VotingStarted = 'VOTING_STARTED',
  PersonJoined = 'PERSON_JOINED',
  PersonDisconnected = 'PERSON_DISCONNECTED',
  VoteCast = 'VOTE_CAST'
}

function getSessionTrigger(sessionId: string, trigger: SubscriptionTrigger) {
  return `${trigger}-${sessionId}`;
}

process.on('unhandledRejection', err => {
  console.error(err);
});

(async () => {
  /** sessionId -> Session */
  const sessions = new Map<string, Session>();
  const pubsub = new PubSub();

  const resolvers: IResolvers<any, Context> = {
    Query: {
      session: (_, { sessionId }) => {
        const session = sessions.get(sessionId);

        if (!session) {
          return null;
        }

        return {
          id: session.sessionId,
          users: session.users,
          results: session.results().map(([userId, vote]) => ({ userId, vote }))
        };
      }
    },
    Mutation: {
      createSession: () => {
        const session = new Session();
        sessions.set(session.sessionId, session);

        return session.sessionId;
      },
      join: (_: any, { name, sessionId }, { userId }) => {
        const session = sessions.get(sessionId);

        if (!session) {
          throw new Error('No such session');
        }

        if (session.join({ id: userId, name })) {
          pubsub.publish(
            getSessionTrigger(sessionId, SubscriptionTrigger.PersonJoined),
            { personJoined: session.users }
          );
        }

        console.log(session);
        return session.state;
      },
      vote: (_, { vote, sessionId }, { userId }) => {
        const session = sessions.get(sessionId);

        if (!session) {
          throw new Error('No such session');
        }

        if (session.registerVote(userId, vote)) {
          pubsub.publish(
            getSessionTrigger(sessionId, SubscriptionTrigger.VoteCast),
            {
              voteCast: [...session.results()].map(([id]) =>
                session.users.find(user => user.id === id)
              )
            }
          );
        }

        return {
          success: true
        };
      },
      startVoting: (_, { sessionId }) => {
        const session = sessions.get(sessionId);

        if (!session) {
          throw new Error('No such session');
        }

        session.newRound();

        pubsub.publish(
          getSessionTrigger(sessionId, SubscriptionTrigger.VotingStarted),
          {
            votingStarted: { success: true }
          }
        );

        return {
          success: true
        };
      },
      endRound: (_, { sessionId }) => {
        const session = sessions.get(sessionId);

        if (!session) {
          throw new Error('No such session');
        }

        session.endRound();

        return {
          success: true
        };
      }
    },
    Subscription: {
      votingStarted: {
        subscribe: (_, { sessionId }) => {
          if (!sessions.has(sessionId)) {
            throw new Error('Session not found');
          }

          return pubsub.asyncIterator(
            getSessionTrigger(sessionId, SubscriptionTrigger.VotingStarted)
          );
        }
      },
      personJoined: {
        subscribe: (_, { sessionId }) => {
          if (!sessions.has(sessionId)) {
            throw new Error('Session not found');
          }

          return pubsub.asyncIterator(
            getSessionTrigger(sessionId, SubscriptionTrigger.PersonJoined)
          );
        }
      },
      personDisconnected: {
        subscribe: (_, { sessionId }) => {
          if (!sessions.has(sessionId)) {
            throw new Error('Session not found');
          }

          return pubsub.asyncIterator(
            getSessionTrigger(sessionId, SubscriptionTrigger.PersonDisconnected)
          );
        }
      },
      voteCast: {
        subscribe: (_, { sessionId }) => {
          if (!sessions.has(sessionId)) {
            throw new Error('Session not found');
          }

          return pubsub.asyncIterator(
            getSessionTrigger(sessionId, SubscriptionTrigger.VoteCast)
          );
        }
      }
    }
  };

  const expressServer = express();
  expressServer.set('port', process.env.PORT || 8080);
  const apolloServer = new ApolloServer({
    typeDefs: await importSchema(path.join(__dirname, './schema.graphql')),
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
      keepAlive: 20000,
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

            console.log(`User ${context.userId} disconnected`);

            const session = [...sessions.values()].find(it =>
              it.hasUser(context.userId)
            );
            if (session?.leave(context.userId)) {
              pubsub.publish(
                getSessionTrigger(
                  session.sessionId,
                  SubscriptionTrigger.PersonDisconnected
                ),
                { personDisconnected: session.users }
              );
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
  expressServer.use(/\/.*/, async (req, res) => {
    const muiSheets = new ServerStyleSheets();
    const jssSheets = new SheetsRegistry();

    const { Bootstrap } = (await import(path.join(__dirname, 'ssr'))).default;

    const { html, css } = StyleSheetServer.renderStatic(() =>
      ReactDomServer.renderToString(
        muiSheets.collect(
          <JssProvider registry={jssSheets}>
            <ServerLocation url={req.originalUrl}>
              <Bootstrap />
            </ServerLocation>
          </JssProvider>
        )
      )
    );

    const result = webTemplate(
      html,
      [muiSheets.toString(), jssSheets.toString()].join('\n'),
      css.content,
      css.renderedClassNames,
      '/web.js'
    );

    res.send(result);
  });

  await new Promise(res => httpServer.listen(expressServer.get('port'), res));
  console.log(
    `GraphQL ready at http://localhost:${expressServer.get('port')}${
      apolloServer.graphqlPath
    }`
  );
  console.log(
    `GraphQL subscriptions ready at ws://localhost:${expressServer.get(
      'port'
    )}${apolloServer.subscriptionsPath}`
  );
})();
