import React, { useEffect, useMemo, useReducer } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { createMuiTheme, Theme, ThemeOptions } from '@material-ui/core/styles';
import { PaletteType } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

type ThemeState = {
  type: PaletteType;
};

type DispatchAction = {
  darkMode: boolean;
};

type Props = {
  children: React.ReactNode;
  lightTheme: ThemeOptions;
  darkTheme: ThemeOptions;
};

const setPaletteType = (paletteType: PaletteType) => {
  return {
    type: paletteType,
  };
};

const reducer = (_: ThemeState, { darkMode }: DispatchAction) =>
  darkMode ? setPaletteType('dark') : setPaletteType('light');

const ThemeContextState = React.createContext<ThemeState>(setPaletteType('dark'));
const ThemeContextDispatch = React.createContext<React.Dispatch<DispatchAction>>(
  {} as React.Dispatch<DispatchAction>
);

export const CustomThemeProvider: React.FC<Props> = ({ lightTheme, darkTheme, children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [state, dispatch] = useReducer(reducer, setPaletteType(prefersDarkMode ? 'dark' : 'light'));

  useEffect(() => {
    dispatch({ darkMode: prefersDarkMode });
  }, [prefersDarkMode]);

  const theme: Theme = useMemo(() => {
    const currentTheme = state.type === 'dark' ? darkTheme : lightTheme;

    return createMuiTheme({ ...currentTheme });
  }, [state, lightTheme, darkTheme]);

  return (
    <ThemeContextState.Provider value={state}>
      <ThemeContextDispatch.Provider value={dispatch}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContextDispatch.Provider>
    </ThemeContextState.Provider>
  );
};
