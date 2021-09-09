import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { Button, Form } from 'semantic-ui-react';

import DamlLedger, { useLedger, useStreamQueries } from '@daml/react';
import { Template, Party } from '@daml/types';

import {
  httpBaseUrl,
  wsBaseUrl,
  useVerifiedParties,
  isHubDeployment,
  usePartyName,
} from '../../config';
import { itemListAsText } from '../page/utils';
import Credentials, { computeToken } from '../../Credentials';
import QueryStreamProvider from '../../websocket/queryStream';

import { Request as AuctionRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import { Request as BiddingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service';
import { Request as TradingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import { Request as ClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { Request as CustodyRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Request as MarketClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service/module';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import {
  ServiceKind,
  ServiceRequestTemplates,
  useServiceContext,
} from '../../context/ServicesContext';
import { RequestsProvider } from '../../context/RequestsContext';

import { retrieveUserParties } from '../../Parties';
import { InformationIcon } from '../../icons/icons';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';

import { CreateEvent } from '@daml/ledger';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import AccountSelection, { AccountType, AccountInfos } from './AccountSelection';
import QuickSetupPage from './QuickSetupPage';

export type AccountsForServices = {
  clearingAccount?: Account;
  marginAccount?: Account;
  tradingAccount?: Account;
  tradingAllocAccount?: Account;
  biddingAccount?: Account;
  biddingAllocAccount?: Account;
  issuanceAccount?: Account;
  auctionAccount?: Account;
  auctionAllocAccount?: Account;
  receivableAccount?: Account;
};

export interface IRequestServiceInfo {
  provider?: string;
  customer?: string;
  services?: ServiceKind[];
  accounts?: AccountsForServices;
}

const SUPPORTED_REQUESTS = [
  ServiceKind.MARKET_CLEARING,
  ServiceKind.LISTING,
  ServiceKind.CUSTODY,
  ServiceKind.ISSUANCE,
  ServiceKind.CLEARING,
  ServiceKind.TRADING,
  ServiceKind.AUCTION,
  ServiceKind.BIDDING,
];

const RequestServicesPage = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;
  const userParties = retrieveUserParties() || [];

  const [requestInfo, setRequestInfo] = useState<IRequestServiceInfo>();
  const [token, setToken] = useState<string>();
  const [creatingRequest, setCreatingRequest] = useState(false);

  const customer = requestInfo?.customer;

  useEffect(() => {
    if (customer) {
      if (isHubDeployment) {
        setToken(userParties.find(p => p.party === customer)?.token);
      } else {
        setToken(computeToken(customer));
      }
    }
  }, [userParties, customer]);

  return (
    <>
      <QuickSetupPage title="Provide Services" adminCredentials={adminCredentials}>
        <RequestForm
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          createRequest={() => setCreatingRequest(true)}
          creatingRequest={creatingRequest}
          token={token}
        />
      </QuickSetupPage>

      {creatingRequest && requestInfo && requestInfo.provider && requestInfo.customer && token && (
        <DamlLedger
          token={token}
          party={requestInfo.customer}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <QueryStreamProvider defaultPartyToken={token}>
            <RequestsProvider>
              <CreateServiceRequests
                requestInfo={requestInfo}
                onFinish={() => {
                  setCreatingRequest(false);
                  setRequestInfo(undefined);
                }}
              />
            </RequestsProvider>
          </QueryStreamProvider>
        </DamlLedger>
      )}
    </>
  );
};

export interface IPartyAccounts {
  accounts: CreateEvent<AssetSettlementRule>[];
  allocAccounts: CreateEvent<AllocationAccountRule>[];
}
const AccountsForParty = (props: {
  party?: Party;
  setAccountsForParty: (accounts?: IPartyAccounts) => void;
}) => {
  const { party, setAccountsForParty } = props;
  const allAccounts = useStreamQueries(AssetSettlementRule);
  const accounts = useMemo(
    () => allAccounts.contracts.filter(c => c.payload.account.owner === party),
    [allAccounts, party]
  );

  const allAllocationAccounts = useStreamQueries(AllocationAccountRule);
  const allocAccounts = useMemo(
    () => allAllocationAccounts.contracts.filter(c => c.payload.account.owner === party),
    [allAllocationAccounts, party]
  );
  useEffect(
    () => setAccountsForParty({ accounts, allocAccounts }),
    [accounts, allocAccounts, setAccountsForParty]
  );
  return null;
};

const RequestForm = (props: {
  requestInfo?: IRequestServiceInfo;
  setRequestInfo: (info?: IRequestServiceInfo) => void;
  createRequest: () => void;
  creatingRequest: boolean;
  token?: string;
}) => {
  const { requestInfo, setRequestInfo, createRequest, creatingRequest, token } = props;
  const [existingServices, setExistingServices] = useState<ServiceKind[]>([]);
  const { identities, loading: identitiesLoading } = useVerifiedParties();
  const { services } = useServiceContext();
  const { getName } = usePartyName('');
  const [accountsForParty, setAccountsForParty] = useState<IPartyAccounts>();

  const serviceOptions = SUPPORTED_REQUESTS.map(i => {
    return { text: `${i} Service`, value: i };
  });

  const partyOptions = identities.map(p => {
    return { text: p.payload.legalName, value: p.payload.customer };
  });
  const [accountSelectInfos, setAccountSelectInfos] = useState<AccountInfos>({});

  const handleSetAccountInfos = useCallback(
    (existing: ServiceKind[]) => {
      const newAccountInfos =
        requestInfo?.services?.reduce<AccountInfos>((acc, svc) => {
          if (existing.includes(svc)) return acc;

          switch (svc) {
            case ServiceKind.CLEARING:
              return {
                ...acc,
                clearingAccount: {
                  accountType: AccountType.REGULAR,
                  accountLabel: 'Clearing Account',
                },
                marginAccount: {
                  accountType: AccountType.ALLOCATION,
                  accountLabel: 'Margin Account',
                },
              };
            case ServiceKind.ISSUANCE:
              return {
                ...acc,
                issuanceAccount: {
                  accountType: AccountType.REGULAR,
                  accountLabel: 'Issuance Account',
                },
              };
            case ServiceKind.TRADING:
              return {
                ...acc,
                tradingAccount: {
                  accountType: AccountType.REGULAR,
                  accountLabel: 'Exchange Trading Account',
                },
                tradingAllocAccount: {
                  accountType: AccountType.ALLOCATION,
                  accountLabel: 'Exchange Locked Account',
                },
              };
            case ServiceKind.BIDDING:
              return {
                ...acc,
                biddingAccount: {
                  accountType: AccountType.REGULAR,
                  accountLabel: 'Bidding Account',
                },
                biddingAllocAccount: {
                  accountType: AccountType.ALLOCATION,
                  accountLabel: 'Bidding Locked Account',
                },
              };
            case ServiceKind.AUCTION:
              return {
                ...acc,
                auctionAccount: {
                  accountType: AccountType.REGULAR,
                  accountLabel: 'Main Auction Account',
                },
                auctionAllocAccount: {
                  accountType: AccountType.ALLOCATION,
                  accountLabel: 'Locked Auction Account',
                },
                receivableAccount: {
                  accountType: AccountType.REGULAR,
                  accountLabel: 'Receivables Account',
                },
              };
            default:
              return acc;
          }
        }, {}) || {};
      setAccountSelectInfos(newAccountInfos);
    },
    [requestInfo]
  );

  useEffect(() => {
    if (!requestInfo) {
      return;
    }

    const { customer, provider, services: requestServices } = requestInfo;

    if (!customer || !provider || !requestServices) {
      return;
    }

    const matchingContracts = services.filter(
      s => s.contract.payload.provider === provider && s.contract.payload.customer === customer
    );

    const existingServices = requestServices.filter(
      service => !!matchingContracts.find(s => s.service === service)
    );

    if (existingServices.length > 0) {
      setExistingServices(existingServices);
    } else {
      setExistingServices([]);
    }

    handleSetAccountInfos(existingServices);
  }, [requestInfo, services, setAccountSelectInfos, handleSetAccountInfos]);

  if (identitiesLoading) {
    return null;
  }

  const hasAccountsForServices = requestInfo?.services?.reduce((acc, svc) => {
    if (existingServices.includes(svc)) return acc;
    const accounts = requestInfo?.accounts;
    switch (svc) {
      case ServiceKind.CLEARING:
        return acc && !!accounts?.clearingAccount && !!accounts?.marginAccount;
      case ServiceKind.ISSUANCE:
        return acc && !!accounts?.issuanceAccount;
      case ServiceKind.TRADING:
        return acc && !!accounts?.tradingAccount && !!accounts?.tradingAllocAccount;
      case ServiceKind.BIDDING:
        return acc && !!accounts?.biddingAccount && !!accounts?.biddingAllocAccount;
      case ServiceKind.AUCTION:
        return (
          acc &&
          !!accounts?.auctionAccount &&
          !!accounts?.auctionAllocAccount &&
          !!accounts?.receivableAccount
        );
      default:
        return acc;
    }
  }, true);

  return (
    <>
      <Form>
        <Form.Select
          disabled={creatingRequest}
          className="request-select"
          label={<p className="input-label">Party:</p>}
          placeholder="Select..."
          value={requestInfo?.provider || ''}
          onChange={(_, data: any) =>
            setRequestInfo({
              ...requestInfo,
              provider: identities.find(p => p.payload.customer === data.value)?.payload.customer,
              accounts: {},
            })
          }
          options={partyOptions}
        />
        <Form.Select
          disabled={creatingRequest}
          className="request-select"
          label={<p className="input-label">Provides:</p>}
          placeholder="Select..."
          value={requestInfo?.services || []}
          multiple
          onChange={(_, data: any) =>
            setRequestInfo({ ...requestInfo, services: data.value as ServiceKind[] })
          }
          options={serviceOptions}
        />

        <Form.Select
          disabled={creatingRequest}
          className="request-select"
          label={<p className="input-label">To:</p>}
          value={requestInfo?.customer || ''}
          placeholder="Select..."
          onChange={(_, data: any) =>
            setRequestInfo({
              ...requestInfo,
              customer: identities.find(p => p.payload.customer === data.value)?.payload.customer,
              accounts: {},
            })
          }
          options={partyOptions}
        />

        {existingServices.length > 0 && requestInfo?.provider && requestInfo?.customer && (
          <p className="p2 message">
            <InformationIcon /> {getName(requestInfo?.provider)} already provides{' '}
            {itemListAsText(existingServices || [])} services to {getName(requestInfo?.customer)}
          </p>
        )}

        {requestInfo && requestInfo.customer && token && (
          <DamlLedger
            token={token}
            party={requestInfo.customer}
            httpBaseUrl={httpBaseUrl}
            wsBaseUrl={wsBaseUrl}
          >
            <AccountsForParty
              party={requestInfo.customer}
              setAccountsForParty={setAccountsForParty}
            />
            {!!Object.keys(accountSelectInfos).length && <h4>Accounts:</h4>}
            <AccountSelection
              accountInfos={accountSelectInfos}
              serviceProvider={requestInfo?.provider}
              accountsForServices={requestInfo?.accounts || {}}
              party={requestInfo.customer}
              accountsForParty={accountsForParty}
              onChangeAccount={(k: string, acct: Account | undefined) => {
                let acctsCopy: { [k: string]: Account | undefined } =
                  { ...requestInfo?.accounts } || {};
                acctsCopy[k] = acct;
                setRequestInfo({
                  ...requestInfo,
                  accounts: acctsCopy,
                });
              }}
            />
          </DamlLedger>
        )}
      </Form>
      <div className="page-row submit-actions">
        <Button
          className="ghost request"
          disabled={
            !requestInfo ||
            !requestInfo.provider ||
            !requestInfo.customer ||
            !requestInfo.services ||
            !hasAccountsForServices ||
            creatingRequest ||
            existingServices.length > 0
          }
          onClick={() => createRequest()}
        >
          {creatingRequest ? 'Creating Request...' : 'Request'}
        </Button>
      </div>
    </>
  );
};

const CreateServiceRequests = (props: {
  requestInfo: IRequestServiceInfo;
  onFinish: () => void;
}) => {
  const { requestInfo, onFinish } = props;

  const ledger = useLedger();

  const { provider, customer, services } = requestInfo;

  if (!provider || !customer || !services) {
    return null;
  }

  const params = {
    customer: customer,
    provider: provider,
  };

  async function offerServices() {
    if (services && provider && customer && services.length > 0) {
      await Promise.all(
        services.map(async service => {
          switch (service) {
            case ServiceKind.MARKET_CLEARING:
              await doRequest(MarketClearingRequest, params);
              break;
            case ServiceKind.LISTING:
              await doRequest(ListingRequest, params);
              break;
            case ServiceKind.CUSTODY:
              await doRequest(CustodyRequest, params);
              break;
            case ServiceKind.ISSUANCE:
              await doRequest(IssuanceRequest, params);
              break;
            case ServiceKind.CLEARING:
              const clearingAccounts = requestInfo?.accounts;
              if (!clearingAccounts?.clearingAccount || !clearingAccounts?.marginAccount) {
                return;
              }
              const clearingParams = {
                ...params,
                clearingAccount: clearingAccounts.clearingAccount,
                marginAccount: clearingAccounts.marginAccount,
              };
              await ledger.create(ClearingRequest, clearingParams);
              break;
            case ServiceKind.TRADING:
              const tradingAccounts = requestInfo?.accounts;
              if (!tradingAccounts?.tradingAccount || !tradingAccounts?.tradingAllocAccount) {
                return;
              }
              const tradingParams = {
                ...params,
                tradingAccount: tradingAccounts.tradingAccount,
                allocationAccount: tradingAccounts.tradingAllocAccount,
              };
              await ledger.create(TradingRequest, tradingParams);
              break;
            case ServiceKind.BIDDING:
              const biddingAccounts = requestInfo?.accounts;
              if (!biddingAccounts?.biddingAccount || !biddingAccounts?.biddingAllocAccount) {
                return;
              }
              const biddingParams = {
                ...params,
                tradingAccount: biddingAccounts.biddingAccount,
                allocationAccount: biddingAccounts.biddingAllocAccount,
              };
              await ledger.create(BiddingRequest, biddingParams);
              break;

            case ServiceKind.AUCTION:
              const accounts = requestInfo?.accounts;
              if (
                !accounts?.auctionAccount ||
                !accounts?.auctionAllocAccount ||
                !accounts?.receivableAccount
              ) {
                return;
              }
              const auctionParams = {
                ...params,
                tradingAccount: accounts.auctionAccount,
                allocationAccount: accounts.auctionAllocAccount,
                receivableAccount: accounts.receivableAccount,
              };
              await ledger.create(AuctionRequest, auctionParams);
              break;
            default:
              throw new Error(`Unsupported service: ${service}`);
          }
        })
      );
    }
    onFinish();
  }

  async function doRequest(
    request: Template<ServiceRequestTemplates, undefined, string>,
    params: { customer: string; provider: string }
  ) {
    return await ledger.create(request, params);
  }
  offerServices();
  return null;
};

export default RequestServicesPage;