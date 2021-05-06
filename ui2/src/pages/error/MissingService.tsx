import React, { useEffect, useState } from 'react';
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
} from '../../context/ServicesContext';
import { Template } from '@daml/types';
import { Button } from '@material-ui/core';
import {NavLink} from 'react-router-dom';

type MissingServiceProps = {
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

export const MissingService: React.FC<MissingServiceProps> = ({ service, action, children }) => {
  const party = useParty();
  const providers = useProviderServices(party);

  const identities = useStreamQueries(VerifiedIdentity).contracts;
  const legalNames = identities.map(c => c.payload.legalName);

  const allocationAccountRules = useStreamQueries(AllocationAccountRule).contracts;
  const allocationAccounts = allocationAccountRules
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);
  const allocationAccountNames = allocationAccounts.map(a => a.id.label);

  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = assetSettlementRules
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);
  const accountNames = accounts.map(a => a.id.label);

  const deposits = useStreamQueries(AssetDeposit).contracts;

  const [request, setRequest] = useState<ServiceRequest>(CustodyRequest);
  const [serviceKind, setServiceKind] = useState<ServiceKind>(ServiceKind.CUSTODY);
  const [openDialog, setOpenDialog] = useState(false);
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
    kind: ServiceKind,
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

    setRequest((service as unknown) as Template<ServiceRequestTemplates, undefined, string>);
    setServiceKind(kind);
    setOpenDialog(true);
  };
  const go = () => {
    console.log('going');
    switch (service) {
      case ServiceKind.CLEARING:
        requestService(ClearingRequest, ServiceKind.CLEARING, {
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
        requestService(TradingRequest, ServiceKind.TRADING, {
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
      case ServiceKind.CUSTODY:
        requestService(CustodyRequest, service);
        break;
      case ServiceKind.ISSUANCE:
        requestService(IssuanceRequest, service);
        break;
      case ServiceKind.LISTING:
        requestService(ListingRequest, service);
        break;
      case ServiceKind.AUCTION:
        requestService(AuctionRequest, ServiceKind.AUCTION, {
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
    }
  };

  return (
    <div>
      <ServiceRequestDialog
        open={openDialog}
        service={serviceKind}
        fields={fields}
        params={requestParams}
        request={request}
        onChange={state => setDialogState(state)}
        onClose={open => setOpenDialog(open)}
      />
      <NavLink to='#' onClick={go}>{action}</NavLink>
    </div>
  );
};

type MissingRoleProps = {
  role: RoleServiceKind;
  action: string;
};

export const MissingRole: React.FC<MissingRoleProps> = ({ role, action }) => {
  const party = useParty();
  return (
    <>
      You need the {role} role to {action}
    </>
  );
};
