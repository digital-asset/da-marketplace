import React, { useEffect, useState } from 'react';
import { Label } from 'semantic-ui-react';

import { useParty } from '@daml/react';
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
import { getName } from '../../config';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { NavLink } from 'react-router-dom';
import ServiceRequestDialog from '../../components/InputDialog/ServiceRequestDialog';

import { Request as CustodyRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/module';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service/module';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service/module';
import { Request as TradingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service/module';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { Template } from '@daml/types';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';

function hashUserName(name: string): number {
  // Hash a user name to map to values in the range [1, 4], to determine profile pic color
  return (name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4) + 1;
}

interface RelationshipProps {
  provider: string;
  services: ServiceKind[];
}

const Relationship: React.FC<RelationshipProps> = ({ provider, services }) => (
  <Tile className="relationship-tile">
    <div className={`child profile-pic bg-color-${hashUserName(provider)}`}>
      {getAbbreviation(provider)}
    </div>
    <div className="child provider">{getName(provider)}</div>
    <div className="child">
      {services.map(s => (
        <Label key={s} content={s} />
      ))}
    </div>
  </Tile>
);

interface RequestInterface {
  customer: string;
  provider: string;
  tradingAccount?: Account;
  allocationAccount?: Account;
}

const Landing = () => {
  const party = useParty();
  const providers = useProviderServices(party);

  const identities = useStreamQueries(VerifiedIdentity).contracts;
  const legalNames = identities.map(c => c.payload.legalName);

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

    if (dialogState?.tradingAccount && dialogState?.allocationAccount) {
      const tradingAccount = accounts.find(a => a.id.label === dialogState.tradingAccount);
      const allocationAccount = accounts.find(a => a.id.label === dialogState.allocationAccount);

      const params = {
        provider,
        tradingAccount,
        allocationAccount,
        customer: party,
      };

      setRequestParams(params);
    } else {
      setRequestParams({
        provider,
        customer: party,
      });
    }
  }, [dialogState]);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const portfolio = formatter.format(
    deposits
      .filter(d => d.payload.asset.id.label === 'USD')
      .reduce((sum, deposit) => sum + +deposit.payload.asset.quantity, 0)
  );

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

  return (
    <div className="landing">
      <div className="col col-1">
        <ServiceRequestDialog
          open={openDialog}
          service={serviceKind}
          fields={fields}
          params={requestParams}
          request={request}
          onChange={state => setDialogState(state)}
          onClose={open => setOpenDialog(open)}
        />

        <Tile>
          <div className="profile">
            <div className="profile-name">@{getName(party)}</div>
          </div>
        </Tile>

        <Tile>
          <div className="link-tile">
            <div>
              <h3>Portfolio</h3>
              <span className="balance">
                <h3>{portfolio}</h3>
              </span>
              <span>USD</span>
            </div>
            <div className="link">
              <NavLink to="/app/custody/assets">View Wallet</NavLink>
            </div>
          </div>
        </Tile>
      </div>

      <div className="col col-2">
        <div>
          <h2 className="header">Network</h2>
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
              label="Request Trading Service"
              onClick={() =>
                requestService(TradingRequest, ServiceKind.TRADING, {
                  tradingAccount: {
                    label: 'Trading Account',
                    type: 'selection',
                    items: accountNames,
                  },
                  allocationAccount: {
                    label: 'Allocation Account',
                    type: 'selection',
                    items: accountNames,
                  },
                })
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
