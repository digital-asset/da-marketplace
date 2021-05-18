import React, { useState, useEffect } from 'react';

import { Message } from 'semantic-ui-react';

export type ErrorMessage = {
  header?: string;
  message?: string;
  list?: string[];
};

type MessagesState = {
  displayErrorMessage: (error: ErrorMessage) => void;
};

const MessagesStateContext = React.createContext<MessagesState>({
  displayErrorMessage: () => {},
});

const MessagesProvider: React.FC = ({ children }) => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [error, setError] = useState<ErrorMessage>();

  function displayErrorMessage(error: ErrorMessage) {
    setShowErrorMessage(true);
    setError(error);
  }

  useEffect(() => {
    if (showErrorMessage) {
      const timer = setInterval(() => {
        setShowErrorMessage(false);
        setError(undefined);
      }, 9000);

      return () => clearInterval(timer);
    }
  }, [showErrorMessage]);

  return (
    <MessagesStateContext.Provider value={{ displayErrorMessage }}>
      {children}
      {showErrorMessage && (
        <Message
          error
          onDismiss={() => setShowErrorMessage(false)}
          header={error?.header || 'Error'}
          content={error?.message}
          list={error?.list}
        />
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
