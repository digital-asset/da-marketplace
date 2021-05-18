import React, { useMemo } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { usePartyName } from '../../config';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { ServicePageProps } from '../common';
import { Button, Header } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { ArrowRightIcon } from '../../icons/icons';

const AssetsComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
}: RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();
  const { getName } = usePartyName(party);

  const { contracts: accounts, loading: accountsLoading } = useStreamQueries(AssetSettlementRule);
  const { contracts: allocatedAccounts, loading: allocatedAccountsLoading } =
    useStreamQueries(AllocationAccountRule);
  const { contracts: deposits, loading: depositsLoading } = useStreamQueries(AssetDeposit);

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

  return (
    <div className="assets">
      <Tile header={<h4>Actions</h4>}>
        <Button className="ghost" onClick={() => history.push('/app/custody/accounts/new')}>
          New Account
        </Button>
      </Tile>
      <Header as="h2">Holdings</Header>
      <StripedTable
        rowsClickable
        headings={['Asset', 'Account', 'Owner']}
        loading={depositsLoading}
        rows={deposits.map(c => {
          return {
            elements: [
              <>
                <b>{c.payload.asset.id.label}</b> {c.payload.asset.quantity}
              </>,
              c.payload.account.id.label,
              getName(c.payload.account.owner),
            ],
            onClick: () =>
              history.push(
                '/app/custody/account/' +
                  allAccounts
                    .find(a => a.account.id.label === c.payload.account.id.label)
                    ?.contractId.replace('#', '_')
              ),
          };
        })}
      />
      <Header as="h2">Accounts</Header>
      <StripedTable
        rowsClickable
        headings={['Account', 'Type', 'Provider', 'Owner', 'Role']}
        loading={accountsLoading || allocatedAccountsLoading}
        rows={allAccounts.map(a => {
          return {
            elements: [
              a.account.id.label,
              accounts.find(b => b.contractId === a.contractId) ? 'Normal' : 'Allocation',
              getName(a.account.provider),
              getName(a.account.owner),
              party === a.account.provider ? 'Provider' : 'Client',
            ],
            onClick: () => history.push('/app/custody/account/' + a.contractId),
          };
        })}
      />
    </div>
  );
};

export const Assets = withRouter(AssetsComponent);
