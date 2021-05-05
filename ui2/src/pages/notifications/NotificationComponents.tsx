import React from 'react';
import { Button, Form, Message } from 'semantic-ui-react';

import { useLedger } from '@daml/react';
import { ContractId } from '@daml/types';

import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { usePartyName } from '../../config';
import {
  OfferAcceptChoice,
  OfferDeclineChoice,
  OfferTemplates,
  RequestApproveChoice,
  RequestRejectChoice,
  RequestTemplates,
} from './NotificationTypes';

const Notification: React.FC = ({ children }) => {
  return (
    <div className="notification">
      <Message>{children}</Message>
    </div>
  );
};

type OfferProps = {
  serviceText: string;
  offerer: string;

  contract: ContractId<OfferTemplates>;
  acceptChoice: OfferAcceptChoice;
  declineChoice: OfferDeclineChoice;
};

export const OfferNotification: React.FC<OfferProps> = ({
  acceptChoice,
  declineChoice,
  contract,
  offerer,
  serviceText,
}) => {
  const ledger = useLedger();
  const { name } = usePartyName(offerer);

  const onAccept = async () => {
    ledger.exercise(acceptChoice, contract, {});
  };

  const onDecline = async () => {
    ledger.exercise(declineChoice, contract, {});
  };

  return (
    <Notification>
      <FormErrorHandled onSubmit={onAccept}>
        {loadAndCatch => (
          <Form.Group className="inline-form-group">
            <p>
              {name} is offering {serviceText}.
            </p>
            <Button className="ghost" content="Accept" type="submit" />
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
};

type RequestProps = {
  serviceText: string;
  requester: string;

  contract: ContractId<RequestTemplates>;
  approveChoice: RequestApproveChoice;
  rejectChoice: RequestRejectChoice;
};

export const RequestNotification: React.FC<RequestProps> = ({
  approveChoice,
  rejectChoice,
  contract,
  requester,
  serviceText,
}) => {
  const ledger = useLedger();
  const { name } = usePartyName(requester);

  const onApprove = async () => {
    ledger.exercise(approveChoice, contract, {});
  };

  const onReject = async () => {
    ledger.exercise(rejectChoice, contract, {});
  };

  return (
    <Notification>
      <FormErrorHandled onSubmit={onApprove}>
        {loadAndCatch => (
          <Form.Group className="inline-form-group">
            <p>
              {name} is requesting {serviceText}.
            </p>
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
};
