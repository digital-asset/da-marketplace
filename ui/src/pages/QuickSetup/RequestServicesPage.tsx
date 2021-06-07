import React, { useState, useEffect, useMemo } from 'react';

import { Button, Form, Modal } from 'semantic-ui-react';

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
  ServicesProvider,
  useServiceContext,
} from '../../context/ServicesContext';
import { RequestsProvider } from '../../context/RequestsContext';

import { retrieveUserParties } from '../../Parties';
import { IconCheck, InformationIcon } from '../../icons/icons';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';

import QuickSetupPage from './QuickSetupPage';
import { MenuItems, LoadingWheel } from './QuickSetup';
import { NewAccount } from '../custody/New';
import { CreateEvent } from '@daml/ledger';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
// import ClearingSelectionModal from './ClearingSelectionModal';
import TradingSelectionModal from './TradingSelectionModal';
import AccountSelectionModal, {
  AccountType,
  AccountInfos,
  SetFunction,
} from './AccountSelectionModal';

type AccountsForServices = {
  clearing?: {
    clearingAccount?: Account;
    marginAccount?: Account;
  };
  trading?: {
    tradingAccount?: Account;
    allocationAccount?: Account;
  };
  auction?: {
    tradingAccount?: Account;
    allocationAccount?: Account;
    receivableAccount?: Account;
  };
  bidding?: {
    tradingAccount?: Account;
    allocationAccount?: Account;
  };
};

type AccountsForServicesB = {
  clearingAccount?: Account;
  marginAccount?: Account;
  tradingAccount?: Account;
  allocationAccount?: Account;
  receivableAccount?: Account;
}

const accountInfos = {
  clearing: {
    clearingAccount: {
      accountType: AccountType.REGULAR,
      accountLabel: 'Clearing Account',
    },
    marginAccount: {
      accountType: AccountType.ALLOCATION,
      accountLabel: 'Margin Account',
    },
  },
  trading: {
    tradingAccount: {
      accountType: AccountType.REGULAR,
      accountLabel: 'Exchange Trading Account',
    },
    allocationAccount: {
      accountType: AccountType.ALLOCATION,
      accountLabel: 'Locked Account',
    },
  },
  auction: {
    tradingAccount: {
      accountType: AccountType.REGULAR,
      accountLabel: 'Auction Trading Account',
    },
    allocationAccount: {
      accountType: AccountType.REGULAR,
      accountLabel: 'Locked Auction Account',
    },
    receivableAccount: {
      accountType: AccountType.REGULAR,
      accountLabel: 'Receivables Account',
    },
  },
  bidding: {
    tradingAccount: {
      accountType: AccountType.REGULAR,
      accountLabel: 'Bidding Account',
    },
    allocationAccount: {
      accountType: AccountType.ALLOCATION,
      accountLabel: 'Bidding Locked Account',
    },
  },
};

export interface IRequestServiceInfo {
  provider?: string;
  customer?: string;
  services?: ServiceKind[];
  accounts?: AccountsForServices;
}

// without the ability to create accounts from quick setup, these requests are the only ones supported at this stage
const SUPPORTED_REQUESTS = [
  ServiceKind.MARKET_CLEARING,
  ServiceKind.LISTING,
  ServiceKind.CUSTODY,
  ServiceKind.ISSUANCE,
  ServiceKind.CLEARING,
  ServiceKind.TRADING,
];

