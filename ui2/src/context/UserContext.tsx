import React from "react";
import { History } from 'history'; 
import { dablLoginUrl, getParty, getToken } from "../config";

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
  const name = localStorage.getItem("daml.name")
  const party = localStorage.getItem("daml.party")
  const token = localStorage.getItem("daml.token")

  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!token,
    name: name || "",
    party: party || "",
    token: token || ""
  });

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
    name : string,
    history : History,
    setIsLoading : React.Dispatch<React.SetStateAction<boolean>>,
    setError : React.Dispatch<React.SetStateAction<boolean>>) {
  setError(false);
  setIsLoading(true);

  if (!!name) {
    
    var party = getParty(name);
    var token = getToken(party);
    localStorage.setItem("daml.name", name);
    localStorage.setItem("daml.party", party);
    localStorage.setItem("daml.token", token);

    dispatch({ type: "LOGIN_SUCCESS", name, party, token });
    setError(false);
    setIsLoading(false);
    history.push("/apps");
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

const loginDablUser = () => {
  window.location.assign(`https://${dablLoginUrl}`);
}

function signOut(dispatch : React.Dispatch<any>, history : History) {
  // event.preventDefault();
  localStorage.removeItem("daml.party");
  localStorage.removeItem("daml.token");

  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}

export { UserProvider, useUserState, useUserDispatch, loginUser, loginDablUser, signOut };
