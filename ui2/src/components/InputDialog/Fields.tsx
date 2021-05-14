import React, { useEffect, useState } from 'react';
import { Form } from 'semantic-ui-react';

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
export type Fields = Record<string, Field>;

type FieldComponentsProps<T> = {
  defaultValue: T;
  fields: Record<keyof T, Field>;
  placeholderLabels?: boolean;
  onChange?: (state: T | null) => void;
};

export function FieldComponents<T extends Record<string, string>>(props: FieldComponentsProps<T>) {
  const { defaultValue, fields, placeholderLabels, onChange } = props;
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => onChange && onChange(state), [state]);

  function fieldsToInput([fieldName, field]: [string, Field]): JSX.Element {
    const key = field.label + field.type;

    if (field.type === 'selection') {
      return (
        <Form.Select
          key={key}
          label={!placeholderLabels ? field.label : undefined}
          placeholder={!!placeholderLabels ? field.label : undefined}
          onChange={(_, change) => setState(state => ({ ...state, [fieldName]: change.value }))}
          options={field.items.map(item => ({
            key: item,
            value: item,
            text: item,
          }))}
          value={state[fieldName]}
        />
      );
    } else if (field.type === 'checkbox') {
      return (
        <Form.Checkbox
          key={key}
          label={field.label}
          onChange={(_, change) => setState(state => ({ ...state, [fieldName]: change.checked }))}
        />
      );
    } else {
      return (
        <Form.Input
          key={key}
          required
          label={field.label}
          type={field.type}
          onChange={(_, change) => setState(state => ({ ...state, [fieldName]: change.value }))}
          placeholder={field.type === 'date' ? 'YYYY-MM-DD' : ''}
        />
      );
    }
  }

  return <>{Object.entries(fields).map(f => fieldsToInput(f))}</>;
}