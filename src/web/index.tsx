import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import WithStylesContext from 'react-with-styles/lib/WithStylesContext';
// @ts-ignore
import AphroditeInterface from 'react-with-styles-interface-aphrodite';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { split, from } from 'apollo-link';
import { HttpLink, createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';
import { v4 as uuidv4 } from 'uuid';
import { StyleSheet } from 'aphrodite';
import StorageUtils from './utils/storageUtil';
import User from ':web/User';
import isSsr from ':web/utils/isSsr';
import App from './App';
import DefaultTheme from ':web/theme/DefaultTheme';
import SessionThemeProvider from ':web/theme/SessionThemeProvider';

let user: User | undefined;

if (!isSsr()) {
  // Create user if not-exists
  user = StorageUtils.local.getItem<User>('user');
  if (!user) {
    user = {
      id: uuidv4(),
      name: '',
    };
  }
  StorageUtils.local.setItem('user', user);
}

function createClientLink() {
  const isHttps = window.location.protocol === 'https:';
  const HOST = window.location.host;

  const httpLink = new HttpLink({
    uri: `${window.location.protocol}//${HOST}/graphql`,
  });

  const wsLink = new WebSocketLink({
    uri: `${isHttps ? 'wss' : 'ws'}://${HOST}/graphql`,
    options: {
      connectionParams: {
        userId: user!.id,
      },
      reconnect: true,
      reconnectionAttempts: 10,
    },
  });

  const apolloLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  const linkContext = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      'X-USER-ID': user!.id,
    },
  }));

  const onErrorHandler = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }
    if (networkError)
      console.log(`[Network error]: ${JSON.stringify(networkError)}`);
  });

  return linkContext.concat(from([onErrorHandler, apolloLink]));
}

function createServerLink(port: number = 4000) {
  // eslint-disable-next-line global-require
  const fetch = require('node-fetch');

  return createHttpLink({
    uri: `http://localhost:${port}/graphql`,
    fetch,
  });
}

export type BootstrapProps = {
  port?: number;
};

export default function Bootstrap({ port }: BootstrapProps) {
  // Remove SSR styles
  useEffect(() => {
    document.querySelector('#server-side-styles')?.remove();
  }, []);

  const client = new ApolloClient({
    link: isSsr() ? createServerLink(port) : createClientLink(),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <SessionThemeProvider>
        <WithStylesContext.Provider
          value={{
            stylesInterface: AphroditeInterface,
            stylesTheme: DefaultTheme,
          }}
        >
          <App />
        </WithStylesContext.Provider>
      </SessionThemeProvider>
    </ApolloProvider>
  );
}

if (!isSsr()) {
  const entryPointScript = document.getElementById(
    'entry-point-script'
  ) as HTMLScriptElement;

  const renderedClassNames = entryPointScript
    .getAttribute('data-renderedClassNames')!
    .split(',');
  if (renderedClassNames) {
    StyleSheet.rehydrate(renderedClassNames);
  }
  ReactDOM.hydrate(<Bootstrap />, document.getElementById('react-root'));
}
