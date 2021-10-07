import React from 'react';

import { useLedger } from '@daml/react';
import { Template } from '@daml/types';

import { RoleRequestTemplates, RoleKind } from '../../context/RolesContext';
import { Fields } from './Fields';
import { InputDialog } from './InputDialog';

interface RequestProps<T extends RoleRequestTemplates> {
  fields: Fields<{ operator: string }>;
  open?: boolean;
  params: T;
  request: Template<T, undefined, string>;
  role: RoleKind;
  onChange: (state: any) => void;
  onClose: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  disabled?: boolean;
}

export const RoleRequestDialog = <T extends RoleRequestTemplates>({
  fields,
  open,
  params,
  request,
  role,
  onChange,
  onClose,
  title,
  subtitle,
  disabled,
}: RequestProps<T>) => {
  const ledger = useLedger();

  const handleClose = async (state: any | null) => {
    if (!state) {
      onClose(false);
      return;
    }

    await ledger.create(request, params);
    onClose(false);
  };

  return (
    <InputDialog
      isModal
      open={!!open}
      title={title || `Request ${role} Role`}
      subtitle={subtitle}
      defaultValue={{
        operator: '',
      }}
      fields={fields}
      onChange={onChange}
      onClose={handleClose}
      disabled={disabled}
    />
  );
};
