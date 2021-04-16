import React from 'react';
import { withRouter, RouteComponentProps, NavLink } from 'react-router-dom';
import { useParty, useStreamQueries } from '@daml/react';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { getName } from '../../config';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { MemberStanding } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Model';
import { ServicePageProps } from '../common';
import { Header } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import MarginCallModal from './MarginCallModal';
import MTMCalculationModal from './MTMCalculationModal';
import { ArrowRightIcon } from '../../icons/icons';

const ClearingMembersComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}) => {
  const party = useParty();

  const { contracts: accounts, loading: accountsLoading } = useStreamQueries(AssetSettlementRule);
  const { contracts: deposits, loading: depositsLoading } = useStreamQueries(AssetDeposit);
  const { contracts: standings, loading: standingsLoading } = useStreamQueries(MemberStanding);
  const ccpDeposits = deposits.filter(
    d => d.payload.account.id.label === services[0]?.payload.ccpAccount.id.label
  );

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="assets">
      <Tile header={<h4>Actions</h4>}>
        <MarginCallModal services={services} />
        <MTMCalculationModal services={services} />
      </Tile>
      <Header as="h2">Holdings</Header>
      <StripedTable
        headings={['Member', 'Clearing Account', 'Margin Account', 'In Good Standing', 'Details']}
        loading={accountsLoading || depositsLoading || standingsLoading}
        rows={services.map(s => {
          const standing = standings.find(
            standing => standing.payload.customer === s.payload.customer
          );
          const clearingDeposits = deposits.filter(
            d => d.payload.account.id.label == s.payload.clearingAccount.id.label
          );
          const marginDeposits = deposits.filter(
            d => d.payload.account.id.label == s.payload.marginAccount.id.label
          );
          const clearingAmount = clearingDeposits.reduce(
            (acc, val) => acc + Number(val.payload.asset.quantity),
            0
          );
          const marginAmount = marginDeposits.reduce(
            (acc, val) => acc + Number(val.payload.asset.quantity),
            0
          );
          const standingText =
            !!standing && standing.payload.marginSatisfied && standing.payload.mtmSatisfied
              ? 'Yes'
              : 'No';
          return [
            <>{s.payload.customer}</>,
            formatter.format(clearingAmount),
            formatter.format(marginAmount),
            standingText,
            <NavLink to={`/app/clearing/member/${s.contractId.replace('#', '_')}`}>
              <ArrowRightIcon />
            </NavLink>,
          ];
        })}
      />
      <Header as="h2">CCP Account</Header>
      <StripedTable
        headings={['Account', 'Asset', 'Amount']}
        loading={depositsLoading}
        rows={ccpDeposits.map(c => [
          c.payload.account.id.label,
          c.payload.asset.id.label,
          formatter.format(Number(c.payload.asset.quantity)),
        ])}
      />
      <Header as="h2">Accounts</Header>
      <StripedTable
        loading={accountsLoading}
        headings={[
          'Account',
          'Provider',
          'Owner',
          'Role',
          'Controllers',
          // 'Requests',
          'Details',
        ]}
        rows={accounts.map(c => [
          c.payload.account.id.label,
          getName(c.payload.account.provider),
          getName(c.payload.account.owner),
          party === c.payload.account.provider ? 'Provider' : 'Client',
          Object.keys(c.payload.ctrls.textMap).join(', '),
          <NavLink to={`/app/custody/account/${c.contractId.replace('#', '_')}`}>
            <ArrowRightIcon />
          </NavLink>,
        ])}
      />
    </div>
  );
};

export const ClearingMembers = withRouter(ClearingMembersComponent);
