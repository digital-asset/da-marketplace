import React, { useEffect } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import ErrorComponent from "./pages/error/Error";
import { useUserState, useUserDispatch } from "./context/UserContext";
import Login from "./pages/login/Login";
import Apps from "./Apps";
import DamlLedger from "@daml/react";
import { httpBaseUrl, wsBaseUrl } from "./config";
import { Network } from "./apps/Network";
import { Listing } from "./apps/Listing";
import { Custody } from "./apps/Custody";
import { Trading } from "./apps/Trading";
import { Issuance } from "./apps/Issuance";

type MainProps = {
  defaultPath: string
}

export default function Main({ defaultPath }: MainProps) {
  const user = useUserState();
  
  return (
    <DamlLedger party={user.party} token={user.token} httpBaseUrl={httpBaseUrl} wsBaseUrl={wsBaseUrl}>
      <HashRouter>
        <Switch>
          <Route exact path="/" component={RootRoute} />
          <PrivateRoute exact path="/apps" component={Apps} />
          <PrivateRoute path="/apps/network" component={Network} />
          <PrivateRoute path="/apps/issuance" component={Issuance} />
          <PrivateRoute path="/apps/listing" component={Listing} />
          <PrivateRoute path="/apps/custody" component={Custody} />
          <PrivateRoute path="/apps/trading" component={Trading} />
          <PublicRoute path="/login" component={Login} />
          <Route component={ErrorComponent} />
        </Switch>
      </HashRouter>
    </DamlLedger>
  );

  function RootRoute() {
    var userDispatch = useUserDispatch();
    useEffect(() => {
      const url = new URL(window.location.toString());
      const token = url.searchParams.get('token');
      const party = url.searchParams.get('party');
      if (token === null || party === null) return;
      localStorage.setItem("daml.name", party);
      localStorage.setItem("daml.party", party);
      localStorage.setItem("daml.token", token);
      userDispatch({ type: "LOGIN_SUCCESS", name: party, party, token });
    })

    return (<Redirect to={defaultPath} />)
  }

  function PrivateRoute({ component, ...rest }: any) {
    return (
      <Route
        {...rest}
        render={props => user.isAuthenticated ? (React.createElement(component, props)) : (<Redirect to={{ pathname: "/login", state: { from: props.location } }} />)}
      />
    );
  }

  function PublicRoute({ component, ...rest }: any) {
    return (
      <Route
        {...rest}
        render={props => user.isAuthenticated ? (<Redirect to={{ pathname: "/" }} />) : (React.createElement(component, props))}
      />
    );
  }
}
