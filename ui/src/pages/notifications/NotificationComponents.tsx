import React, { useEffect, useState } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';

import { useLedger } from '@daml/react';
import { ContractId } from '@daml/types';

import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { Field, FieldComponents, Fields } from '../../components/InputDialog/Fields';
import { usePartyName } from '../../config';

import {
  OfferAcceptChoice,
  OfferAcceptFields,
  OfferAccepts,
  OfferDeclineChoice,
  OfferTemplates,
  RequestApproveChoice,
  RequestApproveFields,
  RequestApproves,
  RequestRejectChoice,
  RequestTemplates,
} from './NotificationTypes';
import { Offer } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';

const Notification: React.FC = ({ children }) => {
  return (
    <div className="notification">
      <Message>{children}</Message>
    </div>
  );
};

type OfferProps<F extends Fields> = {
  contract: ContractId<OfferTemplates>;
  serviceText: string;

  offerer: string;
  acceptChoice: OfferAcceptChoice;
  declineChoice: OfferDeclineChoice;
} & OfferAcceptFields<F>;

export function OfferNotification<T extends Fields>({
  acceptChoice,
  declineChoice,
  contract,
  offerer,
  acceptFields,
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
      ledger.exercise(acceptChoice, contract, args);
    }
  };

  const onDecline = async () => {
    ledger.exercise(declineChoice, contract, {});
  };

  return (
    <Notification>
      <h3>
        {name} is offering {serviceText}.
      </h3>
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
            <Button
              className="ghost"
              content="Accept"
              type="submit"
              disabled={
                acceptFields &&
                Object.entries(acceptArgs).length !== Object.entries(acceptFields).length
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
      <h3>
        {name} is requesting {serviceText}.
      </h3>
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

            <Button className="ghost" content="Approve" type="submit" />
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
