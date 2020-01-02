
import React from 'react';
import ReactDOM from 'react-dom';
import '../shared/webpack-global-fix';
import WithStylesContext from 'react-with-styles/lib/WithStylesContext';
// @ts-ignore
import AphroditeInterface from 'react-with-styles-interface-aphrodite';
import {
  createMemorySource,
  createHistory,
  LocationProvider,
} from '@reach/router';
import { ThemeProvider } from '@material-ui/core';
import DefaultTheme, { muiTheme } from '../shared/theme/DefaultTheme';
import App from ':client/App';

const source = createMemorySource('/');
const history = createHistory(source);

function Bootstrap() {
  return (
    <LocationProvider history={history}>
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
    </LocationProvider>
  );
}

ReactDOM.render(<Bootstrap />, document.getElementById('react-root'));