const RequestServicesPage = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;

  const userParties = retrieveUserParties() || [];

  const [requestInfo, setRequestInfo] = useState<IRequestServiceInfo>();
  const [token, setToken] = useState<string>();
  const [creatingRequest, setCreatingRequest] = useState(false);
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);

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

  const onFinishCreatingRequest = (success: boolean) => {
    if (success) {
      setAddedSuccessfully(true);
      setTimeout(() => {
        setAddedSuccessfully(false);
        setRequestInfo(undefined);
      }, 2500);
    }
  };

  return (
    <>
      <DamlLedger
        party={adminCredentials.party}
        token={adminCredentials.token}
        httpBaseUrl={httpBaseUrl}
        wsBaseUrl={wsBaseUrl}
      >
        <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
          <ServicesProvider>
            <RequestForm
              requestInfo={requestInfo}
              setRequestInfo={setRequestInfo}
              createRequest={() => setCreatingRequest(true)}
              creatingRequest={creatingRequest}
              addedSuccessfully={addedSuccessfully}
              token={token}
            />
          </ServicesProvider>
        </QueryStreamProvider>
      </DamlLedger>
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
                onFinish={success => {
                  setCreatingRequest(false);
                  onFinishCreatingRequest(success);
                }}
              />
            </RequestsProvider>
          </QueryStreamProvider>
        </DamlLedger>
      )}
    </>
  );
};

export interface PartyAccountsI {
  accounts: CreateEvent<AssetSettlementRule>[];
  allocAccounts: CreateEvent<AllocationAccountRule>[];
}
const AccountsForParty = (props: {
  party?: Party;
  setAccountsForParty: (accounts?: PartyAccountsI) => void;
}) => {
  const { party, setAccountsForParty } = props;
  const allAccounts = useStreamQueries(AssetSettlementRule);
  const accounts = useMemo(
    () => allAccounts.contracts.filter(c => c.payload.account.owner === party),
    [allAccounts]
  );

  const allAllocationAccounts = useStreamQueries(AllocationAccountRule);
  const allocAccounts = useMemo(
    () => allAllocationAccounts.contracts.filter(c => c.payload.account.owner === party),
    [allAllocationAccounts]
  );
  useEffect(() => setAccountsForParty({ accounts, allocAccounts }), [accounts, allocAccounts]);
  return null;
};

