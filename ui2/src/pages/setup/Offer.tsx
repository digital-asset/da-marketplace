import React, { useEffect, useMemo, useState } from 'react';

import { useParty } from '@daml/react';
import { useStreamQueries } from '@daml/react';

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { Offer as ClearingOffer } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { Offer as MarketClearingOffer } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service';
import { Offer as CustodyOffer } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Offer as TradingOffer } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import { Offer as IssuanceOffer } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Offer as ListingOffer } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';

import { Role as TradingRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Role as CustodyRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';

import { ServiceOfferDialog } from '../../components/InputDialog/ServiceDialog';
import { ServiceKind, ServiceOffer, ServiceRoleOfferChoice } from '../../context/ServicesContext';
import { useHistory } from 'react-router';
import { useWellKnownParties } from '@daml/hub-react/lib';
import SetUp from './SetUp';

interface RequestInterface {
  operator: string;
  customer: string;
  provider: string;
  tradingAccount?: Account;
  allocationAccount?: Account;
}

const Offer: React.FC<{ service: ServiceKind }> = ({ service }) => {
  const provider = useParty();
  const history = useHistory();
  const operator = useWellKnownParties().parties?.userAdminParty || 'Operator';

  const identities = useStreamQueries(VerifiedIdentity);
  const legalNames = useMemo(() => identities.contracts.map(c => c.payload.legalName), [
    identities,
  ]);

  const [offer, setOffer] = useState<ServiceOffer>(CustodyOffer);
  const [choice, setChoice] = useState<ServiceRoleOfferChoice>();
  const [openDialog, setOpenDialog] = useState(true);
  const [dialogState, setDialogState] = useState<any>({});
  const [params, setParams] = useState<RequestInterface>({
    operator,
    provider,
    customer: '',
  });

  useEffect(() => {
    switch (service) {
      case ServiceKind.CUSTODY: {
        setOffer(CustodyOffer);
        setChoice(CustodyRole.OfferCustodyService);
      }
      case ServiceKind.MARKET_CLEARING: {
        setOffer(MarketClearingOffer);
        setChoice(ClearingRole.OfferMarketService);
        return;
      }
      case ServiceKind.ISSUANCE: {
        setOffer(IssuanceOffer);
        setChoice(CustodyRole.OfferIssuanceService);
      }
      case ServiceKind.TRADING: {
        setOffer(TradingOffer);
        setChoice(TradingRole.OfferTradingService);
      }
      case ServiceKind.LISTING: {
        setOffer(ListingOffer);
        setChoice(TradingRole.OfferListingService);
      }
      case ServiceKind.CLEARING: {
        setOffer(CustodyOffer);
        setChoice(ClearingRole.OfferClearingService);
      }
    }
  }, [service, legalNames]);

  useEffect(() => {
    const customer =
      identities.contracts.find(i => i.payload.legalName === dialogState?.customer)?.payload
        .customer || '';

    if (dialogState?.tradingAccount && dialogState?.allocationAccount) {
      const params = { provider, customer, operator };
      setParams(params);
    } else {
      setParams({
        provider,
        customer,
        operator,
      });
    }
  }, [dialogState]);

  const onClose = (open: boolean) => {
    setOpenDialog(open);
    history.goBack();
  };

  return (
    <div className="offer">
      <ServiceOfferDialog
        choice={choice}
        fields={{
          customer: {
            label: 'Customer',
            type: 'selection',
            items: legalNames,
          },
        }}
        offer={offer}
        onChange={(state: any) => setDialogState(state)}
        onClose={onClose}
        open={openDialog}
        params={params}
        service={service}
      />
      <SetUp />
    </div>
  );
};

export default Offer;
