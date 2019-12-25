
import React from "react";
import ":shared/webpack-global-fix";
import WithStylesContext from 'react-with-styles/lib/WithStylesContext';
// @ts-ignore
import AphroditeInterface from 'react-with-styles-interface-aphrodite';
import DefaultTheme from ':shared/theme/DefaultTheme';
import {
  LocationProvider
} from "@reach/router";
import BoostrapReactRoot from ":shared/BootstrapReactRoot";

import App from "./App";

function Bootstrap() {
  return <LocationProvider>
    <WithStylesContext.Provider
      value={{
        stylesInterface: AphroditeInterface,
        stylesTheme: DefaultTheme
      }}>
      <App />
    </WithStylesContext.Provider>
  </LocationProvider>
}

BoostrapReactRoot(Bootstrap);