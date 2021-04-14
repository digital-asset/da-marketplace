import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLedger, useParty, useStreamQueries } from '@daml/react';
import { Party } from '@daml/types';
import { ServicePageProps } from '../common';
import { Form } from 'semantic-ui-react';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import {
  Service,
  CreateMarginCalculation,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';

type MarginCallProps = {
  member?: Party;
};

const MarginCallModal: React.FC<ServicePageProps<Service> & MarginCallProps> = ({
  services,
  member,
}) => {
  const party = useParty();
  const ledger = useLedger();

  const [customer, setCustomer] = useState<Party>();
  const [targetAmount, setTargetAmount] = useState<string>();

  useEffect(() => {
    if (!!member) {
      setCustomer(member);
    }
  }, [member]);

  const requestAccount = async () => {
    const service = services.find(
      s => s.payload.customer === customer && s.payload.provider === party
    );
    if (!service || !targetAmount) return;
    const request: CreateMarginCalculation = {
      calculationId: uuidv4(),
      currency: 'USD',
      targetAmount: targetAmount,
    };
    await ledger.exercise(Service.CreateMarginCalculation, service.contractId, request);
    setCustomer(undefined);
    setTargetAmount(undefined);
  };

  const customers: DropdownItemProps[] = services.map((c, i) => ({
    key: i,
    text: c.payload.customer,
    value: c.payload.customer,
  }));

  return (
    <ModalFormErrorHandled onSubmit={() => requestAccount()} title="Perform Margin Call">
      <Form.Select
        label="Customer"
        placeholder="Select..."
        required
        min={1}
        options={customers}
        value={customer}
        onChange={(_, change) => setCustomer(change.value as Party)}
      />
      <Form.Input
        label="Target Amount"
        placeholder="0"
        type="number"
        onChange={(_, change) => setTargetAmount(change.value as string)}
      />
    </ModalFormErrorHandled>
  );
};

export default MarginCallModal;
