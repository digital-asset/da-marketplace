import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';

export interface RegularField {
  label: string;
  type: 'text' | 'number' | 'date';
}

export interface SelectionField {
  label: string;
  type: 'selection';
  items: string[];
}

export interface CheckBoxField {
  label: string;
  type: 'checkbox';
}

export type Field = RegularField | SelectionField | CheckBoxField;

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

  function fieldsToInput([fieldName, field]: [string, Field], index: number): JSX.Element {
    if (field.type === 'selection') {
      return (
        <Form.Select
          key={index}
          label={field.label}
          onChange={(_, change) => setState(state => ({ ...state, [fieldName]: change.value }))}
          options={field.items.map(item => ({ key: item, value: item, text: item }))}
          value={state[fieldName]}
        />
      );
    } else if (field.type === 'checkbox') {
      return (
        <Form.Checkbox
          key={index}
          label={field.label}
          onChange={(_, change) => setState(state => ({ ...state, [fieldName]: change.checked }))}
        />
      );
    } else {
      return (
        <Form.Input
          key={index}
          required
          label={field.label}
          type={field.type}
          onChange={(_, change) => setState(state => ({ ...state, [fieldName]: change.value }))}
          placeholder={field.type === 'date' ? 'YYYY-MM-DD' : ''}
        />
      );
    }
  }
  const fieldsAsArray: [string, Field][] = Object.entries(props.fields);

  return (
    <Modal open={props.open} size="small" onClose={() => props.onClose(null)}>
      <Modal.Header as="h3">{props.title}</Modal.Header>
      <Modal.Content>
        <Form>{fieldsAsArray.map((value, index) => fieldsToInput(value, index))}</Form>
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
