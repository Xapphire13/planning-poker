
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import ':shared/webpack-global-fix';
import WithStylesContext from 'react-with-styles/lib/WithStylesContext';
// @ts-ignore
import AphroditeInterface from 'react-with-styles-interface-aphrodite';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/core';
import { split, from } from 'apollo-link';
import { HttpLink, createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';
import uuid from 'uuid/v4';
import { StyleSheet } from 'aphrodite';
import LocalStorageUtils from './LocalStorageUtils';
import User from ':shared/User';
import isServer from ':shared/isServer';
import App from './App';
import DefaultTheme, { muiTheme } from ':shared/theme/DefaultTheme';

let user: User | undefined;

if (!isServer()) {
  // Create user if not-exists
  user = LocalStorageUtils.getItem<User>('user');
  if (!user) {
    user = {
      id: uuid(),
      name: '',
    };
  }
  LocalStorageUtils.setItem('user', user);
}

function createClientLink() {
  const HOST = window.location.host;

  const httpLink = new HttpLink({
    uri: `http://${HOST}/graphql`,
  });

  const wsLink = new WebSocketLink({
    uri: `ws://${HOST}/graphql`,
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
        definition.kind === 'OperationDefinition'
        && definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const linkContext = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      'X-USER-ID': user!.id,
    },
  }));

  const onErrorHandler = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ));
    }
    if (networkError) console.log(`[Network error]: ${JSON.stringify(networkError)}`);
  });

  return linkContext.concat(from([onErrorHandler, apolloLink]));
}

function createServerLink(port: number = 4000) {
  const fetch = require('node-fetch');

  return createHttpLink({
    uri: `http://localhost:${port}/graphql`,
    fetch,
  });
}

export type BootstrapProps = {
  port?: number;
}

export function Bootstrap({ port }: BootstrapProps) {
  // Remove SSR MUI-Styles
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.remove();
  }, []);

  const client = new ApolloClient({
    link: isServer() ? createServerLink(port) : createClientLink(),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={muiTheme}>
        <WithStylesContext.Provider
          value={{
            stylesInterface: AphroditeInterface,
            stylesTheme: DefaultTheme,
          }}
        >
          <App />
        </WithStylesContext.Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

if (!isServer()) {
  const entryPointScript = document.getElementById('entry-point-script') as HTMLScriptElement;

  const renderedClassNames = entryPointScript.getAttribute('data-renderedClassNames')!.split(',');
  if (renderedClassNames) {
    StyleSheet.rehydrate(renderedClassNames);
  }
  ReactDOM.hydrate(<Bootstrap />, document.getElementById('react-root'));
}
