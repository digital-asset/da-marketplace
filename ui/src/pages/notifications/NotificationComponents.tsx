import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

import { CreateEvent } from '@daml/ledger';

import _ from 'lodash';

import { useLedger, useParty } from '@daml/react';
import { ContractId } from '@daml/types';

import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { FieldComponents, Fields, Field } from '../../components/InputDialog/Fields';
import { usePartyName } from '../../config';

import { useStreamQueries } from '../../Main';

import {
  OfferAcceptChoice,
  OfferAcceptFields,
  OfferAccepts,
  OfferDeclineChoice,
  OfferTemplates,
  OutboundRequestTemplates,
  ProcessRequestTemplates,
  RequestApproveChoice,
  RequestApproveFields,
  RequestApproves,
  RequestRejectChoice,
  RequestTemplates,
} from './NotificationTypes';
import {
  CloseAccountRequest,
  DebitAccountRequest,
  OpenAccountRequest,
  TransferDepositRequest,
  CreditAccountRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model';
import {
  Service as CustodyService,
  CloseAccount,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';

import { useDisplayErrorMessage } from '../../context/MessagesContext';

const Notification: React.FC = ({ children }) => {
  return <div className="notification">{children}</div>;
};

type OfferProps<F extends Fields, T = OfferTemplates> = {
  contractId: ContractId<T>;
  contract: T;
  serviceText: string;

  offerer: string;
  acceptChoice: OfferAcceptChoice;
  declineChoice: OfferDeclineChoice;
} & OfferAcceptFields<F, T>;

export function OfferNotification<T extends Fields>({
  acceptChoice,
  declineChoice,
  contract,
  contractId,
  offerer,
  acceptFields,
  fromContractFields,
  lookupFields,
  serviceText,
}: OfferProps<T>) {
  const ledger = useLedger();
  const { name } = usePartyName(offerer);
  const [acceptArgs, setAcceptArgs] = useState<Record<keyof Extract<OfferAccepts, T>, string>>(
    {} as Record<keyof Extract<OfferAccepts, T>, string>
  );

  const onAccept = async () => {
    if (lookupFields) {
      const args = lookupFields(acceptArgs);
      await ledger.exercise(acceptChoice, contractId, args);
    } else {
      await ledger.exercise(acceptChoice, contractId, {});
    }
  };

  const onDecline = async () => {
    await ledger.exercise(declineChoice, contractId, {});
  };

  const createdFields: Record<any, Field> | undefined = !!fromContractFields
    ? _.mapValues(fromContractFields, createFieldFn => createFieldFn(contract))
    : undefined;

  return (
    <Notification>
      <p>
        {name} is offering {serviceText}.
      </p>
      <FormErrorHandled onSubmit={onAccept}>
        {loadAndCatch => (
          <Form.Group className="inline-form-group">
            {acceptFields && (
              <FieldComponents
                placeholderLabels
                fields={acceptFields}
                defaultValue={acceptArgs}
                onChange={state => state && setAcceptArgs(state)}
              />
            )}
            {createdFields && (
              <FieldComponents
                placeholderLabels
                fields={createdFields}
                defaultValue={acceptArgs}
                onChange={state => state && setAcceptArgs(state)}
              />
            )}
            <Button
              className="ghost"
              content="Accept"
              type="submit"
              disabled={
                Object.entries(acceptArgs).length !==
                Object.entries(acceptFields || {}).length +
                  Object.entries(fromContractFields || {}).length
              }
            />
            <Button
              className="ghost warning"
              content="Decline"
              type="button"
              onClick={() => loadAndCatch(onDecline)}
            />
          </Form.Group>
        )}
      </FormErrorHandled>
    </Notification>
  );
}

type RequestProps<F extends Fields> = {
  serviceText: string;
  requester: string;

  contract: ContractId<RequestTemplates>;
  approveChoice: RequestApproveChoice;
  rejectChoice: RequestRejectChoice;
} & RequestApproveFields<F>;

export function RequestNotification<T extends Fields>({
  approveChoice,
  rejectChoice,
  contract,
  requester,
  approveFields,
  lookupFields,
  serviceText,
}: RequestProps<T>) {
  const ledger = useLedger();
  const { name } = usePartyName(requester);
  const [approveArgs, setApproveArgs] = useState<Record<keyof Extract<RequestApproves, T>, string>>(
    {} as Record<keyof Extract<RequestApproves, T>, string>
  );

  const onApprove = async () => {
    if (lookupFields) {
      const args = lookupFields(approveArgs);
      ledger.exercise(approveChoice, contract, args);
    }
  };

  const onReject = async () => {
    ledger.exercise(rejectChoice, contract, {});
  };

  return (
    <Notification>
      <p>
        {name} is requesting {serviceText}.
      </p>
      <FormErrorHandled onSubmit={onApprove}>
        {loadAndCatch => (
          <Form.Group className="inline-form-group">
            {approveFields && (
              <FieldComponents
                placeholderLabels
                fields={approveFields}
                defaultValue={approveArgs}
                onChange={state => state && setApproveArgs(state)}
              />
            )}

            <Button
              className="ghost"
              content="Approve"
              type="submit"
              disabled={!lookupFields}
              onClick={() => loadAndCatch(onApprove)}
            />
            <Button
              className="ghost warning"
              content="Reject"
              type="button"
              onClick={() => loadAndCatch(onReject)}
            />
          </Form.Group>
        )}
      </FormErrorHandled>
    </Notification>
  );
}

interface OutboundRequestProps {
  details: string;
}

export function OutboundRequestNotification({ details }: OutboundRequestProps) {
  return (
    <Notification>
      <p>{details}</p>
      <p className="pending">pending</p>
    </Notification>
  );
}

interface InboundRequestProps {
  contract: CreateEvent<ProcessRequestTemplates>;
  details: string;
  tag: string;
}

export function ProcessRequestNotification({ contract, details, tag }: InboundRequestProps) {
  const ledger = useLedger();
  const party = useParty();

  const displayErrorMessage = useDisplayErrorMessage();
  const services = useStreamQueries(CustodyService).contracts;

  const providerServices = services.filter(s => s.payload.provider === party);

  const openAccount = async (c: CreateEvent<OpenAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return;
    await ledger.exercise(CustodyService.OpenAccount, service.contractId, {
      openAccountRequestCid: c.contractId,
    });
  };

  const closeAccount = async (c: CreateEvent<CloseAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to close account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(CustodyService.CloseAccount, service.contractId, {
      closeAccountRequestCid: c.contractId,
    });
  };

  const creditAccount = async (c: CreateEvent<CreditAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Credit Account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(CustodyService.CreditAccount, service.contractId, {
      creditAccountRequestCid: c.contractId,
    });
  };

  const debitAccount = async (c: CreateEvent<DebitAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Debit Account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(CustodyService.DebitAccount, service.contractId, {
      debitAccountRequestCid: c.contractId,
    });
  };

  const transferDeposit = async (c: CreateEvent<TransferDepositRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Transfer Deposit',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(CustodyService.TransferDeposit, service.contractId, {
      transferDepositRequestCid: c.contractId,
    });
  };

  return (
    <Notification>
      <p>{details} </p>
      <FormErrorHandled onSubmit={onProcess}>
        {loadAndCatch => (
          <Form.Group className="inline-form-group">
            <Button
              className="ghost"
              content="Process"
              type="submit"
              onClick={() => loadAndCatch(onProcess)}
            />
          </Form.Group>
        )}
      </FormErrorHandled>
    </Notification>
  );

  async function onProcess() {
    switch (tag) {
      case 'open-account':
        return openAccount(contract as CreateEvent<OpenAccountRequest>);
      case 'close-account':
        return closeAccount(contract as CreateEvent<CloseAccountRequest>);
      case 'credit-account':
        return creditAccount(contract as CreateEvent<CreditAccountRequest>);
      case 'debit-account':
        return debitAccount(contract as CreateEvent<DebitAccountRequest>);
      case 'transfer':
        return transferDeposit(contract as CreateEvent<TransferDepositRequest>);
    }
  }
}
