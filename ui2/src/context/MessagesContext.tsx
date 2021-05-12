import React, { useState, useEffect } from 'react';

import { Message } from 'semantic-ui-react';

type MessagesState = {
  displayErrorMessage: () => void;
};

const MessagesStateContext = React.createContext<MessagesState>({
  displayErrorMessage: () => {},
});

const MessagesProvider: React.FC = ({ children }) => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  function displayErrorMessage() {
    setShowErrorMessage(true);
  }

  useEffect(() => {
    if (showErrorMessage) {
      const timer = setInterval(() => {
        setShowErrorMessage(false);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [showErrorMessage]);

  return (
    <MessagesStateContext.Provider value={{ displayErrorMessage }}>
      {children}
      {showErrorMessage && (
        <Message>
          <Message.Header></Message.Header>
          <p>HELLOOOOOO</p>
        </Message>
      )}
    </MessagesStateContext.Provider>
  );
};

function useDisplayErrorMessage() {
  const context = React.useContext<MessagesState>(MessagesStateContext);
  if (context === undefined) {
    throw new Error('useCustomerServices must be used within a ServicesProvider');
  }
  return context.displayErrorMessage;
}

export { MessagesProvider, useDisplayErrorMessage };
