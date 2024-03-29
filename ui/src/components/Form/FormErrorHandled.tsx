import classNames from 'classnames';
import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';

import { useDisplayErrorMessage } from '../../context/MessagesContext';
import { parseError } from '../../pages/error/errorTypes';

type Renderable = number | string | React.ReactElement | React.ReactNode | Renderable[];
type Callable = (callback: (fn: () => Promise<void>) => void) => Renderable;

const isCallable = (maybeCallable: any): maybeCallable is Callable => {
  return typeof maybeCallable === 'function';
};

type Props = {
  size?: string;
  className?: string;
  children: Callable | Renderable;
  onSubmit: () => Promise<void>;
  withSubmit?: boolean;
};

const FormErrorHandled: (props: Props) => React.ReactElement = ({
  size,
  className,
  children,
  onSubmit,
  withSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const displayErrorMessage = useDisplayErrorMessage();

  const loadAndCatch = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      handleError(err);
    }
    setLoading(false);
  };

  function handleError(err: any) {
    const error = parseError(err);
    const errorMsgList = error?.message instanceof Array ? error.message : undefined;
    const errorMsgContent = error?.message instanceof Array ? undefined : error?.message;
    displayErrorMessage({
      header: error?.header,
      message: errorMsgContent,
      list: errorMsgList?.map(e => (!!e ? e.substr(0, 256) + '...' : '')),
    });
  }

  return (
    <Form
      className={classNames('form-error-handled', className)}
      size={size}
      loading={loading}
      onSubmit={() => loadAndCatch(onSubmit)}
    >
      {isCallable(children) ? children(callback => loadAndCatch(callback)) : children}
      {withSubmit && <Button className="ghost" content="Submit" loading={loading} />}
    </Form>
  );
};

export default FormErrorHandled;
