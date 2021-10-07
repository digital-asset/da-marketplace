import React, { useEffect, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';

import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { FeeSchedule } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Model';
import { Role as ExchangeRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';

import { useStreamQueries } from '../../Main';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import Tile from '../../components/Tile/Tile';
import AccountComponent from '../custody/Account';

type Props = {
  role: Readonly<CreateEvent<ExchangeRole, any, any>>;
  custodyServices: Readonly<CreateEvent<CustodyService, any, any>[]>;
};

const ManageFees: React.FC<Props> = ({ role, custodyServices }: Props) => {
  const ledger = useLedger();
  const party = useParty();
  const { contracts: feeSchedules, loading: schedulesLoading } = useStreamQueries(FeeSchedule);
  const feeSchedule = feeSchedules.find(fs => fs.payload.provider === party);

  const [assetLabel, setAssetLabel] = useState(feeSchedule?.payload.currentFee.currency.label);
  const [accountLabel, setAccountLabel] = useState('');
  const [quantity, setQuantity] = useState(
    !!feeSchedule ? feeSchedule.payload.currentFee.amount : '0.0'
  );

  useEffect(() => {
    if (!feeSchedule) return;
    setAssetLabel(feeSchedule.payload.currentFee.currency.label);
    setQuantity(feeSchedule.payload.currentFee.amount);
    setAccountLabel(feeSchedule.payload.feeAccount.id.label);
  }, [feeSchedule]);

  const assets = useStreamQueries(AssetDescription).contracts;

  const asset = assets.find(c => c.payload.assetId.label === assetLabel);
  const accounts = custodyServices
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);
  const account = accounts.find(a => a.id.label === accountLabel);
  const custodyService = custodyServices.find(c => c.payload.account.id.label === accountLabel);

  const canRequest = !feeSchedule
    ? !!assetLabel && !!asset && !!accountLabel && !!account && !!quantity
    : !!quantity;

  if (!role)
    return (
      <div>
        <h2>You must have the Exchange Role to create a Fee Schedule</h2>
      </div>
    );

  const createFeeSchedule = async () => {
    if (!feeSchedule) {
      if (!asset || !account) {
        throw Error('Asset or Account not found');
      }
      await ledger.exercise(ExchangeRole.CreateFeeSchedule, role.contractId, {
        currency: asset.payload.assetId,
        feeAccount: account,
        quantity,
      });
    } else {
      if (!asset) {
        throw Error('Asset not found');
      }
      await ledger.exercise(FeeSchedule.UpdateFeeSchedule, feeSchedule.contractId, {
        amount: quantity,
        currency: asset.payload.assetId,
      });
    }
  };

  return (
    <div className="page-section-row">
      <Tile className="inline" header="Setup Fees" loading={schedulesLoading}>
        <br />
        <FormErrorHandled onSubmit={createFeeSchedule}>
          {!feeSchedule && (
            <>
              <Form.Select
                selection
                label="Fee Account"
                options={accounts.map(c => ({
                  text: c.id.label,
                  value: c.id.label,
                }))}
                value={accountLabel}
                onChange={(_, d) => setAccountLabel((d.value && (d.value as string)) || '')}
              />
            </>
          )}
          <Form.Select
            selection
            label="Currency"
            options={assets.map(c => ({
              text: c.payload.assetId.label,
              value: c.payload.assetId.label,
            }))}
            value={!!feeSchedule ? assetLabel : assetLabel}
            onChange={(_, d) => setAssetLabel((d.value && (d.value as string)) || '')}
          />

          <Form.Input
            placeholder={!!feeSchedule ? feeSchedule.payload.currentFee.amount : quantity}
            required
            fluid
            number
            label="Fee Amount"
            value={quantity}
            onChange={e => setQuantity(e.currentTarget.value)}
          />

          <Button type="submit" disabled={!canRequest} className="ghost">
            {!!feeSchedule ? 'Update Fee Schedule' : 'Create Fee Schedule'}
          </Button>
        </FormErrorHandled>
      </Tile>
      <Tile className="inline">
        <br />
        {!!custodyService && (
          <AccountComponent
            targetAccount={{
              account: custodyService.payload.account,
              contractId: custodyService.contractId,
            }}
            services={custodyServices}
          />
        )}
      </Tile>
    </div>
  );
};

export default ManageFees;
