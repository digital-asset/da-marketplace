import React from "react";
import ReactDOM from "react-dom";

import Themes from "./themes";
import Main from "./Main";
import { LayoutProvider } from "./context/LayoutContext";
import { UserProvider } from "./context/UserContext";
import { CustomThemeProvider } from "./context/ThemeContext";

import 'semantic-ui-css/semantic.min.css'
import './index.scss';

ReactDOM.render(
  <LayoutProvider>
    <UserProvider>
      <CustomThemeProvider lightTheme={Themes.light} darkTheme={Themes.dark}>
        <div className='app'>
          <Main defaultPath="/app" />
        </div>
      </CustomThemeProvider>
    </UserProvider>
  </LayoutProvider>,
  document.getElementById("root"),
);
