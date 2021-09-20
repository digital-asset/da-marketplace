import React, { useEffect, useState, useMemo } from 'react';
import OverflowMenu, { OverflowMenuEntry } from '../page/OverflowMenu';
import {
  ServiceKind,
  ServiceRequestTemplates,
  ServiceRequest,
} from '../../context/ServicesContext';

import { ServiceRequestDialog } from '../../components/InputDialog/ServiceDialog';

import { Template, Party } from '@daml/types';
import { Request as CustodyRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Request as MarketClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service/module';
import { Request as ClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Request as TradingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import { Request as AuctionRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import { Request as BiddingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service';

import _ from 'lodash';
import {
  Fields,
  FieldCallbacks,
  FieldCallback,
  defaultItems,
} from '../../components/InputDialog/Fields';
import { RoleKind, useProvidersByRole } from '../../context/RolesContext';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { usePartyName, useVerifiedParties } from '../../config';
import { useParty } from '@daml/react';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';

import { useStreamQueries } from '../../Main';

interface RequestInterface {
  customer: string;
  provider: string;
  tradingAccount?: Account;
  allocationAccount?: Account;
  receivableAccount?: Account;
  clearingAccount?: Account;
  marginAccount?: Account;
}

const ServiceRequestMenu: React.FC = () => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const providersByRole = useProvidersByRole();

  const { identities } = useVerifiedParties();

  const [request, setRequest] = useState<ServiceRequest>();
  const [serviceKind, setServiceKind] = useState<ServiceKind>();
  const [openDialog, setOpenDialog] = useState(false);
  const [fields, setFields] = useState<object>({});
  const [fieldsFromProvider, setFieldsFromProvider] = useState<FieldCallbacks<Party>>({});
  const [dialogState, setDialogState] = useState<any>({});
  const [requestParams, setRequestParams] = useState<RequestInterface>({
    provider: '',
    customer: '',
  });

  const allocationAccountRules = useStreamQueries(AllocationAccountRule).contracts;
  const allocationAccounts = useMemo(
    () =>
      allocationAccountRules
        .filter(c => c.payload.account.owner === party)
        .map(c => c.payload.account),
    [party, allocationAccountRules]
  );

  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = useMemo(
    () =>
      assetSettlementRules
        .filter(c => c.payload.account.owner === party)
        .map(c => c.payload.account),
    [party, assetSettlementRules]
  );

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
    const provider =
      identities.find(i => i.payload.legalName === dialogState?.provider)?.payload.customer || '';

    const filteredFields: Fields = _.mapValues(fieldsFromProvider, createFieldFn =>
      createFieldFn(provider)
    );

    setFields(fields => ({
      ...fields,
      ...filteredFields,
    }));
  }, [dialogState, fieldsFromProvider, identities]);

  const requestService = <T extends ServiceRequestTemplates>(
    service: Template<T, undefined, string>,
    kind: ServiceKind,
    role: RoleKind,
    extraFields?: Fields,
    fieldsFromProvider?: FieldCallbacks<Party>
  ) => {
    const providerNames = providersByRole.get(role)?.map(p => getName(p.payload.provider)) || [];
    setFieldsFromProvider(fieldsFromProvider || {});
    setFields({
      provider: {
        label: 'Provider',
        type: 'selection',
        items: defaultItems(providerNames),
      },
      ...extraFields,
    });

    setRequest(service as unknown as Template<ServiceRequestTemplates, undefined, string>);
    setServiceKind(kind);
    setOpenDialog(true);
  };
  const [dialogDisabled, setDialogDisabled] = useState(false);

  useEffect(() => {
    setDialogDisabled(
      Object.values(dialogState).filter(v => v !== '').length !== Object.values(fields).length
    );
  }, [fields, dialogState]);

  if (serviceKind && request) {
    return (
      <ServiceRequestDialog
        open={openDialog}
        service={serviceKind}
        fields={fields}
        params={requestParams}
        request={request}
        onChange={state => setDialogState(state)}
        disabled={dialogDisabled}
        onClose={() => {
          setServiceKind(undefined);
        }}
      />
    );
  }
  const makeAccountFilterField =
    (label: string): FieldCallback<Party> =>
    provider => {
      return {
        label,
        type: 'selection',
        items: defaultItems(
          assetSettlementRules
            .filter(
              ar =>
                ar.payload.observers.map.has(provider) || ar.payload.account.provider === provider
            )
            .map(ar => ar.payload.account.id.label)
        ),
      };
    };
  const makeAllocationAccountFilterField =
    (label: string): FieldCallback<Party> =>
    provider => {
      return {
        label,
        type: 'selection',
        items: defaultItems(
          allocationAccountRules
            .filter(ar => ar.payload.nominee === provider)
            .map(ar => ar.payload.account.id.label)
        ),
      };
    };
  return (
    <OverflowMenu>
      <OverflowMenuEntry
        label="Request Custody Service"
        onClick={() => requestService(CustodyRequest, ServiceKind.CUSTODY, RoleKind.CUSTODY)}
      />
      <OverflowMenuEntry
        label="Request Issuance Service"
        onClick={() => requestService(IssuanceRequest, ServiceKind.ISSUANCE, RoleKind.CUSTODY)}
      />
      <OverflowMenuEntry
        label="Request Listing Service"
        onClick={() => requestService(ListingRequest, ServiceKind.LISTING, RoleKind.TRADING)}
      />
      <OverflowMenuEntry
        label="Request Market Clearing Service"
        onClick={() =>
          requestService(MarketClearingRequest, ServiceKind.MARKET_CLEARING, RoleKind.CLEARING)
        }
      />
      <OverflowMenuEntry
        label="Request Clearing Service"
        onClick={() =>
          requestService(
            ClearingRequest,
            ServiceKind.CLEARING,
            RoleKind.CLEARING,
            {},
            {
              clearingAccount: makeAccountFilterField(
                'Clearing Account (requires provider to be observer on account'
              ),
              marginAccount: makeAllocationAccountFilterField(
                'Margin Account (requires provider to be nominee of allocation account)'
              ),
            }
          )
        }
      />
      <OverflowMenuEntry
        label="Request Trading Service"
        onClick={() =>
          requestService(
            TradingRequest,
            ServiceKind.TRADING,
            RoleKind.TRADING,
            {},
            {
              tradingAccount: makeAccountFilterField(
                'Trading Account (requires provider to be provider on account)'
              ),
              allocationAccount: makeAllocationAccountFilterField(
                'Allocation Account (requires provider to be nominee on account)'
              ),
            }
          )
        }
      />
      <OverflowMenuEntry
        label="Request Auction Service"
        onClick={() =>
          requestService(
            AuctionRequest,
            ServiceKind.AUCTION,
            RoleKind.DISTRIBUTION,
            {},
            {
              tradingAccount: makeAccountFilterField(
                'Trading Account (requires provider to be provider or observer on account)'
              ),
              allocationAccount: makeAllocationAccountFilterField(
                'Allocation Account (requires provider to be nominee on account)'
              ),
              receivableAccount: makeAccountFilterField(
                'Receivable Account (requires provider to be provider or observer on account)'
              ),
            }
          )
        }
      />
      <OverflowMenuEntry
        label="Request Bidding Service"
        onClick={() =>
          requestService(
            BiddingRequest,
            ServiceKind.BIDDING,
            RoleKind.DISTRIBUTION,
            {},
            {
              tradingAccount: makeAccountFilterField(
                'Trading Account (requires provider to be provider on account)'
              ),
              allocationAccount: makeAllocationAccountFilterField(
                'Allocation Account (requires provider to be nominee on account)'
              ),
            }
          )
        }
      />
    </OverflowMenu>
  );
};

export default ServiceRequestMenu;
