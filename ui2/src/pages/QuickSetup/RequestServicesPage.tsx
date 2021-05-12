import React, { useState } from 'react';

import { Button, Form } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';

import { ServiceKind } from '../../context/ServicesContext';

import { retrieveParties } from '../../Parties';

const RequestServicesPage = (props: { onComplete: () => void }) => {
  const { onComplete } = props;
  const [senderParty, setSenderParty] = useState<string>();
  const [recieverParty, setRecieverParty] = useState<string>();
  const [serviceKind, setServiceKind] = useState<ServiceKind>(ServiceKind.CUSTODY);
  //   const [request, setRequest] = useState<ServiceRequest>(CustodyRequest);

  const parties = retrieveParties() || [];

  const [fields, setFields] = useState<object>({});

  const partyOptions = parties.map(party => {
    return { text: party.partyName, value: party.party };
  });

  const serviceOptions = Object.values(ServiceKind)
    .filter(s => s !== ServiceKind.REGULATOR)
    .map(service => {
      return { text: service, value: service };
    });

  //   const requestService = <T extends ServiceRequestTemplates>(
  //     service: Template<T, undefined, string>,
  //     kind: ServiceKind,
  //     extraFields?: object
  //   ) => {
  //     setFields({
  //       provider: {
  //         label: 'Provider',
  //         type: 'selection',
  //         items: legalNames,
  //       },
  //       ...extraFields,
  //     });

  //     setRequest((service as unknown) as Template<ServiceRequestTemplates, undefined, string>);
  //     setServiceKind(kind);
  //     setOpenDialog(true);
  //   };

  return (
    <div className="setup-page request-services">
      <h4>Request Services</h4>
      {/* <Form.Select
        label={<p>Service</p>}
        value={serviceKind ? serviceOptions.find(p => serviceKind === p.value)?.value : ''}
        placeholder="Select..."
        onChange={(_, data: any) => setServiceKind(data.value)}
        options={serviceOptions}
      />
      <Form.Select
        label={<p>Send to:</p>}
        value={senderParty ? partyOptions.find(p => senderParty === p.value)?.value : ''}
        placeholder="Select..."
        onChange={(_, data: any) => setSenderParty(data.value)}
        options={partyOptions}
      />
      <Form.Select
        label={<p>From:</p>}
        value={recieverParty ? partyOptions.find(p => recieverParty === p.value)?.value : ''}
        placeholder="Select..."
        onChange={(_, data: any) => setRecieverParty(data.value)}
        options={partyOptions}
      />
      <Button className="ghost request" onClick={() => handleRequest()}>
        Request
      </Button>
      */}
      <Button className="ghost next" onClick={() => onComplete()}>
        Next
      </Button>
    </div>
  );
  //   function handleRequest() {
  //     switch (service) {
  //       case ServiceKind.CUSTODY:
  //         requestService(CustodyRequest, ServiceKind.CUSTODY);
  //       case ServiceKind.ISSUANCE:
  //         requestService(IssuanceRequest, ServiceKind.ISSUANCE);
  //       case ServiceKind.LISTING:
  //         requestService(ListingRequest, ServiceKind.LISTING);
  //       case ServiceKind.MARKET_CLEARING:
  //         requestService(MarketClearingRequest, ServiceKind.MARKET_CLEARING);
  //       case ServiceKind.CLEARING:
  //         requestService(ClearingRequest, ServiceKind.CLEARING, {
  //           clearingAccount: {
  //             label: 'Clearing Account',
  //             type: 'selection',
  //             items: accountNames,
  //           },
  //           marginAccount: {
  //             label: 'Margin Account',
  //             type: 'selection',
  //             items: allocationAccountNames,
  //           },
  //         });
  //       case ServiceKind.TRADING:
  //         requestService(TradingRequest, ServiceKind.TRADING, {
  //           tradingAccount: {
  //             label: 'Trading Account',
  //             type: 'selection',
  //             items: accountNames,
  //           },
  //           allocationAccount: {
  //             label: 'Allocation Account',
  //             type: 'selection',
  //             items: allocationAccountNames,
  //           },
  //         });
  //       case ServiceKind.AUCTION:
  //         requestService(AuctionRequest, ServiceKind.AUCTION, {
  //           tradingAccount: {
  //             label: 'Trading Account',
  //             type: 'selection',
  //             items: accountNames,
  //           },
  //           allocationAccount: {
  //             label: 'Allocation Account',
  //             type: 'selection',
  //             items: allocationAccountNames,
  //           },
  //           receivableAccount: {
  //             label: 'Receivable Account',
  //             type: 'selection',
  //             items: accountNames,
  //           },
  //         });

  //       case ServiceKind.BIDDING:
  //         requestService(BiddingRequest, ServiceKind.BIDDING, {
  //           tradingAccount: {
  //             label: 'Trading Account',
  //             type: 'selection',
  //             items: accountNames,
  //           },
  //           allocationAccount: {
  //             label: 'Allocation Account',
  //             type: 'selection',
  //             items: allocationAccountNames,
  //           },
  //         });
  //     }
  //   }
};

export default RequestServicesPage;
