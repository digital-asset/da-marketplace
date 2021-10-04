import React, { useState } from 'react';
import { useStreamQueries } from '../../Main';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import Account from './Account';
import Tile from '../../components/Tile/Tile';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { Button, Form } from 'semantic-ui-react';
import { ServicePageProps, createDropdownProp } from '../common';
import { usePartyName } from '../../config';
import { useLedger, useParty } from '@daml/react';
import { useDisplayErrorMessage } from '../../context/MessagesContext';

const Assets: React.FC<ServicePageProps<CustodyService>> = ({
  services,
}: ServicePageProps<CustodyService>) => {
  const party = useParty();
  const ledger = useLedger();
  const { getName } = usePartyName(party);

  const { contracts: allAssets } = useStreamQueries(AssetDescription);
  const clientServices = services.filter(s => s.payload.customer === party);
  const assets = allAssets.filter(a =>
    clientServices.map(c => c.payload.provider).includes(a.payload.registrar)
  );
  const displayErrorMessage = useDisplayErrorMessage();

  const [creditAsset, setCreditAsset] = useState<string>('');
  const [creditQuantity, setCreditQuantity] = useState<string>('');

  const onRequestDeposit = async () => {
    const asset = assets.find(i => i.payload.description === creditAsset);

    if (!asset) return;
    const service = clientServices.find(s => s.payload.provider === asset.payload.registrar);
    if (!service)
      return displayErrorMessage({
        message: `${getName(
          asset.payload.registrar
        )} does not offer Custodial services to ${getName(party)}`,
      });

    await ledger.exercise(CustodyService.RequestDeposit, service.contractId, {
      asset: { id: asset.payload.assetId, quantity: creditQuantity },
    });
    setCreditAsset('');
    setCreditQuantity('');
  };

  return (
    <div className="assets">
      <div className="page-section-row">
        <div>
          {services.map(a => (
            <Account
              key={a.contractId}
              targetAccount={{
                account: a.payload.account,
                contractId: a.contractId.replace('#', '_'),
              }}
              services={services}
            />
          ))}
        </div>

        <Tile className="inline" header="Quick Deposit">
          <br />
          <FormErrorHandled onSubmit={() => onRequestDeposit()}>
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
