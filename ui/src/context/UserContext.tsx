import { History } from 'history';
import React from 'react';

import { damlHubLogout } from '@daml/hub-react';

import Credentials, {
  clearCredentials,
  retrieveCredentials,
  storeCredentials,
} from '../Credentials';
import paths from '../paths';

const UserStateContext = React.createContext<UserState>({
  isAuthenticated: false,
  party: '',
  token: '',
});
const UserDispatchContext = React.createContext<React.Dispatch<any>>({} as React.Dispatch<any>);

type UserState = {
  isAuthenticated: boolean;
  party: string;
  token: string;
};

function userReducer(state: UserState, action: any) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        party: action.party,
        token: action.token,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isAuthenticated: false };
    case 'SIGN_OUT_SUCCESS':
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const UserProvider: React.FC = ({ children }) => {
  const credentials = retrieveCredentials();

  var initialUserState: UserState = {
    isAuthenticated: false,
    party: '',
    token: '',
  };

  if (credentials) {
    initialUserState = {
      isAuthenticated: true,
      party: credentials.party,
      token: credentials.token,
    };
  }

  var [state, dispatch] = React.useReducer(userReducer, initialUserState);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

function useUserState() {
  var context = React.useContext<UserState>(UserStateContext);
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider');
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext<React.Dispatch<any>>(UserDispatchContext);
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider');
  }
  return context;
}

// ###########################################################

async function loginUser(
  dispatch: React.Dispatch<any>,
  history: History,
  credentials: Credentials
) {
  const { party, token } = credentials;

  try {
    storeCredentials(credentials);
    dispatch({ type: 'LOGIN_SUCCESS', party, token });
    history.push(paths.app.root);
  } catch {
    dispatch({ type: 'LOGIN_FAILURE' });
  }
}

function signOut(dispatch: React.Dispatch<any>, history: History) {
  clearCredentials();
  damlHubLogout();
  dispatch({ type: 'SIGN_OUT_SUCCESS' });
  history.push(paths.login);
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };
