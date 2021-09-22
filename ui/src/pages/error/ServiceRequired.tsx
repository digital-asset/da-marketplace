import React, { useEffect, useState, useMemo } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import {
  Request as CustodyRequest,
  Service as CustodyService
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Request as ClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Request as TradingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import { Request as AuctionRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { useParty, useStreamQueries } from '@daml/react';
import { ServiceRequestDialog } from '../../components/InputDialog/ServiceDialog';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import {
  ServiceKind,
  ServiceRequest,
  ServiceRequestTemplates,
  useServiceKindsProvided,
} from '../../context/ServicesContext';
import { Template } from '@daml/types';

import { useHistory } from 'react-router-dom';
import { useServiceRequestKinds } from '../../context/RequestsContext';
import MissingServiceModal from '../../components/Common/MissingServiceModal';
import {ServicePageProps} from "../common";

type ServiceRequiredProps = {
  service: ServiceKind;
  action: string;
};

interface RequestInterface {
  customer: string;
  provider: string;
  clearingAccount?: Account;
}

export const ServiceRequired: React.FC<ServiceRequiredProps & ServicePageProps<CustodyService>> = ({
    service,
    action,
    children,
    services
  }) => {
  const party = useParty();
  const identities = useStreamQueries(VerifiedIdentity).contracts;
  const legalNames = useMemo(() => identities.map(c => c.payload.legalName), [identities]);

  const accounts = useMemo(() =>
      services
        .filter(c => c.payload.account.owner === party)
        .map(c => c.payload.account),
    [party, services]
  );
  const accountNames = useMemo(() => accounts.map(a => a.id.label), [accounts]);

  const [newRequest, setNewRequest] = useState(false);
  const [request, setRequest] = useState<ServiceRequest>(CustodyRequest);
  const [openDialog, setOpenDialog] = useState(true);
  const [fields, setFields] = useState<object>({});
  const [dialogState, setDialogState] = useState<any>({});
  const [requestParams, setRequestParams] = useState<RequestInterface>({
    provider: '',
    customer: '',
  });

  useEffect(() => {
    const provider =
      identities.find(i => i.payload.legalName === dialogState?.provider)?.payload.customer || '';

    let params: RequestInterface = {
      customer: party,
      provider,
    };

    if (dialogState?.clearingAccount) {
      const clearingAccount = accounts.find(a => a.id.label === dialogState.clearingAccount);
      params = {
        ...params,
        clearingAccount,
      };
    }

    setRequestParams(params);
  }, [dialogState, accounts, identities, party]);

  useEffect(() => {
    const requestService = <T extends ServiceRequestTemplates>(
      service: Template<T, undefined, string>,
      extraFields?: object
    ) => {
      setFields({
        provider: {
          label: 'Provider',
          type: 'selection',
          items: legalNames,
        },
        ...extraFields,
      });

      setRequest(service as unknown as Template<ServiceRequestTemplates, undefined, string>);
    };

    switch (service) {
      case ServiceKind.CLEARING:
        requestService(ClearingRequest, {
          clearingAccount: {
            label: 'Clearing Account',
            type: 'selection',
            items: accountNames,
          },
        });
        break;
      case ServiceKind.TRADING:
        requestService(TradingRequest);
        break;
      case ServiceKind.AUCTION:
        requestService(AuctionRequest);
        break;
      case ServiceKind.CUSTODY:
        requestService(CustodyRequest);
        break;
      case ServiceKind.ISSUANCE:
        requestService(IssuanceRequest);
        break;
      case ServiceKind.LISTING:
        requestService(ListingRequest);
        break;
    }
  }, [service, legalNames, accountNames]);

  const history = useHistory();
  const onClose = (open: boolean) => {
    setOpenDialog(open);
    history.goBack();
  };

  const requests = useServiceRequestKinds();
  const serviceKinds = useServiceKindsProvided(party);
  const [showRequiredServiceRequest, setShowRequiredServiceRequest] = useState(false);

  if (!serviceKinds.has(service)) {
    return (
      <div>
        {!requests.has(service) || newRequest ? (
          showRequiredServiceRequest ? (
            <ServiceRequestDialog
              open={openDialog}
              service={service}
              fields={fields}
              params={requestParams}
              request={request}
              onChange={state => setDialogState(state)}
              onClose={onClose}
            />
          ) : (
            <MissingServiceModal
              onClose={() => history.goBack()}
              onRequest={() => setShowRequiredServiceRequest(true)}
              missingService={service}
              action={action}
            />
          )
        ) : (
          <Modal open={openDialog} size="small" onClose={() => history.goBack()}>
            <Modal.Header as="h2">
              Waiting for {service} service request to be accepted...
            </Modal.Header>
            <Modal.Content>Request created...</Modal.Content>
            <Modal.Actions>
              <Button className="ghost" onClick={() => setNewRequest(true)}>
                New Request
              </Button>
              <Button className="ghost" onClick={() => history.goBack()}>
                Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </div>
    );
  } else {
    return <>{children}</>;
  }
};
