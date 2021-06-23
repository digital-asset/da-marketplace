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
  ProcessRequestChoice,
  RequestApproveChoice,
  RequestApproveFields,
  RequestApproves,
  RequestRejectChoice,
  RequestTemplates,
} from './NotificationTypes';

import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';

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

interface PendingRequestProps {
  details: string;
}

export function PendingRequestNotification({ details }: PendingRequestProps) {
  return (
    <Notification>
      <p>{details}</p>
      <p className="pending">pending</p>
    </Notification>
  );
}

interface InboundRequestProps {
  contract: CreateEvent<any>;
  processChoice: ProcessRequestChoice;
  details: string;
  tag: string;
}

export function ProcessCustodyRequestNotification({
  contract,
  processChoice,
  details,
  tag,
}: InboundRequestProps) {
  const ledger = useLedger();
  const party = useParty();

  const displayErrorMessage = useDisplayErrorMessage();
  const services = useStreamQueries(CustodyService).contracts;

  const providerServices = services.filter(s => s.payload.provider === party);
  const custodyService = providerServices.find(
    s => s.payload.customer === contract.payload.customer
  );

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
    if (!custodyService) {
      return displayErrorMessage({
        header: 'Failed to Process Request',
        message: 'Could not find Custody service contract',
      });
    }
    switch (tag) {
      case 'open-account':
        await ledger.exercise(processChoice, custodyService.contractId, {
          openAccountRequestCid: contract.contractId,
        });
        break;
      case 'close-account':
        await ledger.exercise(processChoice, custodyService.contractId, {
          closeAccountRequestCid: contract.contractId,
        });

        break;
      case 'credit-account':
        await ledger.exercise(processChoice, custodyService.contractId, {
          creditAccountRequestCid: contract.contractId,
        });
        break;
      case 'debit-account':
        await ledger.exercise(processChoice, custodyService.contractId, {
          debitAccountRequestCid: contract.contractId,
        });
        break;
      case 'transfer':
        await ledger.exercise(processChoice, custodyService.contractId, {
          transferDepositRequestCid: contract.contractId,
        });
        break;
    }
  }
}
