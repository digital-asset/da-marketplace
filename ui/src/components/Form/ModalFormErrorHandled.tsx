import React, { useState } from 'react';
import { Button, Form, Message, Modal } from 'semantic-ui-react';

import { ErrorMessage, parseError } from '../../pages/error/errorTypes';

type Renderable = number | string | React.ReactElement | React.ReactNode | Renderable[];
type Callable = (callback: (fn: () => Promise<void>) => void) => Renderable;

const isCallable = (maybeCallable: any): maybeCallable is Callable => {
  return typeof maybeCallable === 'function';
};

type Props = {
  title: string;
  size?: string;
  className?: string;
  children: Callable | Renderable;
  onSubmit: () => Promise<void>;
  disabled?: boolean;
  trigger?: JSX.Element;
};

const ModalFormErrorHandled: (props: Props) => React.ReactElement = ({
  title,
  children,
  onSubmit,
  disabled,
  trigger,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorMessage>();
  const [open, setOpen] = React.useState(false);

  const loadAndCatch = async (fn: () => Promise<void>) => {
    let didError = false;
    setLoading(true);
    setError(undefined);
    try {
      await fn();
    } catch (err) {
      setError(parseError(err));
      didError = true;
    }

    if (!didError) {
      setOpen(false);
    }
    setLoading(false);
  };

  const errorMsgList = error?.message instanceof Array ? error.message : undefined;
  const errorMsgContent = error?.message instanceof Array ? undefined : error?.message;
  return (
    <Modal
      as={Form}
      onSubmit={() => loadAndCatch(onSubmit)}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={trigger || <Button className="ghost">{title}</Button>}
    >
      <Modal.Header as="h2">{title}</Modal.Header>
      <Modal.Content>
        {isCallable(children) ? children(callback => loadAndCatch(callback)) : children}
        <input hidden type="submit" />
        {!!error && (
          <Message negative header={error?.header} content={errorMsgContent} list={errorMsgList} />
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button className="ghost warning" color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          disabled={disabled}
          content="Submit"
          labelPosition="right"
          icon="checkmark"
          type="submit"
          loading={loading}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ModalFormErrorHandled;
