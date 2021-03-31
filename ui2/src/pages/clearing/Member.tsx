import React, { useMemo } from "react";
import { withRouter, RouteComponentProps, useParams } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import { useParty, useStreamQueries } from "@daml/react";
import { AssetDeposit } from "@daml.js/da-marketplace/lib/DA/Finance/Asset";
import { AssetSettlementRule } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement";
import { getName } from "../../config";
import { KeyboardArrowRight } from "@material-ui/icons";
import { Service } from "@daml.js/da-marketplace/lib/Marketplace/Clearing/Service";
import { MemberStanding, MarginCalculation, RejectedMarginCalculation, FulfilledMarginCalculation, MarkToMarketCalculation, RejectedMarkToMarketCalculation, FulfilledMarkToMarketCalculation } from "@daml.js/da-marketplace/lib/Marketplace/Clearing/Model";
import { ServicePageProps } from "../common";
import { Button, Header } from "semantic-ui-react";
import Tile from "../../components/Tile/Tile";
import StripedTable from "../../components/Table/StripedTable";
import {AllocationAccountRule} from "@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount/module";

const ClearingMemberComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({ history, services }: RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();

  const { contractId } = useParams<any>();
  // const serviceContract = useStreamQueries(Service).contracts.find(s => s.contractId === contractId);
  const service = useStreamQueries(Service).contracts.find(s => s.contractId === contractId)?.payload;
  // const service = serviceContract?.payload;
  const customer = service?.customer; // service?.payload.customer;

  const accounts = useStreamQueries(AssetSettlementRule).contracts;
  const allocationAccounts = useStreamQueries(AllocationAccountRule).contracts;
  const deposits = useStreamQueries(AssetDeposit).contracts;
  const standings = useStreamQueries(MemberStanding).contracts;

  const standing = standings.find(standing => standing.payload.customer === customer);
  const clearingDeposits = deposits.filter(d => d.payload.account.id.label == service?.clearingAccount.id.label);
  const marginDeposits = deposits.filter(d => d.payload.account.id.label == service?.marginAccount.id.label);
  const clearingAmount = clearingDeposits.reduce( (acc, val) => acc + Number(val.payload.asset.quantity), 0);
  const marginAmount = marginDeposits.reduce( (acc, val) => acc + Number(val.payload.asset.quantity), 0);
  const standingText = !!standing && standing.payload.marginSatisfied && standing.payload.mtmSatisfied ? "Yes" : "No"

  const pendingMarginCalcs = useStreamQueries(MarginCalculation).contracts.filter(mc => mc.payload.customer === customer);
  const failedMarginCalcs = useStreamQueries(RejectedMarginCalculation).contracts.filter(mc => mc.payload.customer === customer);
  const fulfilledMarginCalcs = useStreamQueries(FulfilledMarginCalculation).contracts.filter(mc => mc.payload.customer === customer);

  const pendingMTMCalcs = useStreamQueries(MarkToMarketCalculation).contracts.filter(mc => mc.payload.customer === customer);
  const failedMTMCalcs = useStreamQueries(RejectedMarkToMarketCalculation).contracts.filter(mc => mc.payload.customer === customer);
  const fulfilledMTMCalcs = useStreamQueries(FulfilledMarkToMarketCalculation).contracts.filter(mc => mc.payload.customer === customer);

  return (
    <div className='assets'>
      <Tile header={<h2>Actions</h2>}>
        <Button
          className='ghost'
          onClick={() => history.push("/app/clearing/margin-call")}>Perform Margin Call</Button>
        <Button
          className='ghost'
          onClick={() => history.push("/app/clearing/mtm-calc")}>Perform Mark to Market</Button>
      </Tile>
      <Header as='h2'>Standing</Header>
      <StripedTable
        headings={[
          'Margin Calls',
          'MTM Calculations',
          'Account'
        ]}
        rows={[

        ]}
      />
      <Header as='h2'>Curent Margin Calculations</Header>
      <StripedTable
        headings={[
          'Time',
          'Target Amount',
          'Account'
        ]}
        rows={
          pendingMarginCalcs.map(mc => {
            return [
                <>{mc.payload.calculationTime}</>,
                <>{mc.payload.targetAmount}</>,
                <>{mc.payload.accountId.label}</>
              ];
          })

        }
      />
      <Header as='h2'>Failed Margin Calculations</Header>
      <StripedTable
        headings={[
          'Time',
          'Target Amount',
          'Account'
        ]}
        rows={
          failedMarginCalcs.map(mc => {
            return [
                <>{mc.payload.calculation.calculationTime}</>,
                <>{mc.payload.calculation.targetAmount}</>,
                <>{mc.payload.calculation.accountId.label}</>
              ];
          })

        }
      />
      <Header as='h2'>Fulfilled Margin Calculations</Header>
      <StripedTable
        headings={[
          'Time',
          'Target Amount',
          'Account'
        ]}
        rows={
          fulfilledMarginCalcs.map(mc => {
            return [
                <>{mc.payload.calculation.calculationTime}</>,
                <>{mc.payload.calculation.targetAmount}</>,
                <>{mc.payload.calculation.accountId.label}</>
              ];
          })

        }
      />
    </div>
  );
};

export const ClearingMember = withRouter(ClearingMemberComponent);
