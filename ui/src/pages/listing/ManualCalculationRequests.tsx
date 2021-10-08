import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';

import { ManualFairValueCalculation } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Model/module';

import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';
import StripedTable from '../../components/Table/StripedTable';
import { usePartyName } from '../../config';

type Props = {
  requests: Readonly<CreateEvent<ManualFairValueCalculation, any, any>[]>;
  loading: boolean;
};

export const FairValueCalculationRequests: React.FC<Props> = ({ requests, loading }) => {
  const party = useParty();
  const ledger = useLedger();
  const { getName } = usePartyName(party);
  const [valueAmount, setValueAmount] = useState('');
  const applyCalculation = async (c: CreateEvent<ManualFairValueCalculation>) => {
    await ledger.exercise(
      ManualFairValueCalculation.ManualFairValueCalculation_Calculate,
      c.contractId,
      { price: valueAmount }
    );
  };

  return (
    <StripedTable
      headings={['Provider', 'Client', 'Listing ID', 'Currency', 'Up To', 'Action']}
      loading={loading}
      rowsClickable
      rows={requests.map(fv => {
        return {
          elements: [
            getName(fv.payload.provider),
            getName(fv.payload.customer),
            fv.payload.listingId,
            fv.payload.currency.label,
            fv.payload.upTo,
            <Button.Group floated="right">
              <ModalFormErrorHandled onSubmit={() => applyCalculation(fv)} title="Calculate">
                <Form.Input
                  label="Amount"
                  placeholder="Select..."
                  required
                  number
                  min={1}
                  value={valueAmount}
                  onChange={(_, change) => setValueAmount(change.value as string)}
                />
              </ModalFormErrorHandled>{' '}
            </Button.Group>,
          ],
        };
      })}
    />
  );
};
