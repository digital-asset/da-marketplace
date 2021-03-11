import React from "react";
import { History } from 'history';
import { getName } from "../config";
import Credentials, { clearCredentials, retrieveCredentials, storeCredentials } from "../Credentials";

const UserStateContext = React.createContext<UserState>({ isAuthenticated: false, name: "", party: "", token: "" });
const UserDispatchContext = React.createContext<React.Dispatch<any>>({} as React.Dispatch<any>);

type UserState = {
  isAuthenticated : boolean
  name : string
  party : string
  token : string
}

function userReducer(state : UserState, action : any) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true, name: action.name, party: action.party, token: action.token };
    case "LOGIN_FAILURE":
      return { ...state, isAuthenticated: false };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const UserProvider : React.FC = ({ children }) => {
  const credentials = retrieveCredentials();

  var initialUserState: UserState = {
    isAuthenticated: false,
    name: "",
    party: "",
    token: ""
  }

  if (credentials) {
    initialUserState = {
      isAuthenticated: true,
      name: getName(credentials),
      party: credentials.party,
      token: credentials.token
    }
  }

  var [state, dispatch] = React.useReducer(userReducer, initialUserState);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext<UserState>(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext<React.Dispatch<any>>(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}


// ###########################################################

async function loginUser(
    dispatch : React.Dispatch<any>,
    history : History,
    credentials : Credentials) {
  // setError(false);
  // setIsLoading(true);
  const { party, token } = credentials;
  const name = getName(credentials);

  if (!!name) {
    storeCredentials(credentials);
    dispatch({ type: "LOGIN_SUCCESS", name, party, token });
    // setError(false);
    // setIsLoading(false);
    history.push("/apps");
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    // setError(true);
    // setIsLoading(false);
  }
}

// const loginDablUser = () => {
//   window.location.assign(`https://${dablLoginUrl}`);
// }

function signOut(dispatch : React.Dispatch<any>, history : History) {
  // event.preventDefault();
  // localStorage.removeItem("daml.party");
  // localStorage.removeItem("daml.token");
  clearCredentials();
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };
