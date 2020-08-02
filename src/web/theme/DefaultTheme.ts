import { createMuiTheme } from '@material-ui/core';
import deepPurple from '@material-ui/core/colors/deepPurple';
import grey from '@material-ui/core/colors/grey';

const theme = {
  unit: 8,
  fontFamily: ['Roboto', 'sans-serif'],
  color: {
    primary: deepPurple[500],
    background: grey[900],
    text: {
      default: '#fff',
    },
  },
};

export const muiTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: deepPurple,
  },
});

export const createThemeWithPrimaryColor = (color: string) => {
  return createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: color,
      },
      contrastThreshold: 0,
    },
  });
};

export default theme;
