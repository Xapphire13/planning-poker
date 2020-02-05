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
            {
              personJoined: session.users
            }
          );
        }

        return {
          success: true
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
              voteCast: session.voteCount
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
      }
    },
    Subscription: {
      votingStarted: {
        subscribe: (sessionId: string) =>
          pubsub.asyncIterator([
            getSessionTrigger(sessionId, SubscriptionTrigger.VotingStarted)
          ])
      },
      personJoined: {
        subscribe: (sessionId: string) =>
          pubsub.asyncIterator([
            getSessionTrigger(sessionId, SubscriptionTrigger.PersonJoined)
          ])
      },
      personDisconnected: {
        subscribe: (sessionId: string) =>
          pubsub.asyncIterator([
            getSessionTrigger(sessionId, SubscriptionTrigger.PersonDisconnected)
          ])
      },
      voteCast: {
        subscribe: (sessionId: string) =>
          pubsub.asyncIterator([
            getSessionTrigger(sessionId, SubscriptionTrigger.VoteCast)
          ])
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

            const session = [...sessions.values()].find(it =>
              it.hasUser(context.userId)
            );
            if (session?.leave(context.userId)) {
              pubsub.publish(
                getSessionTrigger(
                  session.sessionId,
                  SubscriptionTrigger.PersonDisconnected
                ),
                {
                  voteCast: session.users
                }
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

    const result = webTemplate(
      html,
      muiSheets.toString(),
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
