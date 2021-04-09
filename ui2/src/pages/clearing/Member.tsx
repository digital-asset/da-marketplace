import React from 'react';
import { withRouter, RouteComponentProps, useParams } from 'react-router-dom';
import { useStreamQueries, useLedger } from '@daml/react';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { Service, Cancel } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import {
  MemberStanding,
  MarginCalculation,
  RejectedMarginCalculation,
  FulfilledMarginCalculation,
  MarkToMarketCalculation,
  RejectedMarkToMarketCalculation,
  FulfilledMarkToMarketCalculation,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Model';
import { ServicePageProps } from '../common';
import { Header } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import MarginCallModal from './MarginCallModal';
import MTMCalculationModal from './MTMCalculationModal';
import { IconButton } from '@material-ui/core';
import { Cancel as CancelIcon, Undo as UndoIcon } from '@material-ui/icons';
import { ContractId } from '@daml/types';

const ClearingMemberComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}: RouteComponentProps & ServicePageProps<Service>) => {
  const { contractId } = useParams<any>();
  const ledger = useLedger();
  const service = useStreamQueries(Service).contracts.find(s => s.contractId === contractId)
    ?.payload;
  const customer = service?.customer;

  const deposits = useStreamQueries(AssetDeposit).contracts;
  const standings = useStreamQueries(MemberStanding).contracts;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const standing = standings.find(standing => standing.payload.customer === customer);
  const clearingDeposits = deposits.filter(
    d => d.payload.account.id.label == service?.clearingAccount.id.label
  );
  const marginDeposits = deposits.filter(
    d => d.payload.account.id.label == service?.marginAccount.id.label
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
    !!standing && standing.payload.marginSatisfied && standing.payload.mtmSatisfied ? 'Yes' : 'No';

  const pendingMarginCalcs = useStreamQueries(MarginCalculation)
    .contracts.filter(mc => mc.payload.customer === customer)
    .reverse();
  const failedMarginCalcs = useStreamQueries(RejectedMarginCalculation)
    .contracts.filter(mc => mc.payload.customer === customer)
    .reverse();
  const fulfilledMarginCalcs = useStreamQueries(FulfilledMarginCalculation)
    .contracts.filter(mc => mc.payload.customer === customer)
    .reverse();

  const pendingMTMCalcs = useStreamQueries(MarkToMarketCalculation)
    .contracts.filter(mc => mc.payload.customer === customer)
    .reverse();
  const failedMTMCalcs = useStreamQueries(RejectedMarkToMarketCalculation)
    .contracts.filter(mc => mc.payload.customer === customer)
    .reverse();
  const fulfilledMTMCalcs = useStreamQueries(FulfilledMarkToMarketCalculation)
    .contracts.filter(mc => mc.payload.customer === customer)
    .reverse();

  const handleMTMRetry = async (cid: ContractId<RejectedMarkToMarketCalculation>) => {
    const choice = RejectedMarkToMarketCalculation.RejectedMarkToMarketCalculation_Retry;
    await ledger.exercise(choice, cid, {});
  };
  const handleMTMCancel = async (cid: ContractId<RejectedMarkToMarketCalculation>) => {
    const choice = RejectedMarkToMarketCalculation.RejectedMarkToMarketCalculation_Cancel;
    await ledger.exercise(choice, cid, {});
  };

  const handleMarginRetry = async (cid: ContractId<RejectedMarginCalculation>) => {
    const choice = RejectedMarginCalculation.RejectedMarginCalculation_Retry;
    await ledger.exercise(choice, cid, {});
  };
  const handleMarginCancel = async (cid: ContractId<RejectedMarginCalculation>) => {
    const choice = RejectedMarginCalculation.RejectedMarginCalculation_Cancel;
    await ledger.exercise(choice, cid, {});
  };

  return (
    <div className="assets">
      <Tile header={<h2>Actions</h2>}>
        <MarginCallModal services={services} member={customer} />
        <MTMCalculationModal services={services} member={customer} />
      </Tile>
      <Tile header={<h2>Standing</h2>}>
        <b>Margins:</b> {!!standing && standing?.payload.marginSatisfied ? 'Yes' : 'No'}
        <br />
        <b>MTM:</b> {!!standing && standing?.payload.mtmSatisfied ? 'Yes' : 'No'}
        <br />
        <b>Margin Amount:</b> {formatter.format(marginAmount)}
        <br />
        <b>Clearing Amount:</b> {formatter.format(clearingAmount)}
      </Tile>
      <Header as="h2">Margin Calculations</Header>
      <Header as="h3">Curent Margin Calculations</Header>
      <StripedTable
        headings={['Time', 'Target Amount', 'Account']}
        rows={pendingMarginCalcs.map(mc => {
          return [
            <>{mc.payload.calculationTime}</>,
            <>{formatter.format(Number(mc.payload.targetAmount))}</>,
            <>{mc.payload.accountId.label}</>,
          ];
        })}
      />
      <Header as="h3">Failed Margin Calculations</Header>
      <StripedTable
        headings={['Time', 'Target Amount', 'Account', 'Action']}
        rows={failedMarginCalcs.map(mc => {
          return [
            <>{mc.payload.calculation.calculationTime}</>,
            <>{formatter.format(Number(mc.payload.calculation.targetAmount))}</>,
            <>{mc.payload.calculation.accountId.label}</>,
            <span>
              <IconButton color="primary" size="small" component="span">
                <UndoIcon fontSize="small" onClick={() => handleMarginRetry(mc.contractId)} />
              </IconButton>
              <IconButton color="primary" size="small" component="span">
                <CancelIcon fontSize="small" onClick={() => handleMarginCancel(mc.contractId)} />
              </IconButton>
            </span>,
          ];
        })}
      />
      <Header as="h3">Fulfilled Margin Calculations</Header>
      <StripedTable
        headings={['Time', 'Target Amount', 'Account']}
        rows={fulfilledMarginCalcs.map(mc => {
          return [
            <>{mc.payload.calculation.calculationTime}</>,
            <>{formatter.format(Number(mc.payload.calculation.targetAmount))}</>,
            <>{mc.payload.calculation.accountId.label}</>,
          ];
        })}
      />

      <Header as="h2">MTM Calculations</Header>
      <Header as="h3">Curent MTM Calculations</Header>
      <StripedTable
        headings={['Time', 'Amount', 'Account']}
        rows={pendingMTMCalcs.map(mc => {
          return [
            <>{mc.payload.calculationTime}</>,
            <>{formatter.format(Number(mc.payload.mtmAmount))}</>,
            <>{mc.payload.accountId.label}</>,
          ];
        })}
      />
      <Header as="h3">Failed MTM Calculations</Header>
      <StripedTable
        headings={['Time', 'Target Amount', 'Account', 'Action']}
        rows={failedMTMCalcs.map(mc => {
          return [
            <>{mc.payload.calculation.calculationTime}</>,
            <>{formatter.format(Number(mc.payload.calculation.mtmAmount))}</>,
            <>{mc.payload.calculation.accountId.label}</>,
            <span>
              <IconButton color="primary" size="small" component="span">
                <UndoIcon fontSize="small" onClick={() => handleMTMRetry(mc.contractId)} />
              </IconButton>
              <IconButton color="primary" size="small" component="span">
                <CancelIcon fontSize="small" onClick={() => handleMTMCancel(mc.contractId)} />
              </IconButton>
            </span>,
          ];
        })}
      />
      <Header as="h3">Fulfilled MTM Calculations</Header>
      <StripedTable
        headings={['Time', 'Target Amount', 'Account']}
        rows={fulfilledMTMCalcs.map(mc => {
          return [
            <>{mc.payload.calculation.calculationTime}</>,
            <>{formatter.format(Number(mc.payload.calculation.mtmAmount))}</>,
            <>{mc.payload.calculation.accountId.label}</>,
          ];
        })}
      />
    </div>
  );
};

export const ClearingMember = withRouter(ClearingMemberComponent);
