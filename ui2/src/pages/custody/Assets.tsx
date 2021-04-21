import React, { useMemo } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { usePartyLegalName } from '../../config';
import { KeyboardArrowRight } from '@material-ui/icons';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { ServicePageProps } from '../common';
import { Button, Header } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';

const AssetsComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}: RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();
  const { getLegalName } = usePartyLegalName(party);

  const { contracts: accounts, loading: accountsLoading } = useStreamQueries(AssetSettlementRule);
  const { contracts: deposits, loading: depositsLoading } = useStreamQueries(AssetDeposit);

  const tradeableDeposits = useMemo(
    () =>
      deposits.filter(
        d =>
          accounts.findIndex(s => s.payload.account.id.label === d.payload.account.id.label) !== -1
      ),
    [deposits, accounts, party]
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
        headings={['Asset', 'Account', 'Owner']}
        loading={accountsLoading || depositsLoading}
        rowsClickable
        rows={tradeableDeposits.map(c => {
          return {
            elements: [
              <>
                <b>{c.payload.asset.id.label}</b> {c.payload.asset.quantity}
              </>,
              c.payload.account.id.label,
              getLegalName(c.payload.account.owner),
            ],
            onClick: () =>
              history.push(
                '/app/custody/account/' +
                  accounts
                    .find(a => a.payload.account.id.label === c.payload.account.id.label)
                    ?.contractId.replace('#', '_')
              ),
          };
        })}
      />
      <Header as="h2">Accounts</Header>
      <StripedTable
        headings={[
          'Account',
          'Provider',
          'Owner',
          'Role',
          'Controllers',
          // 'Requests',
        ]}
        rowsClickable
        loading={accountsLoading}
        rows={accounts.map(c => {
          return {
            elements: [
              c.payload.account.id.label,
              getLegalName(c.payload.account.provider),
              getLegalName(c.payload.account.owner),
              party === c.payload.account.provider ? 'Provider' : 'Client',
              Object.keys(c.payload.ctrls.textMap).join(', '),
            ],
            onClick: () => history.push('/app/custody/account/' + c.contractId.replace('#', '_')),
          };
        })}
      />
    </div>
  );
};

export const Assets = withRouter(AssetsComponent);