const RequestForm = (props: {
  requestInfo?: IRequestServiceInfo;
  setRequestInfo: (info?: IRequestServiceInfo) => void;
  createRequest: () => void;
  creatingRequest: boolean;
  addedSuccessfully: boolean;
  token?: string;
}) => {
  const { requestInfo, setRequestInfo, createRequest, creatingRequest, addedSuccessfully, token } =
    props;
  const [existingServices, setExistingServices] = useState<ServiceKind[]>([]);
  const { identities, loading: identitiesLoading } = useVerifiedParties();
  const { services } = useServiceContext();
  const { getName } = usePartyName('');
  const [showTradingAccountModal, setShowTradingAccountModal] = useState(false);
  const [accountsForParty, setAccountsForParty] = useState<PartyAccountsI>();

  const serviceOptions = SUPPORTED_REQUESTS.map(i => {
    return { text: i, value: i };
  });

  const partyOptions = identities.map(p => {
    return { text: p.payload.legalName, value: p.payload.customer };
  });

  const setClearingAccounts = (accts: { [k: string]: Account | undefined }) => {
    setRequestInfo({ ...requestInfo, accounts: { ...requestInfo?.accounts, clearing: accts } });
  };

  const setTradingAccounts = (accts: { [k: string]: Account | undefined }) => {
    setRequestInfo({ ...requestInfo, accounts: { ...requestInfo?.accounts, trading: accts } });
  };
  const setAuctionAccounts = (accts: { [k: string]: Account | undefined }) => {
    setRequestInfo({ ...requestInfo, accounts: { ...requestInfo?.accounts, auction: accts } });
  };
  const setBiddingAccounts = (accts: { [k: string]: Account | undefined }) => {
    setRequestInfo({ ...requestInfo, accounts: { ...requestInfo?.accounts, bidding: accts } });
  };

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [modalAccountInfos, setModalAccountInfos] = useState<AccountInfos>(accountInfos.clearing);
  const [modalSetFunction, setModalSetFunction] = useState<SetFunction>(() => {
    return;
  });
  const [modalOnCancelFunction, setModalOnCancelFunction] = useState<() => void>(() => {
    return;
  });

  const selectAccounts = (serviceType: ServiceKind) => {
    setModalOnCancelFunction(
      () => () =>
        setRequestInfo({
          ...requestInfo,
          services: requestInfo?.services?.filter(s => s !== serviceType),
        })
    );
    switch (serviceType) {
      case ServiceKind.CLEARING:
        setModalAccountInfos(accountInfos.clearing);
        setModalSetFunction(() => (accts: { [k: string]: Account | undefined }) => {
          setRequestInfo({
            ...requestInfo,
            accounts: { ...requestInfo?.accounts, clearing: accts },
          });
        });
        break;
      case ServiceKind.TRADING:
        setModalAccountInfos(accountInfos.trading);
        setModalSetFunction(() => (accts: { [k: string]: Account | undefined }) => {
          setRequestInfo({
            ...requestInfo,
            accounts: { ...requestInfo?.accounts, trading: accts },
          });
        });
        break;
      case ServiceKind.BIDDING:
        setModalAccountInfos(accountInfos.bidding);
        setModalSetFunction(() => (accts: { [k: string]: Account | undefined }) => {
          setRequestInfo({
            ...requestInfo,
            accounts: { ...requestInfo?.accounts, bidding: accts },
          });
        });
        break;
      case ServiceKind.AUCTION:
        setModalAccountInfos(accountInfos.auction);
        setModalSetFunction(() => (accts: { [k: string]: Account | undefined }) => {
          setRequestInfo({
            ...requestInfo,
            accounts: { ...requestInfo?.accounts, auction: accts },
          });
        });
        break;
    }
    setShowAccountModal(true);
  };

  useEffect(() => {
    if (!requestInfo) {
      return;
    }

    const { customer, provider, services: requestServices } = requestInfo;

    if (!customer || !provider || !requestServices) {
      return;
    }

    if (requestServices.includes(ServiceKind.CLEARING)) {
      const clearingAccounts = requestInfo?.accounts?.clearing;
      if (
        !clearingAccounts ||
        !clearingAccounts?.clearingAccount ||
        !clearingAccounts?.marginAccount
      ) {
        selectAccounts(ServiceKind.CLEARING);
      }
    }

    if (requestServices.includes(ServiceKind.TRADING)) {
      const tradingAccounts = requestInfo?.accounts?.trading;
      if (!tradingAccounts?.tradingAccount || !tradingAccounts?.allocationAccount) {
        selectAccounts(ServiceKind.TRADING);
      }
    }

    if (requestServices.includes(ServiceKind.BIDDING)) {
      const biddingAccounts = requestInfo?.accounts?.bidding;
      if (!biddingAccounts?.tradingAccount || !biddingAccounts?.allocationAccount) {
        selectAccounts(ServiceKind.BIDDING);
      }
    }

    if (requestServices.includes(ServiceKind.AUCTION)) {
      const auctionAccounts = requestInfo?.accounts?.auction;
      if (
        !auctionAccounts?.tradingAccount ||
        !auctionAccounts?.allocationAccount ||
        !auctionAccounts.receivableAccount
      ) {
        selectAccounts(ServiceKind.AUCTION);
      }
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
  }, [requestInfo, services, setModalAccountInfos, setModalSetFunction, setShowAccountModal]);

  if (identitiesLoading) {
    return (
      <QuickSetupPage className="loading">
        <LoadingWheel label="Loading parties..." />
      </QuickSetupPage>
    );
  }

  return (
    <QuickSetupPage
      className="request-services"
      nextItem={MenuItems.REVIEW}
      title="Request Services"
    >
      <div className="page-row"></div>
      <div className="page-row">
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
          {addedSuccessfully && (
            <p className="message">
              <IconCheck /> {itemListAsText(requestInfo?.services || [])} Successfully Requested
            </p>
          )}
          {existingServices.length > 0 && requestInfo?.provider && requestInfo?.customer && (
            <p className="message">
              <InformationIcon /> {getName(requestInfo?.provider)} already provides{' '}
              {itemListAsText(existingServices || [])} services to {getName(requestInfo?.customer)}
            </p>
          )}
        </Form>
        <div className="party-names">
          {services.map((s, i) => (
            <div className="party-name" key={i}>
              <p>
                {s.contract.payload.provider} provides {s.service} service to{' '}
                {s.contract.payload.customer}{' '}
              </p>
            </div>
          ))}
        </div>
      </div>
      {requestInfo && requestInfo.customer && token && (
        <DamlLedger
          token={token}
          party={requestInfo.customer}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <Modal open={showAccountModal}>
            {' '}
            <Modal.Content>Test</Modal.Content>
            <Button
              className="ghost warning"
              color="black"
              onClick={() => {
                const { services: requestServices } = requestInfo;
                if (!!requestServices) {
                  setRequestInfo({
                    ...requestInfo,
                    services: requestServices.filter(s => s !== ServiceKind.CLEARING),
                  });
                }
                setShowAccountModal(false);
              }}
            >
              Cancel
            </Button>
          </Modal>
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
            onFinish={modalSetFunction}
          />
          <TradingSelectionModal
            open={showTradingAccountModal}
            requestInfo={requestInfo}
            setRequestInfo={setRequestInfo}
            setOpen={setShowTradingAccountModal}
            party={requestInfo.customer}
            accountsForParty={accountsForParty}
          />
          <NewAccount party={requestInfo.customer} modal />
        </DamlLedger>
      )}
    </QuickSetupPage>
  );
};

const CreateServiceRequests = (props: {
  requestInfo: IRequestServiceInfo;
  onFinish: (success: boolean) => void;
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
    let success = true;

    if (services && provider && customer && services.length > 0) {
      await Promise.all(
        services.map(async service => {
          switch (service) {
            case ServiceKind.MARKET_CLEARING:
              await doRequest(MarketClearingRequest, params).catch(_ => (success = false));
              break;
            case ServiceKind.LISTING:
              await doRequest(ListingRequest, params).catch(_ => (success = false));
              break;
            case ServiceKind.CUSTODY:
              await doRequest(CustodyRequest, params).catch(_ => (success = false));
              break;
            case ServiceKind.ISSUANCE:
              await doRequest(IssuanceRequest, params).catch(_ => (success = false));
              break;
            case ServiceKind.CLEARING:
              const clearingAccounts = requestInfo?.accounts?.clearing;
              if (
                !clearingAccounts ||
                !clearingAccounts?.clearingAccount ||
                !clearingAccounts?.marginAccount
              ) {
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
              const tradingAccounts = requestInfo?.accounts?.trading;
              if (
                !tradingAccounts ||
                !tradingAccounts?.tradingAccount ||
                !tradingAccounts?.allocationAccount
              ) {
                return;
              }
              const tradingParams = {
                ...params,
                tradingAccount: tradingAccounts.tradingAccount,
                allocationAccount: tradingAccounts.allocationAccount,
              };
              await ledger.create(TradingRequest, tradingParams);
              break;
            case ServiceKind.BIDDING:
              const biddingAccounts = requestInfo?.accounts?.bidding;
              if (
                !biddingAccounts ||
                !biddingAccounts?.tradingAccount ||
                !biddingAccounts?.allocationAccount
              ) {
                return;
              }
              const biddingParams = {
                ...params,
                tradingAccount: biddingAccounts.tradingAccount,
                allocationAccount: biddingAccounts.allocationAccount,
              };
              await ledger.create(BiddingRequest, biddingParams);
              break;

            case ServiceKind.AUCTION:
              const accounts = requestInfo?.accounts?.auction;
              if (
                !accounts ||
                !accounts?.tradingAccount ||
                !accounts?.allocationAccount ||
                !accounts?.receivableAccount
              ) {
                return;
              }
              const auctionParams = {
                ...params,
                tradingAccount: accounts.tradingAccount,
                allocationAccount: accounts.allocationAccount,
                receivableAccount: accounts.receivableAccount,
              };
              await ledger.create(AuctionRequest, auctionParams);
              break;
            default:
              success = false;
              throw new Error(`Unsupported service: ${service}`);
          }
        })
      );
    }
    onFinish(success);
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
