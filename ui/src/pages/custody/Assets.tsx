import React, { useMemo } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { usePartyName } from '../../config';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { ServicePageProps } from '../common';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { Account } from './Account';
import { Header } from 'semantic-ui-react';

const AssetsComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}: RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();

  const { contracts: accounts, loading: accountsLoading } = useStreamQueries(AssetSettlementRule);
  const { contracts: allocatedAccounts, loading: allocatedAccountsLoading } =
    useStreamQueries(AllocationAccountRule);

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

  return (
    <div className="assets">
      <Header as="h2">Accounts</Header>
      {allAccounts.map(a => (
        <Account contractId={a.contractId} services={services} />
      ))}
    </div>
  );
};

export const Assets = withRouter(AssetsComponent);
