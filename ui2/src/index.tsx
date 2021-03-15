import React from "react";
import ReactDOM from "react-dom";
import { CssBaseline } from "@material-ui/core";

import Themes from "./themes";
import Main from "./Main";
import { LayoutProvider } from "./context/LayoutContext";
import { UserProvider } from "./context/UserContext";
import { CustomThemeProvider } from "./context/ThemeContext";

ReactDOM.render(
  <LayoutProvider>
    <UserProvider>
      <CustomThemeProvider lightTheme={Themes.light} darkTheme={Themes.dark}>
        <CssBaseline />
        <Main defaultPath="/apps" />
      </CustomThemeProvider>
    </UserProvider>
  </LayoutProvider>,
  document.getElementById("root"),
);
