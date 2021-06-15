import React, { useMemo, useState } from 'react';
import { useStreamQueries } from '../../Main';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import Account from './Account';
import Tile from '../../components/Tile/Tile';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { Button, Form, Header } from 'semantic-ui-react';
import { ServicePageProps, createDropdownProp } from '../common';
import { usePartyName } from '../../config';
import { useLedger, useParty } from '@daml/react';
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import TitleWithActions from '../../components/Common/TitleWithActions';
import { NewAccount } from './New';

const Assets: React.FC<ServicePageProps<Service>> = ({ services }: ServicePageProps<Service>) => {
  const { contracts: accounts, loading: accountsLoading } = useStreamQueries(AssetSettlementRule);
  const { contracts: allocatedAccounts, loading: allocatedAccountsLoading } =
    useStreamQueries(AllocationAccountRule);
  const { contracts: assets } = useStreamQueries(AssetDescription);
  const displayErrorMessage = useDisplayErrorMessage();

  const [creditAsset, setCreditAsset] = useState<string>('');
  const [creditQuantity, setCreditQuantity] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  const party = useParty();
  const ledger = useLedger();

  const { getName } = usePartyName(party);

  const allAccounts = useMemo(
    () =>
      accounts
        .map(a => {
          return { account: a.payload.account, contractId: a.contractId.replace('#', '_') };
        })
        .concat(
          allocatedAccounts.map(a => {
            return { account: a.payload.account, contractId: a.contractId.replace('#', '_') };
          })
        ),
    [accounts, allocatedAccounts]
  );

  if (accountsLoading || allocatedAccountsLoading) {
    return <div>Loading...</div>;
  }

  const clientServices = services.filter(s => s.payload.customer === party);

  const onRequestCredit = async () => {
    const asset = assets.find(i => i.payload.description === creditAsset);
    const targetAccount = allAccounts.find(a => a.contractId === selectedAccount);
    if (!asset || !targetAccount) return;
    const service = clientServices.find(
      s => s.payload.provider === targetAccount?.account.provider
    );

    if (!service)
      return displayErrorMessage({
        message: `${getName(
          targetAccount.account.provider
        )} does not offer issuance services to ${getName(party)}`,
      });

    await ledger.exercise(Service.RequestCreditAccount, service.contractId, {
      accountId: targetAccount.account.id,
      asset: { id: asset.payload.assetId, quantity: creditQuantity },
    });
    setCreditAsset('');
    setCreditQuantity('');
  };

  return (
    <div className="assets">
      <TitleWithActions title="Accounts">
        <NewAccount party={party} modal addButton/>
      </TitleWithActions>
      <div className="page-section-row">
        <div>
          {allAccounts.map(a => (
            <Account targetAccount={a} services={services} />
          ))}
        </div>

        <Tile className="inline" header="Quick Deposit">
          <br />
          <FormErrorHandled onSubmit={() => onRequestCredit()}>
            <Form.Select
              label="Account"
              options={allAccounts.map(a => {
                return { text: a.account.id.label, value: a.contractId };
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
