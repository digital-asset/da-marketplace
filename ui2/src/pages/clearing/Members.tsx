import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useParty, useStreamQueries, useLedger } from '@daml/react';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { usePartyName } from '../../config';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import {
  MemberStanding,
  ClearedTrade,
  ClearedTradeSide,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Model';
import { ServicePageProps } from '../common';
import { Header, Button } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import MarginCallModal from './MarginCallModal';
import MTMCalculationModal from './MTMCalculationModal';
import { CreateEvent } from '@daml/ledger';

const ClearingMembersComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const { contracts: accounts, loading: accountsLoading } = useStreamQueries(AssetSettlementRule);
  const { contracts: clearedTrades, loading: clearedTradesLoading } = useStreamQueries(
    ClearedTrade
  );
  const { contracts: clearedTradeSides, loading: clearedTradeSidesLoading } = useStreamQueries(
    ClearedTradeSide
  );
  const { contracts: deposits, loading: depositsLoading } = useStreamQueries(AssetDeposit);
  const { contracts: standings, loading: standingsLoading } = useStreamQueries(MemberStanding);
  const ccpDeposits = deposits.filter(
    d => d.payload.account.id.label === services[0]?.payload.ccpAccount.id.label
  );

  const handleNovation = async (c: CreateEvent<ClearedTrade>) => {
    await ledger.exercise(ClearedTrade.ClearedTrade_Novate, c.contractId, {});
  };

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
        headings={['Member', 'Clearing Account', 'Margin Account', 'In Good Standing']}
        loading={accountsLoading || depositsLoading || standingsLoading}
        rowsClickable
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
          return {
            elements: [
              <>{s.payload.customer}</>,
              formatter.format(clearingAmount),
              formatter.format(marginAmount),
              standingText,
            ],
            onClick: () => history.push(`/app/clearing/member/${s.contractId.replace('#', '_')}`),
          };
        })}
      />
      <Header as="h2">CCP Account</Header>
      <StripedTable
        headings={['Account', 'Asset', 'Amount']}
        loading={depositsLoading}
        rows={ccpDeposits.map(c => {
          return {
            elements: [
              c.payload.account.id.label,
              c.payload.asset.id.label,
              formatter.format(Number(c.payload.asset.quantity)),
            ],
          };
        })}
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
        ]}
        rows={accounts.map(c => {
          return {
            elements: [
              c.payload.account.id.label,
              getName(c.payload.account.provider),
              getName(c.payload.account.owner),
              party === c.payload.account.provider ? 'Provider' : 'Client',
              Object.keys(c.payload.ctrls.textMap).join(', '),
            ],
          };
        })}
      />
      <Header as="h2">Cleared Trades</Header>
      <StripedTable
        loading={clearedTradesLoading}
        headings={['Provider', 'Match Id', 'Maker Order Id', 'Taker Order Id', 'Quantity', 'Price']}
        rows={clearedTrades.map(c => {
          return {
            elements: [
              getName(c.payload.provider),
              c.payload.execution.matchId,
              c.payload.execution.makerOrderId,
              c.payload.execution.takerOrderId,
              c.payload.execution.quantity,
              c.payload.execution.price,
              <Button
                size="small"
                className="ghost"
                variant="contained"
                onClick={() => handleNovation(c)}
              >
                Novate Trade
              </Button>,
            ],
          };
        })}
      />
      <Header as="h2">Cleared Trade Sides</Header>
      <StripedTable
        loading={clearedTradeSidesLoading}
        headings={['Exchange', 'Member', 'Listing', 'Quantity', 'Price', 'Time Matched']}
        rows={clearedTradeSides.map(c => {
          return {
            elements: [
              getName(c.payload.exchange),
              getName(c.payload.order.customer),
              c.payload.order.details.symbol,
              c.payload.execution.quantity,
              c.payload.execution.price,
              c.payload.execution.timestamp,
            ],
          };
        })}
      />
    </div>
  );
};

export const ClearingMembers = withRouter(ClearingMembersComponent);
