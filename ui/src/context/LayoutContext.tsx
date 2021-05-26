import React from 'react';

const LayoutStateContext = React.createContext<LayoutState>({ isSidebarOpened: true });
const LayoutDispatchContext = React.createContext<React.Dispatch<any>>({} as React.Dispatch<any>);

type LayoutState = {
  isSidebarOpened: boolean;
};

function layoutReducer(state: LayoutState, action: any) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpened: !state.isSidebarOpened };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const LayoutProvider: React.FC = ({ children }) => {
  var [state, dispatch] = React.useReducer(layoutReducer, {
    isSidebarOpened: true,
  });
  return (
    <LayoutStateContext.Provider value={state}>
      <LayoutDispatchContext.Provider value={dispatch}>{children}</LayoutDispatchContext.Provider>
    </LayoutStateContext.Provider>
  );
};
