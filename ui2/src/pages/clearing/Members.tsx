import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { useParty, useStreamQueries } from '@daml/react';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { getName } from '../../config';
import { KeyboardArrowRight } from '@material-ui/icons';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { MemberStanding } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Model';
import { ServicePageProps } from '../common';
import { Header } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import MarginCallModal from './MarginCallModal';
import MTMCalculationModal from './MTMCalculationModal';

const ClearingMembersComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}: RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();

  const accounts = useStreamQueries(AssetSettlementRule).contracts;
  const deposits = useStreamQueries(AssetDeposit).contracts;
  const standings = useStreamQueries(MemberStanding).contracts;
  const ccpDeposits = deposits.filter(
    d => d.payload.account.id.label === services[0].payload.ccpAccount.id.label
  );

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="assets">
      <Tile header={<h2>Actions</h2>}>
        <MarginCallModal services={services} />
        <MTMCalculationModal services={services} />
      </Tile>
      <Header as="h2">Holdings</Header>
      <StripedTable
        headings={['Member', 'Clearing Account', 'Margin Account', 'In Good Standing', 'Details']}
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
            <IconButton
              color="primary"
              size="small"
              component="span"
              onClick={() => history.push('/app/clearing/member/' + s.contractId.replace('#', '_'))}
            >
              <KeyboardArrowRight fontSize="small" />
            </IconButton>,
          ];
        })}
      />
      <Header as="h2">CCP Account</Header>
      <StripedTable
        headings={['Account', 'Asset', 'Amount']}
        rows={ccpDeposits.map(c => [
          c.payload.account.id.label,
          c.payload.asset.id.label,
          formatter.format(Number(c.payload.asset.quantity)),
        ])}
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
          'Details',
        ]}
        rows={accounts.map(c => [
          c.payload.account.id.label,
          getName(c.payload.account.provider),
          getName(c.payload.account.owner),
          party === c.payload.account.provider ? 'Provider' : 'Client',
          Object.keys(c.payload.ctrls.textMap).join(', '),
          <IconButton
            color="primary"
            size="small"
            component="span"
            onClick={() => history.push('/app/custody/account/' + c.contractId.replace('#', '_'))}
          >
            <KeyboardArrowRight fontSize="small" />
          </IconButton>,
        ])}
      />
    </div>
  );
};

export const ClearingMembers = withRouter(ClearingMembersComponent);
