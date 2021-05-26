import React, { useEffect, useState } from 'react';
import { Header, Button, Form, Modal } from 'semantic-ui-react';

import { Field, FieldComponents } from './Fields';
import { IconClose, InformationIcon } from '../../icons/icons';

import BackButton from '../../components/Common/BackButton';
import classNames from 'classnames';

export interface InputDialogProps<T extends { [key: string]: any }> {
  open: boolean;
  title: string;
  subtitle?: string;
  defaultValue: T;
  fields: Record<keyof T, Field>;
  onClose: (state: T | null) => Promise<void>;
  onChange?: (state: T | null) => void;
  isModal?: boolean;
  isInline?: boolean;
  disabled?: boolean;
}

export function InputDialog<T extends { [key: string]: any }>(props: InputDialogProps<T>) {
  const [state, setState] = useState<T>(props.defaultValue);
  const { onChange } = props;

  useEffect(() => onChange && onChange(state), [state, onChange]);

  const content = (
    <FieldComponents
      fields={props.fields}
      defaultValue={props.defaultValue}
      onChange={state => state && setState(state)}
    />
  );

  const subtitle = props.subtitle && (
    <div className="subtitle">
      <InformationIcon />
      {props.subtitle}
    </div>
  );

  if (props.isModal) {
    return (
      <Modal
        className="input-dialog"
        open={props.open}
        size="small"
        onClose={() => props.onClose(null)}
      >
        <Modal.Header as="h2">{props.title}</Modal.Header>
        {!!subtitle && <Modal.Content>{props.subtitle}</Modal.Content>}
        <Modal.Content>
          <Form>{content}</Form>
        </Modal.Content>
        <Modal.Actions>
          <Button className="ghost" onClick={() => props.onClose(state)} disabled={props.disabled}>
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
    <div className={classNames('input-dialog', { inline: props.isInline })}>
      {!props.isInline && <BackButton />}
      <Header as="h2">{props.title}</Header>
      {subtitle}
      <Form>
        {content}
        <div className="submit-form">
          <Button className="ghost" onClick={() => props.onClose(state)} disabled={props.disabled}>
            Confirm
          </Button>
          {!props.isInline && (
            <Button className="a2 cancel" onClick={() => props.onClose(null)}>
              <IconClose /> Cancel
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
