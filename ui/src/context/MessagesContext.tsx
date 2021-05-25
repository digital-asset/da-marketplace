import React, { useState, useEffect } from 'react';

import { Message, Header } from 'semantic-ui-react';

type Message = {
  header?: string;
  message?: string;
  list?: string[];
};

enum MessageType {
  ERROR = 'Error',
  SUCCESS = 'Success',
}

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
  const [messageType, setMessageType] = useState<MessageType>();
  const [message, setMessage] = useState<Message>();

  function displayErrorMessage(message: Message) {
    setMessageType(MessageType.ERROR);
    handleNewMessage(message);
  }

  function displaySuccessMessage(message: Message) {
    setMessageType(MessageType.SUCCESS);
    handleNewMessage(message);
  }

  function handleNewMessage(message: Message) {
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
          error={messageType === MessageType.ERROR}
          success={messageType === MessageType.SUCCESS}
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
    throw new Error('useDisplayErrorMessage must be used within a MessagesContext');
  }
  return context.displayErrorMessage;
}

function useDisplaySuccessMessage() {
  const context = React.useContext<MessagesState>(MessagesStateContext);
  if (context === undefined) {
    throw new Error('useDisplaySuccessMessage must be used within a MessagesContext');
  }
  return context.displaySuccessMessage;
}

export { MessagesProvider, useDisplayErrorMessage, useDisplaySuccessMessage };
