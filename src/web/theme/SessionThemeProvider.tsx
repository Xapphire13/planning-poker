import React, { useState } from 'react';
import { ThemeProvider, Theme } from '@material-ui/core';
import { muiTheme } from ':web/theme/DefaultTheme';

export type SessionThemeProviderProps = {
  children: NonNullable<React.ReactNode> | React.ReactNodeArray;
};

type ThemeHandler = (value: Theme) => void;

export const ThemeContext = React.createContext<ThemeHandler | undefined>(
  undefined
);

export default function SessionThemeProvider({
  children,
}: SessionThemeProviderProps) {
  const [theme, setTheme] = useState(muiTheme);
  const updateTheme = (value: Theme) => {
    setTheme(value);
  };

  return (
    <ThemeContext.Provider value={updateTheme}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
