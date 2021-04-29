import React, { useState } from 'react';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { getTemplateId, usePartyName } from '../../config';
import { Role, Offer as RoleOffer } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import { Offer, Service, Request } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import {
  Offer as MarketOffer,
  Service as MarketService,
  Request as MarketRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service';
import StripedTable from '../../components/Table/StripedTable';
import { Header, Button, Form, DropdownItemProps } from 'semantic-ui-react';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount/module';
import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';
import { createDropdownProp } from '../common';

const CLEARING_SERVICE_TEMPLATE = 'Marketplace.Clearing.Service.Service';
const CLEARING_REQUEST_TEMPLATE = 'Marketplace.Clearing.Service.Request';
const CLEARING_OFFER_TEMPLATE = 'Marketplace.Clearing.Service.Offer';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

export const ClearingServiceTable: React.FC<Props> = ({ services }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const { contracts: roleOffers, loading: roleOffersLoading } = useStreamQueries(RoleOffer);
  const { contracts: offers, loading: offersLoading } = useStreamQueries(Offer);
  const { contracts: marketOffers, loading: marketOffersLoading } = useStreamQueries(MarketOffer);
  const { contracts: requests, loading: requestsLoading } = useStreamQueries(Request);
  const { contracts: marketRequests, loading: marketRequestsLoading } = useStreamQueries(
    MarketRequest
  );

  const { contracts: marketServices, loading: marketServicesLoading } = useStreamQueries(
    MarketService
  );

  const roles = useStreamQueries(Role).contracts;
  const hasRole = roles.length > 0 && roles[0].payload.provider === party;

  const terminateService = async (c: CreateEvent<Service> | CreateEvent<MarketService>) => {
    if (getTemplateId(c.templateId) === CLEARING_SERVICE_TEMPLATE) {
      await ledger.exercise(Service.Terminate, c.contractId, { ctrl: party });
    } else {
      await ledger.exercise(MarketService.Terminate, c.contractId, { ctrl: party });
    }
  };

  const [clearingAccountName, setClearingAccountName] = useState('');
  const [marginAccountName, setMarginAccountName] = useState('');
  const [ccpAccountName, setCcpAccountName] = useState('');
  const allocationAccountRules = useStreamQueries(AllocationAccountRule).contracts;
  const allocationAccounts = allocationAccountRules
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);
  const allocationAccountNames: DropdownItemProps[] = allocationAccounts.map(a =>
    createDropdownProp(a.id.label)
  );

  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = assetSettlementRules
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);
  const accountNames: DropdownItemProps[] = accounts.map(a => createDropdownProp(a.id.label));

  const approveRequest = async (c: CreateEvent<Request> | CreateEvent<MarketRequest>) => {
    if (!hasRole) return; // TODO: Display error
    if (getTemplateId(c.templateId) === CLEARING_REQUEST_TEMPLATE) {
      await ledger.exercise(Role.ApproveClearingRequest, roles[0].contractId, {
        clearingRequestCid: (c as CreateEvent<Request>).contractId,
      });
    } else {
      await ledger.exercise(Role.ApproveMarketRequest, roles[0].contractId, {
        marketRequestCid: (c as CreateEvent<MarketRequest>).contractId,
      });
    }
  };

  const rejectRequest = async (c: CreateEvent<Request> | CreateEvent<MarketRequest>) => {
    if (!hasRole) return; // TODO: Display error
    if (getTemplateId(c.templateId) === CLEARING_REQUEST_TEMPLATE) {
      await ledger.exercise(Role.RejectClearingRequest, roles[0].contractId, {
        clearingRequestCid: (c as CreateEvent<Request>).contractId,
      });
    } else {
      await ledger.exercise(Role.RejectMarketRequest, roles[0].contractId, {
        marketRequestCid: (c as CreateEvent<MarketRequest>).contractId,
      });
    }
  };

  const cancelRequest = async (c: CreateEvent<Request> | CreateEvent<MarketRequest>) => {
    if (getTemplateId(c.templateId) === CLEARING_REQUEST_TEMPLATE) {
      await ledger.exercise(Request.Cancel, c.contractId, {});
    } else {
      await ledger.exercise(MarketRequest.Cancel, c.contractId, {});
    }
  };

  const acceptOffer = async (c: CreateEvent<Offer> | CreateEvent<MarketOffer>) => {
    if (getTemplateId(c.templateId) === CLEARING_OFFER_TEMPLATE) {
      const clearingAccount = accounts.find(a => a.id.label === clearingAccountName);
      const marginAccount = allocationAccounts.find(a => a.id.label === marginAccountName);
      if (!clearingAccount || !marginAccount) return;
      await ledger.exercise(Offer.Accept, c.contractId, { marginAccount, clearingAccount });
    } else {
      await ledger.exercise(MarketOffer.Accept, c.contractId, {});
    }
  };

  const withdrawOffer = async (c: CreateEvent<Offer>) => {
    await ledger.exercise(Offer.Withdraw, c.contractId, {});
  };

  const rejectOffer = async (c: CreateEvent<Offer>) => {
    await ledger.exercise(Offer.Decline, c.contractId, {});
  };

  const acceptRoleOffer = async (c: CreateEvent<RoleOffer>) => {
    const ccpAccount = accounts.find(a => a.id.label === ccpAccountName);
    if (!ccpAccount) return;
    await ledger.exercise(RoleOffer.Accept, c.contractId, { ccpAccount });
  };

  const declineRoleOffer = async (c: CreateEvent<RoleOffer>) => {
    await ledger.exercise(RoleOffer.Decline, c.contractId, {});
  };

  return (
    <div className="assets">
      <Header as="h3">Current Services</Header>
      <StripedTable
        headings={['Service', 'Operator', 'Provider', 'Consumer', 'Role', 'Action' /* 'Details' */]}
        loading={marketServicesLoading}
        rows={[...services, ...marketServices].map((c, i) => {
          return {
            elements: [
              getTemplateId(c.templateId),
              getName(c.payload.operator),
              getName(c.payload.provider),
              getName(c.payload.customer),
              party === c.payload.provider ? 'Provider' : 'Consumer',
              <Button
                size="small"
                className="ghost"
                variant="contained"
                onClick={() => terminateService(c)}
              >
                Terminate
              </Button>,
            ],
          };
        })}
      />
      <Header as="h3">Requests</Header>
      <StripedTable
        headings={['Type', 'Consumer', 'Actions' /* 'Details' */]}
        loading={requestsLoading}
        rows={[...requests, ...marketRequests].map((c, i) => {
          return {
            elements: [
              getTemplateId(c.templateId),
              getName(c.payload.customer),
              <Button.Group>
                {c.payload.customer === party ? (
                  <>
                    <Button
                      size="small"
                      className="ghost"
                      variant="contained"
                      onClick={() => cancelRequest(c)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="small"
                      className="ghost"
                      variant="contained"
                      onClick={() => approveRequest(c)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      className="ghost"
                      variant="contained"
                      onClick={() => rejectRequest(c)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </Button.Group>,
            ],
          };
        })}
      />
      <Header as="h3">Offers</Header>
      <StripedTable
        headings={['Type', 'Consumer', 'Actions' /* 'Details' */]}
        loading={offersLoading}
        rows={[
          ...offers.map((c, i) => {
            return {
              elements: [
                getTemplateId(c.templateId),
                getName(c.payload.customer),
                <Button.Group>
                  {c.payload.customer === party ? (
                    <>
                      <ModalFormErrorHandled onSubmit={() => acceptOffer(c)} title="Accept Offer">
                        <Form.Select
                          label="Clearing Account"
                          placeholder="Select..."
                          required
                          min={1}
                          options={accountNames}
                          value={clearingAccountName}
                          onChange={(_, change) => setClearingAccountName(change.value as string)}
                        />
                        <Form.Select
                          label="Margin Account"
                          placeholder="Select..."
                          required
                          options={allocationAccountNames}
                          value={marginAccountName}
                          onChange={(_, change) => setMarginAccountName(change.value as string)}
                        />
                      </ModalFormErrorHandled>
                      <Button
                        size="small"
                        className="ghost"
                        variant="contained"
                        onClick={() => rejectOffer(c)}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="small"
                        className="ghost"
                        variant="contained"
                        onClick={() => withdrawOffer(c)}
                      >
                        Withdraw
                      </Button>
                    </>
                  )}
                </Button.Group>,
              ],
            };
          }),
          ...marketOffers.map((c, i) => {
            return {
              elements: [
                getTemplateId(c.templateId),
                getName(c.payload.customer),
                <>
                  {c.payload.customer === party ? (
                    <Button className="ghost" onClick={() => acceptOffer(c)}>
                      Accept
                    </Button>
                  ) : (
                    <></>
                  )}
                </>,
              ],
            };
          }),
        ]}
      />
      <Header as="h3">Role Offers</Header>
      <StripedTable
        headings={['Type', 'Consumer', 'Actions' /* 'Details' */]}
        loading={roleOffersLoading}
        rows={roleOffers.map((c, i) => {
          return {
            elements: [
              getTemplateId(c.templateId),
              getName(c.payload.provider),
              <Button.Group>
                <ModalFormErrorHandled onSubmit={() => acceptRoleOffer(c)} title="Accept Offer">
                  <Form.Select
                    label="Clearing Account"
                    placeholder="Select..."
                    required
                    min={1}
                    options={accountNames}
                    value={ccpAccountName}
                    onChange={(_, change) => setCcpAccountName(change.value as string)}
                  />
                </ModalFormErrorHandled>
                <Button
                  size="small"
                  className="ghost"
                  variant="contained"
                  onClick={() => declineRoleOffer(c)}
                >
                  Decline
                </Button>
              </Button.Group>,
            ],
          };
        })}
      />
    </div>
  );
};

export default ClearingServiceTable;
