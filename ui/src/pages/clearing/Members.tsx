import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useLedger, useParty, useStreamQueries } from '@daml/react';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { usePartyName } from '../../config';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import {
  ClearedTrade,
  ClearedTradeSide,
  MemberStanding,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Model';
import { ServicePageProps, damlSetValues } from '../common';
import { Button } from 'semantic-ui-react';
import StripedTable from '../../components/Table/StripedTable';
import TitleWithActions from '../../components/Common/TitleWithActions';
import MarginCallModal from './MarginCallModal';
import MTMCalculationModal from './MTMCalculationModal';
import { CreateEvent } from '@daml/ledger';
import { formatCurrency } from '../../util';

const ClearingMembersComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const { contracts: accounts, loading: accountsLoading } = useStreamQueries(AssetSettlementRule);
  const { contracts: clearedTrades, loading: clearedTradesLoading } =
    useStreamQueries(ClearedTrade);
  const { contracts: clearedTradeSides, loading: clearedTradeSidesLoading } =
    useStreamQueries(ClearedTradeSide);
  const { contracts: deposits, loading: depositsLoading } = useStreamQueries(AssetDeposit);
  const { contracts: standings, loading: standingsLoading } = useStreamQueries(MemberStanding);
  const ccpDeposits = deposits.filter(
    d => d.payload.account.id.label === services[0]?.payload.ccpAccount.id.label
  );

  const handleNovation = async (c: CreateEvent<ClearedTrade>) => {
    await ledger.exercise(ClearedTrade.ClearedTrade_Novate, c.contractId, {});
  };

  return (
    <div>
      <TitleWithActions
        title="Clearing"
        addNewActions={[
          {
            label: 'Manage Clearing Services',
            path: '/app/manage/clearing',
          },
        ]}
      >
        <MarginCallModal services={services} />
        <MTMCalculationModal services={services} />
      </TitleWithActions>
      <StripedTable
        title="Holdings"
        rowsClickable
        headings={['Member', 'Clearing Account', 'Margin Account', 'In Good Standing']}
        loading={accountsLoading || depositsLoading || standingsLoading}
        rows={services.map(s => {
          const standing = standings.find(
            standing => standing.payload.customer === s.payload.customer
          );
          const clearingDeposits = deposits.filter(
            d => d.payload.account.id.label === s.payload.clearingAccount.id.label
          );
          const marginDeposits = deposits.filter(
            d => d.payload.account.id.label === s.payload.marginAccount.id.label
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
              getName(s.payload.customer),
              formatCurrency(clearingAmount),
              formatCurrency(marginAmount),
              standingText,
            ],
            onClick: () => history.push(`/app/clearing/member/${s.contractId.replace('#', '_')}`),
          };
        })}
      />
      <StripedTable
        title="CCP Account"
        headings={['Account', 'Asset', 'Amount']}
        loading={depositsLoading}
        rows={ccpDeposits.map(c => {
          return {
            elements: [
              c.payload.account.id.label,
              c.payload.asset.id.label,
              formatCurrency(c.payload.asset.quantity),
            ],
          };
        })}
      />
      <StripedTable
        title="Accounts"
        loading={accountsLoading}
        headings={['Account', 'Provider', 'Owner', 'Role', 'Controllers']}
        rows={accounts.map(c => {
          return {
            elements: [
              c.payload.account.id.label,
              getName(c.payload.account.provider),
              getName(c.payload.account.owner),
              party === c.payload.account.provider ? 'Provider' : 'Client',
              damlSetValues(c.payload.ctrls)
                .map(ctrl => getName(ctrl))
                .sort()
                .join(', '),
            ],
          };
        })}
      />
      <StripedTable
        title="Cleared Trades"
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
              <Button aligned="right" className="ghost" onClick={() => handleNovation(c)}>
                Novate Trade
              </Button>,
            ],
          };
        })}
      />
      <StripedTable
        title="Cleared Trade Sides"
        loading={clearedTradeSidesLoading}
        headings={['Exchange', 'Member', 'Listing', 'Quantity', 'Price', 'Time Matched']}
        rows={clearedTradeSides.map(c => {
          return {
            elements: [
              getName(c.payload.exchange),
              getName(c.payload.order.customer),
              c.payload.order.details.listingId.label,
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
