import React, { useEffect, useState } from 'react';
import { Button, Header } from 'semantic-ui-react';

import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';

import {
  ServiceKind,
  ServiceRequest,
  ServiceRequestTemplates,
  useProviderServices,
} from '../../context/ServicesContext';
import Tile from '../../components/Tile/Tile';
import OverflowMenu, { OverflowMenuEntry } from '../page/OverflowMenu';
import { getAbbreviation } from '../page/utils';
import { usePartyName, useVerifiedParties } from '../../config';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { Link, NavLink } from 'react-router-dom';
import { ServiceRequestDialog } from '../../components/InputDialog/ServiceDialog';

import { Request as CustodyRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Request as MarketClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service/module';
import { Request as ClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Request as TradingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import { Request as AuctionRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import { Request as BiddingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import {
  Request as RegulatorRequest,
  Service as RegulatorService,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service/';
import { Template, Party } from '@daml/types';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { useWellKnownParties } from '@daml/hub-react/lib';
import { formatCurrency } from '../../util';
import { Fields, Field, FieldCallbacks, FieldCallback } from '../../components/InputDialog/Fields';
import _ from 'lodash';

type DamlHubParty = string;
function isDamlHubParty(party: string): party is DamlHubParty {
  return party.includes('ledger-party-');
}

const RenderDamlHubParty: React.FC<{ party: string }> = ({ party }) => {
  return (
    <p className="daml-hub-party">
      <input readOnly className="id-text" value={party} />
    </p>
  );
};

function hashPartyId(party: string): number {
  // Hash a party to map to values in the range [1, 4], to determine profile pic color
  return (party.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4) + 1;
}

function getProfileAbbr(party: string): string {
  if (isDamlHubParty(party)) {
    // First 3 chars of a Daml Hub ledger party UUID string
    return party.split('-').slice(2).join('').slice(0, 3);
  } else {
    return getAbbreviation(party);
  }
}

interface RelationshipProps {
  provider: string;
  services: ServiceKind[];
}

const Relationship: React.FC<RelationshipProps> = ({ provider, services }) => {
  const { name } = usePartyName(provider);

  return (
    <Tile className="relationship-tile">
      <div className={`child profile-pic bg-color-${hashPartyId(provider)}`}>
        {getProfileAbbr(name)}
      </div>
      <div className="child provider">{name}</div>
      <div className="child">
        {services.map(s => (
          <p className="p2 label" key={s}>
            {s}
          </p>
        ))}
      </div>
    </Tile>
  );
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

const ProfileSection: React.FC<{ name: string }> = ({ name }) => {
  const customer = useParty();
  const ledger = useLedger();
  const { parties, loading: operatorLoading } = useWellKnownParties();
  const provider = parties?.userAdminParty || 'Operator';

  const { contracts: regulatorServices, loading: regulatorLoading } =
    useStreamQueries(RegulatorService);

  const requestContract = useStreamQueries(RegulatorRequest).contracts.find(
    r => r.payload.customer === customer
  );

  const regulatorCustomer = regulatorServices.find(r => r.payload.customer === customer);

  const { contracts: identities, loading: identitiesLoading } = useStreamQueries(VerifiedIdentity);
  const partyIdentity = identities.find(id => id.payload.customer === customer);

  const damlHubParty =
    isDamlHubParty(customer) && name !== customer ? (
      <RenderDamlHubParty party={customer} />
    ) : undefined;

  if (requestContract) {
    return (
      <div>
        {damlHubParty}
        <p>Regulator Request pending...</p>
      </div>
    );
  } else if (!regulatorCustomer && !regulatorLoading && !operatorLoading) {
    return (
      <div className="link">
        {damlHubParty}
        <Button
          className="ghost"
          onClick={() => {
            if (!operatorLoading) {
              ledger.create(RegulatorRequest, { customer, provider });
            }
          }}
        >
          Request Regulator Service
        </Button>
      </div>
    );
  } else if (!partyIdentity && !identitiesLoading && !regulatorLoading) {
    return (
      <div className="link">
        {damlHubParty}
        <Link to="/app/setup/identity">Request Identity Verification</Link>
      </div>
    );
  } else if (partyIdentity) {
    return (
      <>
        {damlHubParty}
        <p>{partyIdentity.payload.location}</p>
      </>
    );
  }

  return <></>;
};

const Landing = () => {
  const party = useParty();
  const { name } = usePartyName(party);
  const providers = useProviderServices(party);

  const { identities, legalNames } = useVerifiedParties();

  const allocationAccountRules = useStreamQueries(AllocationAccountRule).contracts;
  const allocationAccounts = allocationAccountRules
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);

  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = assetSettlementRules
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);

  const deposits = useStreamQueries(AssetDeposit).contracts;

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

  const portfolio = formatCurrency(
    deposits
      .filter(d => d.payload.asset.id.label === 'USD')
      .reduce((sum, deposit) => sum + +deposit.payload.asset.quantity, 0)
  );

  useEffect(() => {
    const provider =
      identities.find(i => i.payload.legalName === dialogState?.provider)?.payload.customer || '';

    const filteredFields: Fields = _.mapValues(fieldsFromProvider, createFieldFn =>
      createFieldFn(provider)
    );
    setFields({
      ...fields,
      ...filteredFields,
    });
  }, [dialogState]);

  const requestService = <T extends ServiceRequestTemplates>(
    service: Template<T, undefined, string>,
    kind: ServiceKind,
    extraFields?: Fields,
    fieldsFromProvider?: FieldCallbacks<Party>
  ) => {
    setFieldsFromProvider(fieldsFromProvider || {});
    setFields({
      provider: {
        label: 'Provider',
        type: 'selection',
        items: legalNames,
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
  }, [dialogState]);

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
        items: assetSettlementRules
          .filter(
            ar => ar.payload.observers.map.has(provider) || ar.payload.account.provider == provider
          )
          .map(ar => ar.payload.account.id.label),
      };
    };
  const makeAllocationAccountFilterField =
    (label: string): FieldCallback<Party> =>
    provider => {
      return {
        label,
        type: 'selection',
        items: allocationAccountRules
          .filter(ar => ar.payload.nominee == provider)
          .map(ar => ar.payload.account.id.label),
      };
    };

  return (
    <div className="landing">
      <div className="col col-1">
        <Tile>
          <div className="profile">
            <div className="profile-name">@{name}</div>
            <ProfileSection name={name} />
          </div>
        </Tile>

        <Tile>
          <div className="link-tile">
            <div>
              <Header as="h2">Portfolio</Header>
              <span className="balance">
                <h3>{portfolio}</h3>&nbsp;<span>USD</span>
              </span>
            </div>
            <div className="link">
              <NavLink to="/app/custody/assets">View Wallet</NavLink>
            </div>
          </div>
        </Tile>
      </div>

      <div className="col col-2">
        <div>
          <Header as="h2" className="header">
            Network
          </Header>
          <OverflowMenu>
            <OverflowMenuEntry
              label="Request Custody Service"
              onClick={() => requestService(CustodyRequest, ServiceKind.CUSTODY)}
            />
            <OverflowMenuEntry
              label="Request Issuance Service"
              onClick={() => requestService(IssuanceRequest, ServiceKind.ISSUANCE)}
            />
            <OverflowMenuEntry
              label="Request Listing Service"
              onClick={() => requestService(ListingRequest, ServiceKind.LISTING)}
            />
            <OverflowMenuEntry
              label="Request Market Clearing Service"
              onClick={() => requestService(MarketClearingRequest, ServiceKind.MARKET_CLEARING)}
            />
            <OverflowMenuEntry
              label="Request Clearing Service"
              onClick={() =>
                requestService(
                  ClearingRequest,
                  ServiceKind.CLEARING,
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
        </div>
        <div className="relationships">
          {providers.map(p => (
            <Relationship key={p.provider} provider={p.provider} services={p.services} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
