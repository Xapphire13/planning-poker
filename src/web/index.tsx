
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
import { setContext } from "apollo-link-context";
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from "apollo-link-error";
import LocalStorageUtils from "./LocalStorageUtils";
import User from ":shared/User";
import uuid from "uuid/v4";

const HOST = window.location.host;

// Create user if not-exists
let user = LocalStorageUtils.getItem<User>("user");
if (!user) {
  user = {
    id: uuid(),
    name: ""
  };
}
LocalStorageUtils.setItem("user", user);

const httpLink = new HttpLink({
  uri: `http://${HOST}/graphql`
});

const wsLink = new WebSocketLink({
  uri: `ws://${HOST}/graphql`,
  options: {
    connectionParams: {
      userId: user!.id
    },
    reconnect: true,
    reconnectionAttempts: 10
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

const linkContext = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "X-USER-ID": user!.id
    }
  }
});

const onErrorHandler = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${JSON.stringify(networkError)}`);
});

const client = new ApolloClient({
  link: linkContext.concat(from([onErrorHandler, apolloLink])),
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