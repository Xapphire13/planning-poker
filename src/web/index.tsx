
import React from "react";
import ":shared/webpack-global-fix";
import WithStylesContext from 'react-with-styles/lib/WithStylesContext';
// @ts-ignore
import AphroditeInterface from 'react-with-styles-interface-aphrodite';
import DefaultTheme, { muiTheme } from ':shared/theme/DefaultTheme';
import {
  LocationProvider
} from "@reach/router";
import BoostrapReactRoot from ":shared/BootstrapReactRoot";
import ApolloClient from "apollo-client";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from "@apollo/react-hooks"
import App from "./App";
import { ThemeProvider } from "@material-ui/core";
import { split, from } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from "apollo-link-error";

const HOST = window.location.host;

const httpLink = new HttpLink({
  uri: `http://${HOST}/graphql`
});

const wsLink = new WebSocketLink({
  uri: `ws://${HOST}/graphql`,
  options: {
    reconnect: true
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
  httpLink,
);

const onErrorHandler = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: from([onErrorHandler, apolloLink]),
  cache: new InMemoryCache()
});

function Bootstrap() {
  return <ApolloProvider client={client}>
    <LocationProvider>
      <ThemeProvider theme={muiTheme}>
        <WithStylesContext.Provider
          value={{
            stylesInterface: AphroditeInterface,
            stylesTheme: DefaultTheme
          }}>
          <App />
        </WithStylesContext.Provider>
      </ThemeProvider>
    </LocationProvider>
  </ApolloProvider>;
}

BoostrapReactRoot(Bootstrap);