import React, {useState} from "react";
import {useParty, useStreamQueries} from "@daml/react";
import _ from "lodash";
import { Service as CustodyService } from "@daml.js/da-marketplace/lib/Marketplace/Custody/Service/module";
import { Service as AuctionService } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service/module";
import { Service as BiddingService } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service/module";
import { Service as IssuanceService } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/Service/module";
import { Service as ListingService } from "@daml.js/da-marketplace/lib/Marketplace/Listing/Service/module";
import { Service as TradingService } from "@daml.js/da-marketplace/lib/Marketplace/Trading/Service/module";
import {useLayoutState} from "../../context/LayoutContext";


type Props = {

};

const Sidebar : React.FC<Props> = ({ }) => {
  const party = useParty();
  const { isSidebarOpened } = useLayoutState();

  const defaultQueryFactory = () => [{ customer : party }]
  const custodyService = useStreamQueries(CustodyService, defaultQueryFactory);
  const auctionService = useStreamQueries(AuctionService, defaultQueryFactory);
  const biddingService = useStreamQueries(BiddingService, defaultQueryFactory);
  const issuanceService = useStreamQueries(IssuanceService, defaultQueryFactory);
  const listingService = useStreamQueries(ListingService, defaultQueryFactory);
  const tradingService = useStreamQueries(TradingService, defaultQueryFactory);

  return (
    <Si
  );
}