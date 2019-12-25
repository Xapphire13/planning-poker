
import React from "react";
import ReactDom from "react-dom";
import "./webpack-global-fix";
import WithStylesContext from 'react-with-styles/lib/WithStylesContext';
// @ts-ignore
import AphroditeInterface from 'react-with-styles-interface-aphrodite';
import DefaultTheme from '../client/theme/DefaultTheme';
import {
  createMemorySource,
  createHistory,
  LocationProvider
} from "@reach/router";

import App from "./App";

// Root document styles
document.documentElement.style.height = "100%";
document.documentElement.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.position = "relative";

const reactRoot = document.createElement("div");
document.body.appendChild(reactRoot);

const source = createMemorySource("/");
const history = createHistory(source);

function Bootstrap() {
  return <LocationProvider history={history}>
    <WithStylesContext.Provider
      value={{
        stylesInterface: AphroditeInterface,
        stylesTheme: DefaultTheme
      }}>
      <App />
    </WithStylesContext.Provider>
  </LocationProvider>
}

ReactDom.render(<Bootstrap />, reactRoot);