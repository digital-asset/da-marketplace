import React from "react";
import {useParty, useStreamQueries} from "@daml/react";
import {Service as CustodyService} from "@daml.js/da-marketplace/lib/Marketplace/Custody/Service/module";
import {Service as AuctionService} from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service/module";
import {Service as BiddingService} from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service/module";
import {Service as IssuanceService} from "@daml.js/da-marketplace/lib/Marketplace/Issuance/Service/module";
import {Service as ListingService} from "@daml.js/da-marketplace/lib/Marketplace/Listing/Service/module";
import {Service as TradingService} from "@daml.js/da-marketplace/lib/Marketplace/Trading/Service/module";
import {toggleSidebar, useLayoutDispatch, useLayoutState} from "../../context/LayoutContext";
import {Menu, Sidebar as SemanticSidebar, SidebarPushable, SidebarPusher} from "semantic-ui-react";
import useStyles from "./styles";

type Props = {};

export const Sidebar: React.FC<Props> = ({children}) => {
  const party = useParty();
  const classes = useStyles();
  const {isSidebarOpened} = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  const defaultQueryFactory = () => [{customer: party}]
  const custodyService = useStreamQueries(CustodyService, defaultQueryFactory);
  const auctionService = useStreamQueries(AuctionService, defaultQueryFactory);
  const biddingService = useStreamQueries(BiddingService, defaultQueryFactory);
  const issuanceService = useStreamQueries(IssuanceService, defaultQueryFactory);
  const listingService = useStreamQueries(ListingService, defaultQueryFactory);
  const tradingService = useStreamQueries(TradingService, defaultQueryFactory);

  return (
    <SidebarPushable>
      <SemanticSidebar
        as={Menu}
        animation='push'
        inverted
        onHide={() => toggleSidebar(layoutDispatch)}
        vertical
        visible={isSidebarOpened}
        width='thin'
        // labeled
        // icon
        // inline
      >
        {custodyService.contracts.length > 0 &&
        <Menu.Item as='a'>
            Custody
        </Menu.Item>
        }
        <Menu.Item as='a'>
          1
        </Menu.Item>
        <Menu.Item as='a'>
          2
        </Menu.Item>
        <Menu.Item as='a'>
          3
        </Menu.Item>
        <Menu.Item as='a'>
          4
        </Menu.Item>
        <Menu.Item as='a'>
          5
        </Menu.Item>
      </SemanticSidebar>
      <SidebarPusher>
        {children}
      </SidebarPusher>
    </SidebarPushable>
  );
}