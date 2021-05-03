import React, { useState } from 'react';

import { useLedger, useParty } from '@daml/react';

import { InputDialog } from './InputDialog';
import {
  ServiceKind,
  ServiceOfferTemplates,
  ServiceRequestTemplates,
} from '../../context/ServicesContext';

import { Template } from '@daml/types';
import { useStreamQueries } from '../../Main';
import { Role as TradingRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Role as CustodyRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';

interface OfferProps<T extends ServiceOfferTemplates> {
  choice?: any;
  fields: any;
  open?: boolean;
  params: T;
  offer: Template<T, undefined, string>;
  service: ServiceKind;
  onChange: (state: any) => void;
  onClose: (open: boolean) => void;
}

export const ServiceOfferDialog = <T extends ServiceOfferTemplates>({
  choice,
  fields,
  open,
  params,
  offer,
  service,
  onChange,
  onClose,
}: OfferProps<T>) => {
  const party = useParty();
  const ledger = useLedger();
  const [error, setError] = useState<string>();

  const tradingRole = useStreamQueries(TradingRole).contracts.find(
    r => r.payload.provider === party
  );

  const clearingRole = useStreamQueries(ClearingRole).contracts.find(
    r => r.payload.provider === party
  );

  const custodyRole = useStreamQueries(CustodyRole).contracts.find(
    r => r.payload.provider === party
  );

  const handleClose = async (state: any | null) => {
    if (!state) {
      onClose(false);
      return;
    }

    switch (service) {
      case ServiceKind.TRADING:
      case ServiceKind.MARKET_CLEARING: {
        if (!clearingRole || !choice) {
          setError(`You can not offer ${service} services without a Clearing Role contract.`);
          return;
        } else {
          await ledger.exercise(choice, clearingRole.contractId, params);
          onClose(false);
          return;
        }
      }
      case ServiceKind.CLEARING: {
        if (!clearingRole || !choice) {
          setError(`You can not offer ${service} services without a Clearing Role contract.`);
          return;
        } else {
          await ledger.exercise(choice, clearingRole.contractId, params);
          onClose(false);
          return;
        }
      }
      case ServiceKind.LISTING: {
        if (!tradingRole || !choice) {
          setError(`You can not offer ${service} services without a Trading Role contract.`);
          return;
        } else {
          await ledger.exercise(choice, tradingRole.contractId, params);
          onClose(false);
          return;
        }
      }
      case ServiceKind.CUSTODY:
      case ServiceKind.ISSUANCE:
        if (!custodyRole || !choice) {
          setError(`You can not offer ${service} services without a Custody Role contract.`);
          return;
        } else {
          await ledger.exercise(choice, custodyRole.contractId, params);
          onClose(false);
          return;
        }
    }
  };

  return (
    <InputDialog
      open={!!open}
      error={error}
      title={`Offer ${service} Service`}
      defaultValue={{
        provider: '',
      }}
      fields={fields}
      onChange={onChange}
      onClose={handleClose}
    />
  );
};

interface RequestProps<T extends ServiceRequestTemplates> {
  fields: any;
  open?: boolean;
  params: T;
  request: Template<T, undefined, string>;
  service: ServiceKind;
  onChange: (state: any) => void;
  onClose: (open: boolean) => void;
}

export const ServiceRequestDialog = <T extends ServiceRequestTemplates>({
  fields,
  open,
  params,
  request,
  service,
  onChange,
  onClose,
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
      open={!!open}
      title={`Request ${service} Service`}
      defaultValue={{
        provider: '',
      }}
      fields={fields}
      onChange={onChange}
      onClose={handleClose}
    />
  );
};
