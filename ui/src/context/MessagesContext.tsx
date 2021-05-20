import React, { useState, useEffect } from 'react';

import { Message, Header } from 'semantic-ui-react';

export type Message = {
  header?: string;
  message?: string;
  list?: string[];
};

type MessagesState = {
  displayErrorMessage: (message: Message) => void;
  displaySuccessMessage: (message: Message) => void;
};

const MessagesStateContext = React.createContext<MessagesState>({
  displayErrorMessage: () => {},
  displaySuccessMessage: () => {},
});

const MessagesProvider: React.FC = ({ children }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState<'Error' | 'Success'>();
  const [message, setMessage] = useState<Message>();

  function displayErrorMessage(message: Message) {
    setMessageType('Error');
    setShowMessage(true);
    setMessage(message);
  }

  function displaySuccessMessage(message: Message) {
    setMessageType('Success');
    setShowMessage(true);
    setMessage(message);
  }

  useEffect(() => {
    if (showMessage) {
      const timer = setInterval(() => {
        setShowMessage(false);
        setMessage(undefined);
        setMessageType(undefined);
      }, 9000);

      return () => clearInterval(timer);
    }
  }, [showMessage]);

  return (
    <MessagesStateContext.Provider value={{ displayErrorMessage, displaySuccessMessage }}>
      {children}
      {showMessage && (
        <Message
          error={messageType === 'Error'}
          success={messageType === 'Success'}
          onDismiss={() => setShowMessage(false)}
          header={<Header as="h3">{message?.header || messageType}</Header>}
          content={<p>{message?.message}</p>}
          list={message?.list}
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

function useDisplaySuccessMessage() {
  const context = React.useContext<MessagesState>(MessagesStateContext);
  if (context === undefined) {
    throw new Error('useCustomerServices must be used within a ServicesProvider');
  }
  return context.displaySuccessMessage;
}

export { MessagesProvider, useDisplayErrorMessage, useDisplaySuccessMessage };
