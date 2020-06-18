/* eslint-disable no-console */
import React from 'react';
import express from 'express';
import { createServer } from 'http';
import {
  ApolloServer,
  PubSub,
  IResolvers,
  AuthenticationError,
} from 'apollo-server-express';
import path from 'path';
import ReactDomServer from 'react-dom/server';
import { StyleSheetServer } from 'aphrodite';
import { ServerLocation } from '@reach/router';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { importSchema } from 'graphql-import';
import webTemplate from './webTemplate';
import Session from './Session';
import ConnectionStatus from './models/ConnectionStatus';

interface Context {
  userId: string;
}

enum SubscriptionTrigger {
  SessionStateChanged = 'SESSION_STATE_CHANGED',
  PersonJoined = 'PERSON_JOINED',
  PersonDisconnected = 'PERSON_DISCONNECTED',
  VoteCast = 'VOTE_CAST',
  ConnectionStatusChanged = 'CONNECTION_STATUS_CHANGED',
}

function getSessionTrigger(sessionId: string, trigger: SubscriptionTrigger) {
  return `${trigger}-${sessionId}`;
}

process.on('unhandledRejection', (err) => {
  console.error(err);
});

(async () => {
  /** sessionId -> Session */
  const sessions = new Map<string, Session>();
  const pubsub = new PubSub();

  function findSessionForUser(userId: string) {
    return [...sessions.values()].find((it) => it.hasUser(userId));
  }

  const resolvers: IResolvers<any, Context> = {
    Query: {
      session: (_, { sessionId }, { userId }) => {
        const session = sessions.get(sessionId);

        if (!session) {
          return null;
        }

        return {
          id: session.sessionId,
          users: session.users,
          results: session
            .results()
            .map(([userId, vote]) => ({ userId, vote })),
          state: session.getStateForUser(userId),
        };
      },
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

        if (
          session.join({
            id: userId,
            name,
            connectionStatus: ConnectionStatus.Connected,
          })
        ) {
          pubsub.publish(
            getSessionTrigger(sessionId, SubscriptionTrigger.PersonJoined),
            { personJoined: session.users }
          );

          pubsub.publish(
            getSessionTrigger(
              session.sessionId,
              SubscriptionTrigger.ConnectionStatusChanged
            ),
            {
              connectionStatusChanged: {
                id: userId,
                name,
                connectionStatus: ConnectionStatus.Connected,
              },
            }
          );
        }

        return session.state;
      },
      leave: (_, { sessionId }, { userId }) => {
        const session = sessions.get(sessionId);

        if (!session) {
          throw new Error('No such session');
        }

        if (session.leave(userId)) {
          pubsub.publish(
            getSessionTrigger(
              session.sessionId,
              SubscriptionTrigger.PersonDisconnected
            ),
            { personDisconnected: session.users }
          );
        }

        return {
          success: true,
        };
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
                session.users.find((user) => user.id === id)
              ),
            }
          );
        }

        return {
          success: true,
        };
      },
      startVoting: (_, { sessionId }) => {
        const session = sessions.get(sessionId);

        if (!session) {
          throw new Error('No such session');
        }

        session.newRound();

        pubsub.publish(
          getSessionTrigger(sessionId, SubscriptionTrigger.SessionStateChanged),
          {
            sessionStateChanged: session.state,
          }
        );

        return {
          success: true,
        };
      },
      endRound: (_, { sessionId }) => {
        const session = sessions.get(sessionId);

        if (!session) {
          throw new Error('No such session');
        }

        session.endRound();

        pubsub.publish(
          getSessionTrigger(sessionId, SubscriptionTrigger.SessionStateChanged),
          {
            sessionStateChanged: session.state,
          }
        );

        return {
          success: true,
        };
      },
    },
    Subscription: {
      sessionStateChanged: {
        subscribe: (_, { sessionId }) => {
          if (!sessions.has(sessionId)) {
            throw new Error('Session not found');
          }

          return pubsub.asyncIterator(
            getSessionTrigger(
              sessionId,
              SubscriptionTrigger.SessionStateChanged
            )
          );
        },
      },
      personJoined: {
        subscribe: (_, { sessionId }) => {
          if (!sessions.has(sessionId)) {
            throw new Error('Session not found');
          }

          return pubsub.asyncIterator(
            getSessionTrigger(sessionId, SubscriptionTrigger.PersonJoined)
          );
        },
      },
      personDisconnected: {
        subscribe: (_, { sessionId }) => {
          if (!sessions.has(sessionId)) {
            throw new Error('Session not found');
          }

          return pubsub.asyncIterator(
            getSessionTrigger(sessionId, SubscriptionTrigger.PersonDisconnected)
          );
        },
      },
      voteCast: {
        subscribe: (_, { sessionId }) => {
          if (!sessions.has(sessionId)) {
            throw new Error('Session not found');
          }

          return pubsub.asyncIterator(
            getSessionTrigger(sessionId, SubscriptionTrigger.VoteCast)
          );
        },
      },
      connectionStatusChanged: {
        subscribe: (_, { sessionId }) => {
          if (!sessions.has(sessionId)) {
            throw new Error('Session not found');
          }

          return pubsub.asyncIterator(
            getSessionTrigger(
              sessionId,
              SubscriptionTrigger.ConnectionStatusChanged
            )
          );
        },
      },
    },
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
          userId: '',
        };
      }

      const userId = req.header('X-USER-ID');

      if (!userId) {
        throw new AuthenticationError(
          'You must have valid user ID to use this API'
        );
      }

      return {
        userId,
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

        const session = findSessionForUser(userId);

        if (session) {
          const user = session.getUser(userId)!;
          user.connectionStatus = ConnectionStatus.Connected;

          pubsub.publish(
            getSessionTrigger(
              session.sessionId,
              SubscriptionTrigger.ConnectionStatusChanged
            ),
            {
              connectionStatusChanged: user,
            }
          );
        }

        return Promise.resolve({
          userId,
        });
      },
      onDisconnect: (_, ctx) => {
        if (ctx.initPromise) {
          (async () => {
            const { userId }: Context = await ctx.initPromise;

            console.log(`User ${userId} disconnected`);

            const session = findSessionForUser(userId);
            if (session) {
              const user = session.getUser(userId)!;
              user.connectionStatus = ConnectionStatus.Disconnected;

              pubsub.publish(
                getSessionTrigger(
                  session.sessionId,
                  SubscriptionTrigger.ConnectionStatusChanged
                ),
                {
                  connectionStatusChanged: user,
                }
              );
            }
          })();
        }
      },
    },
  });
  const httpServer = createServer(expressServer);

  apolloServer.applyMiddleware({ app: expressServer });
  apolloServer.installSubscriptionHandlers(httpServer);
  expressServer.use(express.static(path.resolve(__dirname, 'web')));
  // Web entry point
  expressServer.use(/\/.*/, async (req, res) => {
    if (process.env.NO_SSR) {
      res.send(webTemplate('', '', '', [], '/web.js'));

      return;
    }

    const muiSheets = new ServerStyleSheets();

    const { Bootstrap } = (await import(path.join(__dirname, 'ssr'))).default;

    const { html, css } = StyleSheetServer.renderStatic(() =>
      ReactDomServer.renderToString(
        muiSheets.collect(
          <ServerLocation url={req.originalUrl}>
            <Bootstrap />
          </ServerLocation>
        )
      )
    );

    res.send(
      webTemplate(
        html,
        muiSheets.toString(),
        css.content,
        css.renderedClassNames,
        '/web.js'
      )
    );
  });

  await new Promise((res) => httpServer.listen(expressServer.get('port'), res));
  console.log(`Ready at http://localhost:${expressServer.get('port')}`);
})();
