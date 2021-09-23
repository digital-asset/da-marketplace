import React, { useState } from 'react';
import { useStreamQueries } from '../../Main';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import Account from './Account';
import Tile from '../../components/Tile/Tile';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { Button, Form } from 'semantic-ui-react';
import {ServicePageProps, createDropdownProp, makeDamlSet} from '../common';
import { usePartyName } from '../../config';
import { useLedger, useParty } from '@daml/react';
import { useDisplayErrorMessage } from '../../context/MessagesContext';

const Assets: React.FC<ServicePageProps<CustodyService>> = ({ services }: ServicePageProps<CustodyService>) => {
  const party = useParty();
  const ledger = useLedger();
  const { getName } = usePartyName(party);

  const { contracts: assets } = useStreamQueries(AssetDescription);
  const displayErrorMessage = useDisplayErrorMessage();

  const [creditAsset, setCreditAsset] = useState<string>('');
  const [creditQuantity, setCreditQuantity] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  const clientServices = services.filter(s => s.payload.customer === party);

  const onRequestDeposit = async () => {
    const asset = assets.find(i => i.payload.description === creditAsset);
    const targetAccount = services.find(a => a.contractId === selectedAccount);

    if (!asset || !targetAccount) return;
    const service = clientServices.find(
      s => s.payload.provider === targetAccount.payload.account.provider
    );
    if (!service)
      return displayErrorMessage({
        message: `${getName(
          targetAccount.payload.account.provider
        )} does not offer Custodial services to ${getName(party)}`,
      });

    await ledger.exercise(CustodyService.RequestDeposit, service.contractId, {
      asset: { id: asset.payload.assetId, quantity: creditQuantity },
      observers: makeDamlSet<string>([])
    });
    setCreditAsset('');
    setCreditQuantity('');
  };

  return (
    <div className="assets">
      <div className="page-section-row">
        <div>
          {services.map(a => (
            <Account key={a.contractId}
                     targetAccount={{
                         account: a.payload.account,
                         contractId: a.contractId.replace('#', '_')
                       }}
                     services={services} />
          ))}
        </div>

        <Tile className="inline" header="Quick Deposit">
          <br />
          <FormErrorHandled onSubmit={() => onRequestDeposit()}>
            <Form.Select
              label="Account"
              options={services
                .filter(a => a.payload.account.owner === party)
                .map(a => {
                  return {
                    text: a.payload.account.id.label,
                    value: a.contractId.replace('#', '_'),
                  };
                })}
              value={selectedAccount}
              onChange={(_, data) => setSelectedAccount(data.value as string)}
            />
            <Form.Select
              label="Asset"
              options={assets.map(a => createDropdownProp(a.payload.description))}
              value={creditAsset}
              onChange={(_, data) => setCreditAsset(data.value as string)}
            />
            <Form.Input
              label="Quantity"
              type="number"
              value={creditQuantity}
              onChange={(_, data) => setCreditQuantity(data.value as string)}
            />
            <Button
              type="submit"
              className="ghost"
              disabled={creditAsset === '' || creditQuantity === '' || creditQuantity === '0'}
              content="Submit"
            />
          </FormErrorHandled>
        </Tile>
      </div>
    </div>
  );
};

export default Assets;
