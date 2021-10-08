import React, { useEffect, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import { v4 as uuidv4 } from 'uuid';

import { useLedger, useParty } from '@daml/react';
import { Party } from '@daml/types';

import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import {
  CreateMarkToMarket,
  Service,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';

import { useStreamQueries } from '../../Main';
import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';
import { usePartyName } from '../../config';
import { ServicePageProps } from '../common';
import { CurrencySelect } from './CurrencySelect';

type MTMProps = {
  member?: Party;
};

const MTMCalculationModal: React.FC<ServicePageProps<Service> & MTMProps> = ({
  services,
  member,
}) => {
  const party = useParty();
  const ledger = useLedger();
  const { getName } = usePartyName(party);

  const [customer, setCustomer] = useState<Party>();
  const [amount, setAmount] = useState<string>();

  const [currencyId, setCurrencyId] = useState<Id | undefined>(undefined);
  const assets = useStreamQueries(AssetDescription).contracts;

  useEffect(() => {
    if (!!member) {
      setCustomer(member);
    }
  }, [member]);

  useEffect(() => {
    if (!currencyId && assets.length > 0) {
      setCurrencyId(assets.find(c => c.payload.assetId.label === 'USD')?.payload.assetId);
    }
  }, [currencyId, assets]);

  const handleCalculation = async () => {
    const service = services.find(
      s => s.payload.customer === customer && s.payload.provider === party
    );
    if (!service || !amount || !currencyId) return;
    const request: CreateMarkToMarket = {
      calculationId: uuidv4(),
      currency: currencyId,
      mtmAmount: amount,
    };
    await ledger.exercise(Service.CreateMarkToMarket, service.contractId, request);
    setCustomer(undefined);
    setAmount(undefined);
  };

  const customers: DropdownItemProps[] = services.map((c, i) => ({
    key: i,
    text: getName(c.payload.customer),
    value: c.payload.customer,
  }));

  return (
    <ModalFormErrorHandled onSubmit={() => handleCalculation()} title="Perform Mark to Market">
      <Form.Select
        label="Customer"
        placeholder="Select..."
        required
        options={customers}
        value={customer}
        onChange={(_, change) => setCustomer(change.value as Party)}
      />
      <CurrencySelect
        setter={setCurrencyId}
        assets={assets}
        label="Currency..."
        readOnly
        selected="USD"
      />
      <Form.Input
        label="Target Amount"
        placeholder="0"
        type="number"
        onChange={(_, change) => setAmount(change.value as string)}
      />
    </ModalFormErrorHandled>
  );
};

export default MTMCalculationModal;
