import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';

import { Field, FieldComponents } from './Fields';

export interface InputDialogProps<T extends { [key: string]: any }> {
  open: boolean;
  title: string;
  defaultValue: T;
  error?: string;
  fields: Record<keyof T, Field>;
  onClose: (state: T | null) => Promise<void>;
  onChange?: (state: T | null) => void;
}

export function InputDialog<T extends { [key: string]: any }>(props: InputDialogProps<T>) {
  const [state, setState] = useState<T>(props.defaultValue);

  useEffect(() => props.onChange && props.onChange(state), [state]);

  return (
    <Modal open={props.open} size="small" onClose={() => props.onClose(null)}>
      <Modal.Header as="h3">{props.title}</Modal.Header>
      <Modal.Content>
        <Form>
          <FieldComponents
            fields={props.fields}
            defaultValue={props.defaultValue}
            onChange={state => state && setState(state)}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button className="ghost" onClick={() => props.onClose(state)}>
          Confirm
        </Button>
        <Button className="ghost" onClick={() => props.onClose(null)}>
          Cancel
        </Button>
        {props.error && <p className="error">{props.error}</p>}
      </Modal.Actions>
    </Modal>
  );
}
