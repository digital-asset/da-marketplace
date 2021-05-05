import React from 'react';
import { withRouter, RouteComponentProps, useParams, NavLink } from 'react-router-dom';
import { useStreamQueries, useLedger, useParty } from '@daml/react';
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
  RejectedMarkToMarketCalculation_CustomerRetry,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Model';
import { ServicePageProps } from '../common';
import { Header, Button } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import MarginCallModal from './MarginCallModal';
import MTMCalculationModal from './MTMCalculationModal';
import { ContractId } from '@daml/types';
import { ArrowLeftIcon } from '../../icons/icons';

type Props = {
  member?: boolean;
};

const ClearingMemberComponent: React.FC<
  RouteComponentProps & ServicePageProps<Service> & Props
> = ({ history, services, member }) => {
  const { contractId } = useParams<any>();
  let party = useParty();

  const ledger = useLedger();
  const service = useStreamQueries(Service).contracts.find(s =>
    !!member ? s.payload.customer === party : s.contractId === contractId
  )?.payload;
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

  const { contracts: pendingMarginCalcs, loading: pendingMarginCalcsLoading } = useStreamQueries(
    MarginCalculation
  );

  const { contracts: failedMarginCalcs, loading: failedMarginCalcsLoading } = useStreamQueries(
    RejectedMarginCalculation
  );

  const {
    contracts: fulfilledMarginCalcs,
    loading: fulfilledMarginCalcsLoading,
  } = useStreamQueries(FulfilledMarginCalculation);

  const { contracts: pendingMTMCalcs, loading: pendingMTMCalcsLoading } = useStreamQueries(
    MarkToMarketCalculation
  );

  const { contracts: failedMTMCalcs, loading: failedMTMCalcsLoading } = useStreamQueries(
    RejectedMarkToMarketCalculation
  );

  const { contracts: fulfilledMTMCalcs, loading: fulfilledMTMCalcsLoading } = useStreamQueries(
    FulfilledMarkToMarketCalculation
  );

  const handleMTMRetry = async (cid: ContractId<RejectedMarkToMarketCalculation>) => {
    const choice = !!member
      ? RejectedMarkToMarketCalculation.RejectedMarkToMarketCalculation_CustomerRetry
      : RejectedMarkToMarketCalculation.RejectedMarkToMarketCalculation_Retry;
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
      <Button className="ghost back-button" onClick={() => history.goBack()}>
        <ArrowLeftIcon /> back
      </Button>
      <Tile header={<h2>Actions</h2>}>
        {!member && (
          <>
            <MarginCallModal services={services} member={customer} />
            <MTMCalculationModal services={services} member={customer} />
          </>
        )}
      </Tile>
      <Tile header={<h4>Standing</h4>}>
        <b>Margins:</b> {!!standing && standing?.payload.marginSatisfied ? 'Yes' : 'No'}
        <br />
        <b>MTM:</b> {!!standing && standing?.payload.mtmSatisfied ? 'Yes' : 'No'}
        <br />
        <b>Margin Amount:</b> {formatter.format(marginAmount)}
        <br />
        <b>Clearing Amount:</b> {formatter.format(clearingAmount)}
      </Tile>
      <Header as="h2">Margin Calculations</Header>
      <Header as="h3">Pending Margin Calculations</Header>
      <StripedTable
        headings={['Time', 'Target Amount', 'Account']}
        loading={pendingMarginCalcsLoading}
        rows={pendingMarginCalcs
          .filter(mc => mc.payload.customer === customer)
          .reverse()
          .map(mc => {
            return {
              elements: [
                mc.payload.calculationTime,
                formatter.format(Number(mc.payload.targetAmount)),
                mc.payload.accountId.label,
              ],
            };
          })}
      />
      <Header as="h3">Failed Margin Calculations</Header>
      <StripedTable
        headings={['Time', 'Target Amount', 'Account', 'Action']}
        loading={failedMarginCalcsLoading}
        rows={failedMarginCalcs
          .filter(mc => mc.payload.customer === customer)
          .reverse()
          .map(mc => {
            return {
              elements: [
                mc.payload.calculation.calculationTime,
                formatter.format(Number(mc.payload.calculation.targetAmount)),
                mc.payload.calculation.accountId.label,
                <Button.Group size="mini">
                  <Button className="ghost" onClick={() => handleMarginRetry(mc.contractId)}>
                    Retry
                  </Button>
                  {!member && (
                    <Button className="ghost" onClick={() => handleMarginCancel(mc.contractId)}>
                      Cancel
                    </Button>
                  )}
                </Button.Group>,
              ],
            };
          })}
      />
      <Header as="h3">Fulfilled Margin Calculations</Header>
      <StripedTable
        headings={['Time', 'Target Amount', 'Account']}
        loading={fulfilledMarginCalcsLoading}
        rows={fulfilledMarginCalcs
          .filter(mc => mc.payload.customer === customer)
          .reverse()
          .map(mc => {
            return {
              elements: [
                mc.payload.calculation.calculationTime,
                formatter.format(Number(mc.payload.calculation.targetAmount)),
                mc.payload.calculation.accountId.label,
              ],
            };
          })}
      />

      <Header as="h2">MTM Calculations</Header>
      <Header as="h3">Pending MTM Calculations</Header>
      <StripedTable
        headings={['Time', 'Amount', 'Account']}
        loading={pendingMTMCalcsLoading}
        rows={pendingMTMCalcs
          .filter(mc => mc.payload.customer === customer)
          .reverse()
          .map(mc => {
            return {
              elements: [
                mc.payload.calculationTime,
                formatter.format(Number(mc.payload.mtmAmount)),
                mc.payload.accountId.label,
              ],
            };
          })}
      />

      <Header as="h3">Failed MTM Calculations</Header>
      <StripedTable
        headings={['Time', 'Target Amount', 'Account', 'Action']}
        loading={failedMTMCalcsLoading}
        rows={failedMTMCalcs
          .filter(mc => mc.payload.customer === customer)
          .reverse()
          .map(mc => {
            return {
              elements: [
                mc.payload.calculation.calculationTime,
                formatter.format(Number(mc.payload.calculation.mtmAmount)),
                mc.payload.calculation.accountId.label,
                <Button.Group size="mini">
                  <Button className="ghost" onClick={() => handleMTMRetry(mc.contractId)}>
                    Retry
                  </Button>
                  {!member && (
                    <Button className="ghost" onClick={() => handleMTMCancel(mc.contractId)}>
                      Cancel
                    </Button>
                  )}
                </Button.Group>,
              ],
            };
          })}
      />
      <Header as="h3">Fulfilled MTM Calculations</Header>
      <StripedTable
        headings={['Time', 'Target Amount', 'Account']}
        loading={fulfilledMTMCalcsLoading}
        rows={fulfilledMTMCalcs
          .filter(mc => mc.payload.customer === customer)
          .reverse()
          .map(mc => {
            return {
              elements: [
                mc.payload.calculation.calculationTime,
                formatter.format(Number(mc.payload.calculation.mtmAmount)),
                mc.payload.calculation.accountId.label,
              ],
            };
          })}
      />
    </div>
  );
};

export const ClearingMember = withRouter(ClearingMemberComponent);
