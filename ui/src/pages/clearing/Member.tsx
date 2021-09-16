import React, {useState} from 'react';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { useLedger, useParty, useStreamQueries } from '@daml/react';
import {
  AssetDeposit,
  AssetDeposit_SetObservers,
} from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
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
import {damlSetValues, isEmptySet, makeDamlSet, ServicePageProps} from '../common';
import { Button, Header } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import MarginCallModal from './MarginCallModal';
import MTMCalculationModal from './MTMCalculationModal';
import {ContractId, Party} from '@daml/types';
import { formatCurrency } from '../../util';
import TitleWithActions from '../../components/Common/TitleWithActions';
import InfoCard from '../../components/Common/InfoCard';
import OverflowMenu, {OverflowMenuEntry} from "../page/OverflowMenu";
import {usePartyName} from "../../config";
import {CreateEvent} from "@daml/ledger";
import AllocationModal from "./AllocationModal";

type Props = {
  member?: boolean;
};

const ClearingMemberComponent: React.FC<RouteComponentProps & ServicePageProps<Service> & Props> = ({
  history,
  services,
  member}) => {
    const { contractId } = useParams<any>();
    let party = useParty();
    const { getName } = usePartyName(party);
    const [openMarginDialog, setOpenMarginDialog] = useState(false);
    const [deposit, setDeposit] = useState<CreateEvent<AssetDeposit>>();
    const [observers, setObservers] = useState<AssetDeposit_SetObservers>({
      newObservers : makeDamlSet<string>([])
    });
    const [modalTitle, setModalTitle] = useState('');

    const ledger = useLedger();
    const service = useStreamQueries(Service).contracts.find(s =>
      !!member ? s.payload.customer === party : s.contractId === contractId
    )?.payload;
    const customer = service?.customer;

    const standings = useStreamQueries(MemberStanding).contracts;
    const standing = standings.find(standing => standing.payload.customer === customer);

    const { contracts: allDeposits, loading: depositsLoading } = useStreamQueries(AssetDeposit);
    const deposits = allDeposits.filter(a => a.payload.account.id.label === service?.clearingAccount.id.label);
    const availableDeposits = deposits.filter(d => isEmptySet(d.payload.lockers) && !d.payload.observers.map.has(service?.provider || ''));
    const clearingDeposits = deposits.filter(d => isEmptySet(d.payload.lockers) && d.payload.observers.map.has(service?.provider || ''));
    const marginDeposits = deposits.filter(d => d.payload.lockers.map.has(service?.provider || 'unknown'));
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
      const choice = RejectedMarkToMarketCalculation.RejectedMarkToMarketCalculation_Retry;
      await ledger.exercise(choice, cid, { ctrl: party });
    };
    const handleMTMCancel = async (cid: ContractId<RejectedMarkToMarketCalculation>) => {
      const choice = RejectedMarkToMarketCalculation.RejectedMarkToMarketCalculation_Cancel;
      await ledger.exercise(choice, cid, {});
    };

    const handleMarginRetry = async (cid: ContractId<RejectedMarginCalculation>) => {
      const choice = RejectedMarginCalculation.RejectedMarginCalculation_Retry;
      await ledger.exercise(choice, cid, { ctrl: party });
    };
    const handleMarginCancel = async (cid: ContractId<RejectedMarginCalculation>) => {
      const choice = RejectedMarginCalculation.RejectedMarginCalculation_Cancel;
      await ledger.exercise(choice, cid, {});
    };

    if (!service) return <></>

    const onAllocateToClearing = (targetDeposit : CreateEvent<AssetDeposit>) => {
      if (targetDeposit && service) {
        setModalTitle("Allocate to Clearing")
        setDeposit(targetDeposit);
        setObservers({
            newObservers: makeDamlSet<string>([...targetDeposit.observers, service.provider])
          }
        );
        setOpenMarginDialog(true);
      }
    }

  const onDeallocateFromClearing = (targetDeposit : CreateEvent<AssetDeposit>) => {
    if (targetDeposit && service) {
      setModalTitle("Deallocate from Clearing")
      setDeposit(targetDeposit);
      setObservers({
          newObservers: makeDamlSet<string>([...targetDeposit.observers.filter(o => o != service.provider)])
        }
      );
      setOpenMarginDialog(true);
    }
  }

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
        <>
          <AllocationModal
            deposit={deposit}
            title={modalTitle}
            open={openMarginDialog}
            onClose={open => setOpenMarginDialog(open)}
            observers={observers}
          />
        </>
        {party === service.clearingAccount.owner &&
        <div>
            <Header as="h2">Available Deposits</Header>
            <div className="account">
                <div className="account-details">
                    <div className="account-data">
                        <h4> {service.clearingAccount.id.label} </h4>
                    </div>
                    <div className="account-data body">
                        <p className="p2">Provider: {getName(service.clearingAccount.provider)}</p>
                        <p className="p2">Owner: {getName(service.clearingAccount.owner)}</p>
                        <p className="p2">
                            Role: {party === service.clearingAccount.provider ? 'Provider' : 'Client'}
                        </p>
                        <p className="p2">
                            Signatories:{' '}
                          {damlSetValues(service.clearingAccount.id.signatories)
                            .map(a => getName(a))
                            .sort()
                            .join(', ')}
                        </p>
                    </div>
                </div>
              {availableDeposits.length > 0 ? (
                availableDeposits.map(c => (
                  <Tile className="account-holding" key={c.contractId}>
                    <p>
                      <b>{c.payload.asset.id.label}</b> {c.payload.asset.quantity}{' '}
                    </p>
                    {party === service.clearingAccount.owner && (
                      <OverflowMenu align={'right'}>
                        <OverflowMenuEntry label={'Allocate to Clearing Account'}
                                           onClick={() => onAllocateToClearing(c)}/>
                      </OverflowMenu>
                    )}
                  </Tile>
                ))
              ) : (
                <Tile className="account-holding">
                  <i>There are no holdings in this account.</i>
                </Tile>
              )}
            </div>
        </div>
        }
        <div>
          <Header as="h2">Clearing Deposits</Header>
            <div className="account">
              <div className="account-details">
                <div className="account-data">
                  <h4> {service.clearingAccount.id.label} </h4>
                </div>
                <div className="account-data body">
                  <p className="p2">Provider: {getName(service.clearingAccount.provider)}</p>
                  <p className="p2">Owner: {getName(service.clearingAccount.owner)}</p>
                  <p className="p2">
                    Role: {party === service.clearingAccount.provider ? 'Provider' : 'Client'}
                  </p>
                  <p className="p2">
                    Signatories:{' '}
                    {damlSetValues(service.clearingAccount.id.signatories)
                      .map(a => getName(a))
                      .sort()
                      .join(', ')}
                  </p>
                </div>
              </div>
              {clearingDeposits.length > 0 ? (
                clearingDeposits.map(c => (
                  <Tile className="account-holding" key={c.contractId}>
                    <p>
                      <b>{c.payload.asset.id.label}</b> {c.payload.asset.quantity}{' '}
                    </p>
                    {party === service.clearingAccount.owner && (
                       <OverflowMenu align={'right'}>
                         <OverflowMenuEntry label={'Deallocate from Clearing'} onClick={() => onDeallocateFromClearing(c)} />
                       </OverflowMenu>
                     )}
                  </Tile>
                ))
              ) : (
                <Tile className="account-holding">
                  <i>There are no holdings in this account.</i>
                </Tile>
              )}
            </div>
        </div>
        <div>
          <Header as="h2">Margin Deposits</Header>
          <div className="account">
            <div className="account-details">
              <div className="account-data">
                <h4> {service.clearingAccount.id.label} </h4>
              </div>
              <div className="account-data body">
                <p className="p2">Provider: {getName(service.clearingAccount.provider)}</p>
                <p className="p2">Owner: {getName(service.clearingAccount.owner)}</p>
                <p className="p2">
                  Role: {party === service.clearingAccount.provider ? 'Provider' : 'Client'}
                </p>
                <p className="p2">
                  Signatories:{' '}
                  {damlSetValues(service.clearingAccount.id.signatories)
                    .map(a => getName(a))
                    .sort()
                    .join(', ')}
                </p>
              </div>
            </div>
            {marginDeposits.length > 0 ? (
              marginDeposits.map(c => (
                <Tile className="account-holding" key={c.contractId}>
                  <p>
                    <b>{c.payload.asset.id.label}</b> {c.payload.asset.quantity}{' '}
                  </p>
                </Tile>
              ))
            ) : (
              <Tile className="account-holding">
                <i>There are no holdings in this account.</i>
              </Tile>
            )}
          </div>
        </div>
      </div>
    );
  };

export const ClearingMember = withRouter(ClearingMemberComponent);
