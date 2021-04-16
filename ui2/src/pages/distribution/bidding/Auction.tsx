import React, { useEffect, useRef, useState } from 'react';
import {
  Auction as BiddingAuctionContract,
  Bid,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model';
import { useLedger } from '@daml/react';
import { useStreamQueries } from '../../../Main';
import { useParams } from 'react-router-dom';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { CreateEvent } from '@daml/ledger';
import { ContractId } from '@daml/types';
import {
  Service,
  SubmitBid,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service';
import { transformClaim } from '../../../components/Claims/util';
import { render } from '../../../components/Claims/render';
import { getBidAllocation, getBidStatus } from '../Utils';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { Button, Form, Header, Icon, Table } from 'semantic-ui-react';
import { ServicePageProps } from '../../common';
import StripedTable from '../../../components/Table/StripedTable';
import { getName } from '../../../config';
import Tile from '../../../components/Tile/Tile';
import FormErrorHandled from '../../../components/Form/FormErrorHandled';

export const BiddingAuction: React.FC<ServicePageProps<Service>> = ({
  services,
}: ServicePageProps<Service>) => {
  const ledger = useLedger();
  const { contractId } = useParams<any>();

  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [allowPublishing, setAllowPublishing] = useState<boolean>(false);

  const { contracts: allBiddingAuctions, loading: allBiddingAuctionsLoading } = useStreamQueries(
    BiddingAuctionContract
  );
  const deposits = useStreamQueries(AssetDeposit).contracts;
  const bids = useStreamQueries(Bid);

  const biddingAuction = allBiddingAuctions.find(b => b.contractId === contractId);

  // TODO : We should refactor the claims into their own component
  const el1 = useRef<HTMLDivElement>(null);
  const el2 = useRef<HTMLDivElement>(null);
  const [showAuctionedAsset, setShowAuctionedAsset] = useState<boolean>(true);
  const [showQuotedAsset, setShowQuotedAsset] = useState<boolean>(false);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(c => c.payload.assetId.version === '0');

  useEffect(() => {
    if (!el1.current || !biddingAuction) return;
    el1.current.innerHTML = '';
    const auctionedAsset = assets.find(
      c => c.payload.assetId.label === biddingAuction.payload.asset.id.label
    );
    if (!auctionedAsset) return;
    const data = transformClaim(auctionedAsset.payload.claims, 'root');
    render(el1.current, data);
  }, [el1, assets, biddingAuction, showAuctionedAsset]);

  useEffect(() => {
    if (!el2.current || !biddingAuction) return;
    el2.current.innerHTML = '';
    const quotedAsset = assets.find(
      c => c.payload.assetId.label === biddingAuction.payload.quotedAssetId.label
    );
    if (!quotedAsset) return;
    const data = transformClaim(quotedAsset.payload.claims, 'root');
    render(el2.current, data);
  }, [el2, assets, biddingAuction, showQuotedAsset]);

  if (!biddingAuction || services.length === 0) return <></>;
  const service = services[0];

  const bid = bids.contracts.find(b => b.payload.auctionId === biddingAuction.payload.auctionId);

  const rightsizeAsset = async (
    deposit: CreateEvent<AssetDeposit>,
    quantity: string
  ): Promise<ContractId<AssetDeposit>> => {
    if (parseFloat(deposit.payload.asset.quantity) > parseFloat(quantity)) {
      const [[splitDepositCid]] = await ledger.exercise(
        AssetDeposit.AssetDeposit_Split,
        deposit.contractId,
        { quantities: [quantity] }
      );
      return splitDepositCid;
    }
    return deposit.contractId;
  };

  const submitBid = async () => {
    const volume = price * quantity;
    const deposit = deposits.find(
      c =>
        c.payload.asset.id.label === biddingAuction.payload.quotedAssetId.label &&
        parseFloat(c.payload.asset.quantity) >= volume
    );
    if (!deposit) return;
    const depositCid = await rightsizeAsset(deposit, volume.toString());
    const arg: SubmitBid = {
      auctionCid: biddingAuction.contractId,
      price: price.toString(),
      quantity: quantity.toString(),
      depositCid,
      allowPublishing,
    };
    await ledger.exercise(Service.SubmitBid, service.contractId, arg);
  };

  return (
    <div className="auction">
      <Header as="h2" className="header">
        Auction - {biddingAuction.payload.asset.id.label}
      </Header>
      <div className="bidding">
        <div className="bidding-details">
          <Tile header={<h4>Auction Details</h4>}>
            <Table basic="very">
              <Table.Body>
                <Table.Row key={0}>
                  <Table.Cell key={0}>
                    <b>Issuer</b>
                  </Table.Cell>
                  <Table.Cell key={1}>{getName(biddingAuction.payload.issuer)}</Table.Cell>
                </Table.Row>
                <Table.Row key={1}>
                  <Table.Cell key={0}>
                    <b>Agent</b>
                  </Table.Cell>
                  <Table.Cell key={1}>{getName(biddingAuction.payload.provider)}</Table.Cell>
                </Table.Row>
                <Table.Row key={2}>
                  <Table.Cell key={0}>
                    <b>Auction ID</b>
                  </Table.Cell>
                  <Table.Cell key={1}>{biddingAuction.payload.auctionId}</Table.Cell>
                </Table.Row>
                <Table.Row key={3}>
                  <Table.Cell key={0}>
                    <b>Asset</b>
                  </Table.Cell>
                  <Table.Cell key={1}>
                    <div className="asset-details">
                      <div className="text">{biddingAuction.payload.asset.id.label}</div>
                      <div className="icon">
                        {showAuctionedAsset ? (
                          <Icon
                            name="eye slash"
                            link
                            onClick={() => setShowAuctionedAsset(false)}
                          />
                        ) : (
                          <Icon name="eye" link onClick={() => setShowAuctionedAsset(true)} />
                        )}
                      </div>
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row key={4}>
                  <Table.Cell key={0}>
                    <b>Quantity</b>
                  </Table.Cell>
                  <Table.Cell key={1}>{biddingAuction.payload.asset.quantity}</Table.Cell>
                </Table.Row>
                <Table.Row key={5}>
                  <Table.Cell key={0}>
                    <b>Quoted Asset</b>
                  </Table.Cell>
                  <Table.Cell key={1}>
                    <div className="asset-details">
                      <div className="text">{biddingAuction.payload.quotedAssetId.label}</div>
                      <div className="icon">
                        {showQuotedAsset ? (
                          <Icon name="eye slash" link onClick={() => setShowQuotedAsset(false)} />
                        ) : (
                          <Icon name="eye" link onClick={() => setShowQuotedAsset(true)} />
                        )}
                      </div>
                    </div>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Tile>
          <Tile header={<h4>Published Bids</h4>}>
            <StripedTable
              headings={['Investor', 'Quantity', 'Allocation %']}
              loading={allBiddingAuctionsLoading}
              rows={biddingAuction.payload.publishedBids.map(c => {
                return {
                  elements: [
                    c.investor,
                    c.quantity,
                    (
                      (parseFloat(c.quantity) / parseFloat(biddingAuction.payload.asset.quantity)) *
                      100
                    ).toFixed(2),
                  ],
                };
              })}
            />
          </Tile>
          {!!bid && (
            <Tile header={<h4>Bid</h4>}>
              <Table basic="very">
                <Table.Body>
                  <Table.Row key={0}>
                    <Table.Cell key={0}>
                      <b>Quantity</b>
                    </Table.Cell>
                    <Table.Cell key={1}>{getName(bid.payload.details.quantity)}</Table.Cell>
                  </Table.Row>
                  <Table.Row key={1}>
                    <Table.Cell key={0}>
                      <b>Price</b>
                    </Table.Cell>
                    <Table.Cell key={1}>
                      {bid.payload.details.price} {bid.payload.quotedAssetId.label}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row key={2}>
                    <Table.Cell key={0}>
                      <b>Status</b>
                    </Table.Cell>
                    <Table.Cell key={1}>{getBidStatus(bid.payload.status)}</Table.Cell>
                  </Table.Row>
                  {getBidAllocation(bid.payload) && (
                    <Table.Row key={1}>
                      <Table.Cell key={0}>
                        <b>Allocation</b>
                      </Table.Cell>
                      <Table.Cell key={1}>{getBidAllocation(bid.payload)}</Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Tile>
          )}
          {!bid && (
            <Tile header={<h4>Submit Bid</h4>}>
              <FormErrorHandled onSubmit={() => submitBid()}>
                <Form.Input
                  label="Quantity"
                  placeholder={biddingAuction.payload.asset.id.label}
                  type="number"
                  required
                  focus
                  onChange={(_, change) => setQuantity(parseFloat(change.value as string))}
                />
                <Form.Input
                  label="Price"
                  placeholder={biddingAuction.payload.quotedAssetId.label}
                  type="number"
                  required
                  onChange={(_, change) => setPrice(parseFloat(change.value as string))}
                />
                <Form.Checkbox
                  label="Allow Publishing of Bid ?"
                  onChange={(_, value) => setAllowPublishing(value.checked as boolean)}
                />
                <Button
                  type="Bid"
                  className="ghost"
                  disabled={price === 0 || quantity === 0}
                  content="Submit"
                />
              </FormErrorHandled>
            </Tile>
          )}
        </div>
        <div className="asset">
          {showAuctionedAsset && (
            <Tile header={<h4>Auctioned Asset</h4>}>
              <div ref={el1} style={{ height: '100%' }} />
            </Tile>
          )}
          {showQuotedAsset && (
            <Tile header={<h4>Quoted Asset</h4>}>
              <div ref={el2} style={{ height: '100%' }} />
            </Tile>
          )}
        </div>
      </div>
    </div>
  );
};
