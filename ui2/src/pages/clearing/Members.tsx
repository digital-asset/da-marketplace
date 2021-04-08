import React, { useMemo } from 'react';
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
import { Button, Header } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount/module';
import { MarginCall } from './MarginCall';
import MarginCallModal from './MarginCallModal';

const ClearingMembersComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}: RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();

  const accounts = useStreamQueries(AssetSettlementRule).contracts;
  const allocationAccounts = useStreamQueries(AllocationAccountRule).contracts;
  const deposits = useStreamQueries(AssetDeposit).contracts;
  const standings = useStreamQueries(MemberStanding).contracts;

  const tradeableDeposits = useMemo(
    () =>
      deposits.filter(
        d =>
          accounts.findIndex(s => s.payload.account.id.label === d.payload.account.id.label) !== -1
      ),
    [deposits, accounts, party]
  );
  // return [
  //   <><b>{c.payload.asset.id.label}</b> {c.payload.asset.quantity}</>,
  //   c.payload.account.id.label,
  //   getName(c.payload.account.owner),
  //   <IconButton color="primary" size="small" component="span" onClick={() => history.push("/app/custody/account/" + accounts.find(a => a.payload.account.id.label === c.payload.account.id.label)?.contractId.replace("#", "_"))}>
  //     <KeyboardArrowRight fontSize="small" />
  //   </IconButton>
  // ])

  return (
    <div className="assets">
      <Tile header={<h2>Actions</h2>}>
        <MarginCallModal services={services} />
        <Button className="ghost" onClick={() => history.push('/app/clearing/mtm-calc')}>
          Perform Mark to Market
        </Button>
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
            clearingAmount,
            marginAmount,
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
