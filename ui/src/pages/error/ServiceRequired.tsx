import React, { useEffect, useState, useMemo } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { Request as CustodyRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Request as ClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Request as TradingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import { Request as AuctionRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { useParty, useStreamQueries } from '@daml/react';
import { ServiceRequestDialog } from '../../components/InputDialog/ServiceDialog';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
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

type ServiceRequiredProps = {
  service: ServiceKind;
  action: string;
};

interface RequestInterface {
  customer: string;
  provider: string;
  tradingAccount?: Account;
  allocationAccount?: Account;
  receivableAccount?: Account;
  clearingAccount?: Account;
  marginAccount?: Account;
}

export const ServiceRequired: React.FC<ServiceRequiredProps> = ({ service, action, children }) => {
  const party = useParty();

  const identities = useStreamQueries(VerifiedIdentity).contracts;
  const legalNames = useMemo(() => identities.map(c => c.payload.legalName), [identities]);

  const allocationAccountRules = useStreamQueries(AllocationAccountRule).contracts;
  const allocationAccounts = useMemo(
    () =>
      allocationAccountRules
        .filter(c => c.payload.account.owner === party)
        .map(c => c.payload.account),
    [party, allocationAccountRules]
  );
  const allocationAccountNames = useMemo(
    () => allocationAccounts.map(a => a.id.label),
    [allocationAccounts]
  );

  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = useMemo(
    () =>
      assetSettlementRules
        .filter(c => c.payload.account.owner === party)
        .map(c => c.payload.account),
    [party, assetSettlementRules]
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

    if (dialogState?.tradingAccount) {
      const tradingAccount = accounts.find(a => a.id.label === dialogState.tradingAccount);
      params = {
        ...params,
        tradingAccount,
      };
    }

    if (dialogState?.allocationAccount) {
      const allocationAccount = allocationAccounts.find(
        a => a.id.label === dialogState.allocationAccount
      );
      params = {
        ...params,
        allocationAccount,
      };
    }

    if (dialogState?.clearingAccount) {
      const clearingAccount = accounts.find(a => a.id.label === dialogState.clearingAccount);
      params = {
        ...params,
        clearingAccount,
      };
    }

    if (dialogState?.marginAccount) {
      const marginAccount = allocationAccounts.find(a => a.id.label === dialogState.marginAccount);
      params = {
        ...params,
        marginAccount,
      };
    }

    if (dialogState?.receivableAccount) {
      const receivableAccount = accounts.find(a => a.id.label === dialogState.receivableAccount);
      params = {
        ...params,
        receivableAccount,
      };
    }

    setRequestParams(params);
  }, [dialogState, accounts, allocationAccounts, identities, party]);

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
          marginAccount: {
            label: 'Margin Account',
            type: 'selection',
            items: allocationAccountNames,
          },
        });
        break;
      case ServiceKind.TRADING:
        requestService(TradingRequest, {
          tradingAccount: {
            label: 'Trading Account',
            type: 'selection',
            items: accountNames,
          },
          allocationAccount: {
            label: 'Allocation Account',
            type: 'selection',
            items: allocationAccountNames,
          },
        });
        break;
      case ServiceKind.AUCTION:
        requestService(AuctionRequest, {
          tradingAccount: {
            label: 'Trading Account',
            type: 'selection',
            items: accountNames,
          },
          allocationAccount: {
            label: 'Allocation Account',
            type: 'selection',
            items: allocationAccountNames,
          },
          receivableAccount: {
            label: 'Receivable Account',
            type: 'selection',
            items: accountNames,
          },
        });
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
  }, [service, legalNames, accountNames, allocationAccountNames]);

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
