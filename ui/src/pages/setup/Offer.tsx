import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { useParty } from '@daml/react';

import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { Offer as MarketClearingOffer } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service';
import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import { Role as CustodyRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Offer as CustodyOffer } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Offer as IssuanceOffer } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Offer as ListingOffer } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Role as TradingRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Offer as TradingOffer } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';

import { ServiceOfferDialog } from '../../components/InputDialog/ServiceDialog';
import { useVerifiedParties } from '../../config';
import { ServiceKind, ServiceOffer, ServiceRoleOfferChoice } from '../../context/ServicesContext';
import { useOperatorParty } from '../common';

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
  const operator = useOperatorParty();

  const { identities, legalNames } = useVerifiedParties();

  const [offer, setOffer] = useState<ServiceOffer>(CustodyOffer);
  const [choice, setChoice] = useState<ServiceRoleOfferChoice>();
  const [openDialog, setOpenDialog] = useState(true);
  const [dialogState, setDialogState] = useState<any>({});
  const [params, setParams] = useState<RequestInterface>({
    provider,
    operator: '',
    customer: '',
  });

  useEffect(() => {
    switch (service) {
      case ServiceKind.CUSTODY: {
        setOffer(CustodyOffer);
        setChoice(CustodyRole.OfferCustodyService);
        break;
      }
      case ServiceKind.MARKET_CLEARING: {
        setOffer(MarketClearingOffer);
        setChoice(ClearingRole.OfferMarketService);
        break;
      }
      case ServiceKind.ISSUANCE: {
        setOffer(IssuanceOffer);
        setChoice(CustodyRole.OfferIssuanceService);
        break;
      }
      case ServiceKind.TRADING: {
        setOffer(TradingOffer);
        setChoice(TradingRole.OfferTradingService);
        break;
      }
      case ServiceKind.LISTING: {
        setOffer(ListingOffer);
        setChoice(TradingRole.OfferListingService);
        break;
      }
      case ServiceKind.CLEARING: {
        setOffer(CustodyOffer);
        setChoice(ClearingRole.OfferClearingService);
        break;
      }
      default:
        throw new Error('ServiceKind does not have an offer');
    }
  }, [service, legalNames]);

  useEffect(() => {
    const customer =
      identities.find(i => i.payload.legalName === dialogState?.customer)?.payload.customer || '';

    if (dialogState?.tradingAccount && dialogState?.allocationAccount) {
      operator &&
        setParams({
          provider,
          customer,
          operator,
          tradingAccount: dialogState.tradingAccount,
          allocationAccount: dialogState.allocationAccount,
        });
    } else {
      operator &&
        setParams({
          provider,
          customer,
          operator,
        });
    }
  }, [dialogState, identities, operator, provider]);

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
    </div>
  );
};

export default Offer;
