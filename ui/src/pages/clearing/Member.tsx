import React from 'react';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { useLedger, useParty, useStreamQueries } from '@daml/react';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import {
  FulfilledMarginCalculation,
  FulfilledMarkToMarketCalculation,
  MarginCalculation,
  MarkToMarketCalculation,
  MemberStanding,
  RejectedMarginCalculation,
  RejectedMarkToMarketCalculation,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Model';
import { ServicePageProps } from '../common';
import { Button, Header } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import MarginCallModal from './MarginCallModal';
import MTMCalculationModal from './MTMCalculationModal';
import { ContractId } from '@daml/types';
import { formatCurrency } from '../../util';
import TitleWithActions from '../../components/Common/TitleWithActions';
import InfoCard from '../../components/Common/InfoCard';

type Props = {
  member?: boolean;
};

const ClearingMemberComponent: React.FC<RouteComponentProps & ServicePageProps<Service> & Props> =
  ({ history, services, member }) => {
    const { contractId } = useParams<any>();
    let party = useParty();

    const ledger = useLedger();
    const service = useStreamQueries(Service).contracts.find(s =>
      !!member ? s.payload.customer === party : s.contractId === contractId
    )?.payload;
    const customer = service?.customer;

    const deposits = useStreamQueries(AssetDeposit).contracts;
    const standings = useStreamQueries(MemberStanding).contracts;

    const standing = standings.find(standing => standing.payload.customer === customer);
    const clearingDeposits = deposits.filter(
      d => d.payload.account.id.label === service?.clearingAccount.id.label
    );
    const marginDeposits = deposits.filter(
      d => d.payload.account.id.label === service?.marginAccount.id.label
    );
    const clearingAmount = clearingDeposits.reduce(
      (acc, val) => acc + Number(val.payload.asset.quantity),
      0
    );
    const marginAmount = marginDeposits.reduce(
      (acc, val) => acc + Number(val.payload.asset.quantity),
      0
    );

    const { contracts: pendingMarginCalcs, loading: pendingMarginCalcsLoading } =
      useStreamQueries(MarginCalculation);

    const { contracts: failedMarginCalcs, loading: failedMarginCalcsLoading } =
      useStreamQueries(RejectedMarginCalculation);

    const { contracts: fulfilledMarginCalcs, loading: fulfilledMarginCalcsLoading } =
      useStreamQueries(FulfilledMarginCalculation);

    const { contracts: pendingMTMCalcs, loading: pendingMTMCalcsLoading } =
      useStreamQueries(MarkToMarketCalculation);

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
      <div className="member">
        <TitleWithActions title={'Margin Calculations'} />
        {!member && (
          <>
            <MarginCallModal services={services} member={customer} />
            <MTMCalculationModal services={services} member={customer} />
          </>
        )}
        <div className="page-section-row">
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
                    formatCurrency(mc.payload.calculation.targetAmount),
                    mc.payload.calculation.accountId.label,
                  ],
                };
              })}
          />
          <InfoCard
            title="Standing"
            info={[
              {
                label: 'Margins',
                data: !!standing && standing?.payload.marginSatisfied ? 'Yes' : 'No',
              },
              {
                label: 'MTM',
                data: !!standing && standing?.payload.mtmSatisfied ? 'Yes' : 'No',
              },
              {
                label: 'Margin Amount',
                data: formatCurrency(marginAmount),
              },
              {
                label: 'Clearing Amount',
                data: formatCurrency(clearingAmount),
              },
            ]}
          />
        </div>

        {(!!failedMarginCalcs.length || !!pendingMarginCalcs.length) && (
          <Tile header="In Progress">
            <div className="calculations-in-progress">
              {!!failedMarginCalcs.length && (
                <StripedTable
                  title="Failed Margin Calculations"
                  headings={['Time', 'Target Amount', 'Account', 'Action']}
                  loading={failedMarginCalcsLoading}
                  rows={[
                    ...failedMarginCalcs
                      .filter(mc => mc.payload.customer === customer)
                      .reverse()
                      .map(mc => {
                        return {
                          elements: [
                            mc.payload.calculation.calculationTime,
                            formatCurrency(mc.payload.calculation.targetAmount),
                            mc.payload.calculation.accountId.label,
                            <Button.Group size="mini">
                              <Button
                                className="ghost"
                                onClick={() => handleMarginRetry(mc.contractId)}
                              >
                                Retry
                              </Button>
                              {!member && (
                                <Button
                                  className="ghost"
                                  onClick={() => handleMarginCancel(mc.contractId)}
                                >
                                  Cancel
                                </Button>
                              )}
                            </Button.Group>,
                          ],
                        };
                      }),
                  ]}
                />
              )}
              <StripedTable
                title="Pending Margin Calculations"
                headings={['Time', 'Target Amount', 'Account']}
                loading={pendingMarginCalcsLoading}
                rows={pendingMarginCalcs
                  .filter(mc => mc.payload.customer === customer)
                  .reverse()
                  .map(mc => {
                    return {
                      elements: [
                        mc.payload.calculationTime,
                        formatCurrency(mc.payload.targetAmount),
                        mc.payload.accountId.label,
                      ],
                    };
                  })}
              />
            </div>
          </Tile>
        )}
        <Header as="h2">Mark to Market</Header>
        {(!!failedMTMCalcs.length || !!pendingMTMCalcs.length) && (
          <Tile header="In Progress">
            {!!failedMTMCalcs.length && (
              <StripedTable
                title="Failed MTM Calculations"
                headings={['Time', 'Target Amount', 'Account', 'Action']}
                loading={failedMTMCalcsLoading}
                rows={failedMTMCalcs
                  .filter(mc => mc.payload.customer === customer)
                  .reverse()
                  .map(mc => {
                    return {
                      elements: [
                        mc.payload.calculation.calculationTime,
                        formatCurrency(mc.payload.calculation.mtmAmount),
                        mc.payload.calculation.accountId.label,
                        <Button.Group size="mini">
                          <Button className="ghost" onClick={() => handleMTMRetry(mc.contractId)}>
                            Retry
                          </Button>
                          {!member && (
                            <Button
                              className="ghost"
                              onClick={() => handleMTMCancel(mc.contractId)}
                            >
                              Cancel
                            </Button>
                          )}
                        </Button.Group>,
                      ],
                    };
                  })}
              />
            )}
            <StripedTable
              title="Pending MTM Calculations"
              headings={['Time', 'Amount', 'Account']}
              loading={pendingMTMCalcsLoading}
              rows={pendingMTMCalcs
                .filter(mc => mc.payload.customer === customer)
                .reverse()
                .map(mc => {
                  return {
                    elements: [
                      mc.payload.calculationTime,
                      formatCurrency(mc.payload.mtmAmount),
                      mc.payload.accountId.label,
                    ],
                  };
                })}
            />
          </Tile>
        )}
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
                  formatCurrency(mc.payload.calculation.mtmAmount),
                  mc.payload.calculation.accountId.label,
                ],
              };
            })}
        />
      </div>
    );
  };

export const ClearingMember = withRouter(ClearingMemberComponent);
