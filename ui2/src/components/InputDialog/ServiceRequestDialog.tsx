import React from 'react';

import { useLedger } from '@daml/react';

import { InputDialog } from './InputDialog';
import { ServiceKind, ServiceRequestTemplates } from '../../context/ServicesContext';
import { Template } from '@daml/types';

interface Props<T extends ServiceRequestTemplates> {
  fields: any;
  open?: boolean;
  params: T;
  request: Template<T, undefined, string>;
  service: ServiceKind;
  onChange: (state: any) => void;
  onClose: (open: boolean) => void;
};

const ServiceRequestDialog = <T extends ServiceRequestTemplates,>({
  fields,
  open,
  params,
  request,
  service,
  onChange,
  onClose
}: Props<T>) => {
  const ledger = useLedger();

  const handleClose = async (state: any | null) => {
    if (!state) {
      onClose(false);
      return;
    }

    await ledger.create(request, params);
    onClose(false);
  }

  return <InputDialog
            open={!!open}
            title={`Request ${service} Service`}
            defaultValue={{
              provider: ""
            }}
            fields={fields}
            onChange={onChange}
            onClose={handleClose}/>
}

export default ServiceRequestDialog;
