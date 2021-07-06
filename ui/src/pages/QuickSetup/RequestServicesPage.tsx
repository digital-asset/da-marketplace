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
import { itemListAsText } from '../../pages/page/utils';
import { computeToken } from '../../Credentials';
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

import { NewAccount } from '../custody/New';
import { CreateEvent } from '@daml/ledger';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import AccountSelectionModal, { AccountType, AccountInfos } from './AccountSelectionModal';

type AccountsForServices = {
  clearingAccount?: Account;
  marginAccount?: Account;
  tradingAccount?: Account;
  tradingAllocAccount?: Account;
  biddingAccount?: Account;
  biddingAllocAccount?: Account;
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

const RequestServicesPage = () => {
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
    <div className="request-services">
      <RequestForm
        requestInfo={requestInfo}
        setRequestInfo={setRequestInfo}
        createRequest={() => setCreatingRequest(true)}
        creatingRequest={creatingRequest}
        token={token}
      />
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
    </div>
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
    return { text: i, value: i };
  });

  const partyOptions = identities.map(p => {
    return { text: p.payload.legalName, value: p.payload.customer };
  });
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [modalAccountInfos, setModalAccountInfos] = useState<AccountInfos>({});
  const [modalOnCancelFunction, setModalOnCancelFunction] = useState<() => void>(() => {
    return;
  });
  const selectAccounts = useCallback(
    (serviceType: ServiceKind) => {
      switch (serviceType) {
        case ServiceKind.CLEARING:
          setModalAccountInfos({
            clearingAccount: {
              accountType: AccountType.REGULAR,
              accountLabel: 'Clearing Account',
            },
            marginAccount: {
              accountType: AccountType.ALLOCATION,
              accountLabel: 'Margin Account',
            },
          });
          break;
        case ServiceKind.TRADING:
          setModalAccountInfos({
            tradingAccount: {
              accountType: AccountType.REGULAR,
              accountLabel: 'Exchange Trading Account',
            },
            tradingAllocAccount: {
              accountType: AccountType.ALLOCATION,
              accountLabel: 'Locked Account',
            },
          });
          break;
        case ServiceKind.BIDDING:
          setModalAccountInfos({
            biddingAccount: {
              accountType: AccountType.REGULAR,
              accountLabel: 'Bidding Account',
            },
            biddingAllocAccount: {
              accountType: AccountType.ALLOCATION,
              accountLabel: 'Bidding Locked Account',
            },
          });
          break;
        case ServiceKind.AUCTION:
          setModalAccountInfos({
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
          });
          break;
      }
      setModalOnCancelFunction(
        () => () =>
          setRequestInfo({
            ...requestInfo,
            services: requestInfo?.services?.filter(s => s !== serviceType),
          })
      );
      setShowAccountModal(true);
    },
    [requestInfo, setRequestInfo]
  );

  useEffect(() => {
    if (!requestInfo) {
      return;
    }

    const { customer, provider, services: requestServices } = requestInfo;

    if (!customer || !provider || !requestServices) {
      return;
    }

    const accounts = requestInfo?.accounts;
    if (requestServices.includes(ServiceKind.CLEARING)) {
      if (!accounts?.clearingAccount || !accounts?.marginAccount)
        selectAccounts(ServiceKind.CLEARING);
    }

    if (requestServices.includes(ServiceKind.TRADING)) {
      if (!accounts?.tradingAccount || !accounts?.tradingAllocAccount)
        selectAccounts(ServiceKind.TRADING);
    }

    if (requestServices.includes(ServiceKind.BIDDING)) {
      if (!accounts?.biddingAccount || !accounts?.biddingAllocAccount)
        selectAccounts(ServiceKind.BIDDING);
    }

    if (requestServices.includes(ServiceKind.AUCTION)) {
      if (
        !accounts?.auctionAccount ||
        !accounts?.auctionAllocAccount ||
        !accounts?.receivableAccount
      )
        selectAccounts(ServiceKind.AUCTION);
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
  }, [requestInfo, services, setModalAccountInfos, setShowAccountModal, selectAccounts]);

  if (identitiesLoading) {
    return null;
  }

  return (
    <>
      <Form>
        <Form.Select
          disabled={creatingRequest}
          className="request-select"
          label={<p className="input-label">As:</p>}
          value={requestInfo?.customer || ''}
          placeholder="Select..."
          onChange={(_, data: any) =>
            setRequestInfo({
              ...requestInfo,
              customer: identities.find(p => p.payload.customer === data.value)?.payload.customer,
            })
          }
          options={partyOptions}
        />
        <Form.Select
          disabled={creatingRequest}
          className="request-select"
          label={<p className="input-label">Request Service:</p>}
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
          label={<p className="input-label">From:</p>}
          placeholder="Select..."
          value={requestInfo?.provider || ''}
          onChange={(_, data: any) =>
            setRequestInfo({
              ...requestInfo,
              provider: identities.find(p => p.payload.customer === data.value)?.payload.customer,
            })
          }
          options={partyOptions}
        />
      </Form>

      {existingServices.length > 0 && requestInfo?.provider && requestInfo?.customer && (
        <p className="p2 message">
          <InformationIcon /> {getName(requestInfo?.provider)} already provides{' '}
          {itemListAsText(existingServices || [])} services to {getName(requestInfo?.customer)}
        </p>
      )}
      <div className="submit-actions">
        <Button
          className="ghost request"
          disabled={
            !requestInfo ||
            !requestInfo.provider ||
            !requestInfo.customer ||
            !requestInfo.services ||
            creatingRequest ||
            existingServices.length > 0
          }
          onClick={() => createRequest()}
        >
          {creatingRequest ? 'Creating Request...' : 'Request'}
        </Button>
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
            <AccountSelectionModal
              accountInfos={modalAccountInfos}
              open={showAccountModal}
              serviceProvider={requestInfo?.provider}
              setOpen={setShowAccountModal}
              party={requestInfo.customer}
              accountsForParty={accountsForParty}
              onCancel={modalOnCancelFunction}
              onFinish={(accts: { [k: string]: Account | undefined }) => {
                setRequestInfo({
                  ...requestInfo,
                  accounts: { ...requestInfo?.accounts, ...accts },
                });
              }}
            />
            <NewAccount party={requestInfo.customer} modal />
          </DamlLedger>
        )}
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
