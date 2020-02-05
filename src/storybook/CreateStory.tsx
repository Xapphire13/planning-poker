import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import WithStylesContext from 'react-with-styles/lib/WithStylesContext';
// @ts-ignore
import AphroditeInterface from 'react-with-styles-interface-aphrodite';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import DefaultTheme, { muiTheme } from ':web/theme/DefaultTheme';
import createStylesFn from ':web/theme/createStylesFn';

const stylesFn = createStylesFn(({ color, fontFamily }) => ({
  container: {
    '@import':
      "url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap')",
    background: color.background,
    color: color.text.default,
    fontFamily
  }
}));

function Bootstrap({ children }: React.PropsWithChildren<{}>) {
  return (
    <ThemeProvider theme={muiTheme}>
      <WithStylesContext.Provider
        value={{
          stylesInterface: AphroditeInterface,
          stylesTheme: DefaultTheme
        }}
      >
        {children}
      </WithStylesContext.Provider>
    </ThemeProvider>
  );
}

function Container({ children }: React.PropsWithChildren<{}>) {
  const { css, styles } = useStyles({ stylesFn });

  return <div {...css(styles.container)}>{children}</div>;
}

export default function CreateStory(Story: React.ReactType) {
  return () => (
    <Bootstrap>
      <Container>
        <Story />
      </Container>
    </Bootstrap>
  );
}
