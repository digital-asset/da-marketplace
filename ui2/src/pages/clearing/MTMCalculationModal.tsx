import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLedger, useParty } from '@daml/react';
import { Party } from '@daml/types';
import { ServicePageProps } from '../common';
import { Form } from 'semantic-ui-react';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import {
  CreateMarkToMarket,
  Service,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';
import { usePartyName } from '../../config';

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

  useEffect(() => {
    if (!!member) {
      setCustomer(member);
    }
  }, [member]);

  const handleCalculation = async () => {
    const service = services.find(
      s => s.payload.customer === customer && s.payload.provider === party
    );
    if (!service || !amount) return;
    const request: CreateMarkToMarket = {
      calculationId: uuidv4(),
      currency: 'USD',
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
