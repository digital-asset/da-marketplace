import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import { useStreamQueries } from "@daml/react";
import { getName } from "../../../config";
import { Auction as BiddingAuctionContract } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model";
import { Bid } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model";
import { getBidStatus, getBidAllocation } from "../Utils";
import { KeyboardArrowRight } from "@material-ui/icons";
import StripedTable from "../../../components/Table/StripedTable";
import Tile from "../../../components/Tile/Tile";

const BiddingAuctionsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const biddingAuctions = useStreamQueries(BiddingAuctionContract).contracts;
  const bids = useStreamQueries(Bid).contracts;

  return (
    <div className='bidding'>
      <Tile header={<h2>Auctions</h2>}>
        <StripedTable
          headings={[
            'Auction ID',
            'Agent',
            'Issuer',
            'Asset',
            'Quantity',
            'Details'
          ]}
          rows={
            biddingAuctions.map(c => [
              c.payload.auctionId,
              getName(c.payload.provider),
              getName(c.payload.issuer),
              c.payload.asset.id.label,
              c.payload.asset.quantity,
              <IconButton color="primary" size="small" component="span" onClick={() => history.push("/app/distribution/bidding/" + c.contractId.replace("#", "_"))}>
                <KeyboardArrowRight fontSize="small" />
              </IconButton>
            ])
          }
        />
      </Tile>
      <Tile header={<h2>Bids</h2>}>
        <StripedTable
          headings={[
            'Auction ID',
            'Agent',
            'Issuer',
            'Asset',
            'Quantity',
            'Price',
            'Status',
            'Allocation'
          ]}
          rows={
            bids.map(c => [
              c.payload.auctionId,
              getName(c.payload.provider),
              getName(c.payload.issuer),
              c.payload.assetId.label,
              c.payload.details.quantity,
              c.payload.details.price,
              getBidStatus(c.payload.status),
              getBidAllocation(c.payload),
            ])
          }
        />
      </Tile>
    </div>
  );
};

export const BiddingAuctions = withRouter(BiddingAuctionsComponent);