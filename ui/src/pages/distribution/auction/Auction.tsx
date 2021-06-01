import React from 'react';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../../Main';
import { RouteComponentProps, useParams } from 'react-router-dom';
import {
  Auction as AuctionContract,
  Status as AuctionStatus,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model';
import { Service as AuctionService } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import { Service as BiddingService } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service';
import {
  Auction as BiddingAuction,
  Bid,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model';

import { CreateEvent } from '@daml/ledger';
import { getAuctionStatus, getBidAllocation, getBidStatus } from '../Utils';
import { DateTime } from 'luxon';
import { Button, Table } from 'semantic-ui-react';
import StripedTable from '../../../components/Table/StripedTable';
import { usePartyName } from '../../../config';
import Tile from '../../../components/Tile/Tile';
import BackButton from '../../../components/Common/BackButton';
import paths from '../../../paths';

type Props = {
  auctionServices: Readonly<CreateEvent<AuctionService, any, any>[]>;
  biddingServices: Readonly<CreateEvent<BiddingService, any, any>[]>;
};

export const Auction: React.FC<RouteComponentProps & Props> = ({
  history,
  auctionServices,
  biddingServices,
}: RouteComponentProps & Props) => {
  const { contractId } = useParams<any>();
  const cid = contractId.replace('_', '#');

  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const auctionProviderServices = auctionServices.filter(s => s.payload.provider === party);
  const isAuctionProvider = auctionProviderServices.length > 0;
  const biddingProviderServices = biddingServices.filter(s => s.payload.provider === party);
  const auctions = useStreamQueries(AuctionContract).contracts;
  const auction = auctions.find(c => c.contractId === cid);

  const allBiddingAuctions = useStreamQueries(BiddingAuction).contracts;
  const { contracts: allBids, loading: allBidsLoading } = useStreamQueries(Bid);

  if (!auction) return <></>; // TODO: Return 404 not found
  const auctionProviderService = auctionProviderServices[0];

  const biddingAuctions = allBiddingAuctions.filter(
    c => c.payload.auctionId === auction.payload.auctionId
  );
  const bids = allBids.filter(c => c.payload.auctionId === auction.payload.auctionId);
  const filledPerc =
    (100.0 *
      bids.reduce(
        (a, b) =>
          a +
          (parseFloat(b.payload.details.price) >= parseFloat(auction.payload.floorPrice)
            ? parseFloat(b.payload.details.quantity)
            : 0),
        0
      )) /
    parseFloat(auction.payload.asset.quantity);
  const currentPrice =
    bids.length === 0
      ? 0.0
      : bids.reduce(
          (a, b) =>
            parseFloat(b.payload.details.price) >= parseFloat(auction.payload.floorPrice) &&
            parseFloat(b.payload.details.price) < a
              ? parseFloat(b.payload.details.price)
              : a,
          Number.MAX_VALUE
        );

  const closeAuction = async () => {
    const bidCids = bids.map(c => c.contractId);
    const [result] = await ledger.exercise(
      AuctionService.ProcessAuction,
      auctionProviderService.contractId,
      { auctionCid: auction.contractId, bidCids }
    );
    history.push(paths.app.distribution.auctions + result._1.replace('#', '_'));
  };

  const requestBid = async (biddingService: CreateEvent<BiddingService>) => {
    const publishedBidCids = bids.filter(c => c.payload.allowPublishing).map(c => c.contractId);
    const issuer = auction.payload.customer;
    const auctionId = auction.payload.auctionId;
    const asset = auction.payload.asset;
    const quotedAssetId = auction.payload.quotedAssetId;
    await ledger.exercise(BiddingService.RequestBid, biddingService.contractId, {
      issuer,
      auctionId,
      asset,
      quotedAssetId,
      publishedBidCids,
    });
  };

  const getbiddingAuctionstatus = (investor: string) => {
    const biddingAuction = biddingAuctions.find(c => c.payload.customer === investor);
    if (biddingAuction) return 'Bid requested';
    const bid = bids.find(c => c.payload.customer === investor);
    if (!!bid) return 'Bid received';
    return 'No bid requested';
  };

  const getFinalPrice = (auctionStatus: AuctionStatus): string | undefined => {
    switch (auctionStatus.tag) {
      case 'PartiallyAllocated':
        return auctionStatus.value.finalPrice;
      case 'FullyAllocated':
        return auctionStatus.value.finalPrice;
      default:
        return undefined;
    }
  };

  const getParticallyAllocatedUnits = (auction: AuctionContract): number | undefined => {
    switch (auction.status.tag) {
      case 'PartiallyAllocated':
        return parseFloat(auction.asset.quantity) - parseFloat(auction.status.value.remaining);
      default:
        return undefined;
    }
  };

  return (
    <>
      <div>
        <BackButton />
      </div>
      <div className="auction">
        {isAuctionProvider && (
          <StripedTable
            title="Bids"
            headings={[
              'Bidder',
              'Quantity',
              'Price',
              'Percentage',
              'Submitted',
              'Visibility',
              'Status',
              'Allocation',
            ]}
            loading={allBidsLoading}
            rows={bids.map(c => {
              return {
                elements: [
                  getName(c.payload.customer),
                  c.payload.details.quantity,
                  c.payload.details.price,
                  (
                    (100.0 * parseFloat(c.payload.details.quantity)) /
                    parseFloat(auction.payload.asset.quantity)
                  ).toFixed(2) + '%',
                  DateTime.fromISO(c.payload.details.time).toLocaleString(DateTime.DATETIME_FULL),
                  c.payload.allowPublishing ? 'Public' : 'Private',
                  getBidStatus(c.payload.status),
                  getBidAllocation(c.payload),
                ],
              };
            })}
          />
        )}
        <div className="details">
          <Tile header="Details">
            <Table basic="very">
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <b>Issuer</b>
                  </Table.Cell>
                  <Table.Cell>{getName(auction.payload.customer)}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <b>Agent</b>
                  </Table.Cell>
                  <Table.Cell>{getName(auction.payload.provider)}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <b>Auction ID</b>
                  </Table.Cell>
                  <Table.Cell>{auction.payload.auctionId}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <b>Asset</b>
                  </Table.Cell>
                  <Table.Cell>
                    {auction.payload.asset.quantity} {auction.payload.asset.id.label}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <b>Floor</b>
                  </Table.Cell>
                  <Table.Cell>
                    {auction.payload.floorPrice} {auction.payload.quotedAssetId.label}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <b>Subscribed %</b>
                  </Table.Cell>
                  <Table.Cell>{filledPerc.toFixed(2)}%</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <b>Status</b>
                  </Table.Cell>
                  <Table.Cell>{getAuctionStatus(auction.payload.status)}</Table.Cell>
                </Table.Row>
                {isAuctionProvider && (
                  <>
                    {getFinalPrice(auction.payload.status) ? (
                      <Table.Row>
                        <Table.Cell>
                          <b>Final price</b>
                        </Table.Cell>
                        <Table.Cell>
                          {getFinalPrice(auction.payload.status)}{' '}
                          {auction.payload.quotedAssetId.label}
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      <Table.Row>
                        <Table.Cell>
                          <b>Current price</b>
                        </Table.Cell>
                        <Table.Cell>
                          {currentPrice.toFixed(2)} {auction.payload.quotedAssetId.label}
                        </Table.Cell>
                      </Table.Row>
                    )}
                    {getParticallyAllocatedUnits(auction.payload) && (
                      <Table.Row>
                        <Table.Cell>
                          <b>Allocated</b>
                        </Table.Cell>
                        <Table.Cell>
                          {getParticallyAllocatedUnits(auction.payload)?.toFixed(2)}{' '}
                          {auction.payload.asset.id.label}
                        </Table.Cell>
                      </Table.Row>
                    )}
                    <Button
                      type="submit"
                      className="ghost details-button"
                      disabled={auction.payload.status.tag !== 'Open' || bids.length === 0}
                      onClick={closeAuction}
                    >
                      Close Auction
                    </Button>
                  </>
                )}
              </Table.Body>
            </Table>
          </Tile>
          {isAuctionProvider && (
            <StripedTable
              title="Investors"
              headings={['Investor', 'Status', 'Action']}
              rows={biddingProviderServices
                .filter(c => c.payload.customer !== auction.payload.customer)
                .map(c => {
                  return {
                    elements: [
                      getName(c.payload.customer),
                      getbiddingAuctionstatus(c.payload.customer),
                      isAuctionProvider && (
                        <Button
                          floated="right"
                          type="submit"
                          className="ghost"
                          disabled={
                            getbiddingAuctionstatus(c.payload.customer) !== 'No bid requested' ||
                            auction.payload.status.tag !== 'Open'
                          }
                          onClick={() => requestBid(c)}
                        >
                          Request Bid
                        </Button>
                      ),
                    ],
                  };
                })}
            />
          )}
        </div>
      </div>
    </>
  );
};
