import React, { useEffect, useState, useMemo } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { Request as CustodyRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Request as MarketClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service/module';
import { Request as ClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Request as TradingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import { Request as AuctionRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import { Request as BiddingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service';
import { useRoleKinds, ServiceKind as RoleServiceKind } from '../../context/RolesContext';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { useParty, useStreamQueries } from '@daml/react';
import { ServiceRequestDialog } from '../../components/InputDialog/ServiceDialog';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import {
  ServiceKind,
  ServiceRequest,
  ServiceRequestTemplates,
  useProviderServices,
  useServiceKindsProvided,
} from '../../context/ServicesContext';
import { Template } from '@daml/types';
import { NavLink, useHistory } from 'react-router-dom';
import SetUp from '../setup/SetUp';
import { useRequestKinds } from '../../context/RequestsContext';

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
    [allocationAccountRules]
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
    [assetSettlementRules]
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
  }, [dialogState]);

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

  useEffect(() => {
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
        console.log('auction request');
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
  }, [legalNames, accountNames, allocationAccountNames]);

  const history = useHistory();
  const onClose = (open: boolean) => {
    setOpenDialog(open);
    history.goBack();
  };

  const requests = useRequestKinds();
  const serviceKinds = useServiceKindsProvided(party);
  if (!serviceKinds.has(service)) {
    return (
      <div>
        {!requests.has(service) || newRequest ? (
          <ServiceRequestDialog
            open={openDialog}
            service={service}
            fields={fields}
            params={requestParams}
            request={request}
            onChange={state => setDialogState(state)}
            onClose={onClose}
            title={`${service} service, is required to ${action}, please request and try again`}
          />
        ) : (
          <Modal open={openDialog} size="small" onClose={() => history.goBack()}>
            <Modal.Header as="h3">
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
