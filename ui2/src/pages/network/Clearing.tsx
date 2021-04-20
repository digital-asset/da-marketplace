import React, { useState } from 'react';
import { withRouter, RouteComponentProps, NavLink } from 'react-router-dom';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import useStyles from '../styles';
import { getName, getTemplateId } from '../../config';
import { InputDialog, InputDialogProps } from '../../components/InputDialog/InputDialog';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { Role } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import { Offer, Service, Request } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import StripedTable from '../../components/Table/StripedTable';
import { Header, Button, Form, DropdownItemProps } from 'semantic-ui-react';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount/module';
import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';
import { createDropdownProp } from '../common';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

export const ClearingServiceTable: React.FC<Props> = ({ services }) => {
  const party = useParty();
  const ledger = useLedger();

  const offers = useStreamQueries(Offer).contracts;
  const requests = useStreamQueries(Request).contracts;

  const roles = useStreamQueries(Role).contracts;
  const hasRole = roles.length > 0 && roles[0].payload.provider === party;

  const terminateService = async (c: CreateEvent<Service>) => {
    await ledger.exercise(Service.Terminate, c.contractId, { ctrl: party });
  };

  const [clearingAccountName, setClearingAccountName] = useState('');
  const [marginAccountName, setMarginAccountName] = useState('');
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

  const approveRequest = async (c: CreateEvent<Request>) => {
    if (!hasRole) return; // TODO: Display error
    console.log(roles[0].contractId);
    await ledger.exercise(Role.ApproveClearingRequest, roles[0].contractId, {
      clearingRequestCid: c.contractId,
    });
  };

  const rejectRequest = async (c: CreateEvent<Request>) => {
    if (!hasRole) return; // TODO: Display error
    console.log(roles[0].contractId);
    await ledger.exercise(Role.RejectClearingRequest, roles[0].contractId, {
      clearingRequestCid: c.contractId,
    });
  };

  const cancelRequest = async (c: CreateEvent<Request>) => {
    await ledger.exercise(Request.Cancel, c.contractId, {});
  };

  const acceptOffer = async (c: CreateEvent<Offer>) => {
    const clearingAccount = accounts.find(a => a.id.label === clearingAccountName);
    const marginAccount = allocationAccounts.find(a => a.id.label === marginAccountName);
    if (!clearingAccount || !marginAccount) return;
    await ledger.exercise(Offer.Accept, c.contractId, { marginAccount, clearingAccount });
  };

  const withdrawOffer = async (c: CreateEvent<Offer>) => {
    await ledger.exercise(Offer.Withdraw, c.contractId, {});
  };

  const rejectOffer = async (c: CreateEvent<Offer>) => {
    await ledger.exercise(Offer.Decline, c.contractId, {});
  };

  return (
    <div className="assets">
      <Header as="h3">Current Services</Header>
      <StripedTable
        headings={['Service', 'Operator', 'Provider', 'Consumer', 'Role', 'Action' /* 'Details' */]}
        rows={services.map((c, i) => {
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
        rows={requests.map((c, i) => {
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
                      Approve
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
        rows={offers.map((c, i) => {
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
        })}
      />
    </div>
  );
};

export default ClearingServiceTable;
