import React, { useEffect, useState } from 'react';
import { Header, Button, Form, Modal } from 'semantic-ui-react';

import { Field, FieldComponents } from './Fields';
import { IconClose } from '../../icons/icons';

import BackButton from '../../components/Common/BackButton';

export interface InputDialogProps<T extends { [key: string]: any }> {
  open: boolean;
  title: string;
  defaultValue: T;
  fields: Record<keyof T, Field>;
  onClose: (state: T | null) => Promise<void>;
  onChange?: (state: T | null) => void;
  isModal?: boolean;
}

export function InputDialog<T extends { [key: string]: any }>(props: InputDialogProps<T>) {
  const [state, setState] = useState<T>(props.defaultValue);
  const [disabled, setDisabled] = useState(false);
  const { onChange } = props;

  useEffect(() => onChange && onChange(state), [state, onChange]);
  useEffect(() => {
    setDisabled(
      Object.values(state).filter(v => v !== '').length !== Object.values(props.fields).length
    );
  }, [state]);

  const content = (
    <FieldComponents
      fields={props.fields}
      defaultValue={props.defaultValue}
      onChange={state => state && setState(state)}
    />
  );

  if (props.isModal) {
    return (
      <Modal open={props.open} size="small" onClose={() => props.onClose(null)}>
        <Modal.Header as="h2">{props.title}</Modal.Header>
        <Modal.Content>
          <Form>{content}</Form>
        </Modal.Content>
        <Modal.Actions>
          <Button className="ghost" onClick={() => props.onClose(state)} disabled={disabled}>
            Confirm
          </Button>
          <Button className="ghost warning" onClick={() => props.onClose(null)}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  return (
    <div className="input-dialog">
      <BackButton />
      <Header as="h2">{props.title}</Header>
      <Form>
        {content}
        <div className="submit-form">
          <Button className="ghost" onClick={() => props.onClose(state)} disabled={disabled}>
            Confirm
          </Button>
          <a className="a2" onClick={() => props.onClose(null)}>
            <IconClose /> Cancel
          </a>
        </div>
      </Form>
    </div>
  );
}
