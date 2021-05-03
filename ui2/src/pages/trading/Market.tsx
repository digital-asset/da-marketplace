import React, { useState } from 'react';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import {
  Listing,
  ClearedListingApproval,
} from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import {
  Details,
  Order,
  OrderType,
  Side,
  Status,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Model';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import { CreateEvent } from '@daml/ledger';
import { ContractId } from '@daml/types';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { ServicePageProps } from '../common';
import { Button, Form, Header, Label, Popup, Table } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { DateTime } from 'luxon';
import {
  displayStatus,
  getColor,
  getFillPercentage,
  getPrice,
  getQuantity,
  getRemainingQuantity,
  getRemainingVolume,
  getStatusReason,
  getTimeInForceText,
  getVolume,
  timeInForceOptions,
  TimeInForces,
} from './Utils';
import StripedTable from '../../components/Table/StripedTable';
import { useHistory } from 'react-router-dom';

type Props = {
  cid: string;
  listings: Readonly<CreateEvent<Listing, any, any>[]>;
};

export const Market: React.FC<ServicePageProps<Service> & Props> = ({
  services,
  cid,
  listings,
}: ServicePageProps<Service> & Props) => {
  const history = useHistory();

  const [isBuy, setIsBuy] = useState(true);
  const [isLimit, setIsLimit] = useState(true);
  const [price, setPrice] = useState(0.0);
  const [quantity, setQuantity] = useState(0.0);
  const [percentage, setPercentage] = useState(0.0);
  const [total, setTotal] = useState(0.0);

  const [timeInForce, setTimeInForce] = useState<TimeInForces>('GTC');
  const [expiryDate, setExpiryDate] = useState(0);

  const handlePriceChange = (p: number) => {
    const perc = isBuy
      ? quotedAssetsTotal === 0
        ? 0
        : (100 * quantity * p) / quotedAssetsTotal
      : tradedAssetsTotal === 0
      ? 0
      : (100 * quantity) / tradedAssetsTotal;
    setPrice(p);
    setTotal(quantity * p);
    setPercentage(Math.round(perc) || 0);
  };

  const handleQuantityChange = (q: number) => {
    const perc = isBuy
      ? quotedAssetsTotal === 0
        ? 0
        : (100 * q * price) / quotedAssetsTotal
      : tradedAssetsTotal === 0
      ? 0
      : (100 * q) / tradedAssetsTotal;
    setPercentage(Math.round(perc) || 0);
    setQuantity(q);
    isLimit && setTotal(q * price);
  };

  const handleTotalChange = (t: number) => {
    const perc = isBuy
      ? quotedAssetsTotal === 0
        ? 0
        : (100 * t) / quotedAssetsTotal
      : tradedAssetsTotal === 0 || price === 0
      ? 0
      : (100 * t) / price / tradedAssetsTotal;
    setQuantity(t / price);
    setTotal(t);
    setPercentage(Math.round(perc) || 0);
  };

  const handlePercentageChange = (perc: number) => {
    const q = isBuy
      ? price === 0
        ? 0
        : (perc * quotedAssetsTotal) / 100 / price
      : (perc * tradedAssetsTotal) / 100;
    setQuantity(q);
    setPercentage(Math.round(perc) || 0);
    isLimit && setTotal(q * price);
  };

  const handleLimitChange = (l: boolean) => {
    setIsLimit(l);
    timeInForceOptions(l).find(t => t.value === timeInForce) ?? setTimeInForce('IOC');
  };

  const party = useParty();
  const ledger = useLedger();
  const clientServices = services.filter(s => s.payload.customer === party);
  const listing = listings.find(c => c.contractId === cid);

  const assets = useStreamQueries(AssetDeposit).contracts;
  const allOrders = useStreamQueries(Order);

  if (!listing || clientServices.length === 0) return <></>; // TODO: Return 404 not found
  const service = clientServices[0];

  const orders = allOrders.contracts.filter(
    o => o.payload.details.symbol === listing.payload.listingId
  );
  const limits = orders.filter(c => c.payload.details.orderType.tag === 'Limit');
  const isPendingLimitOrder = (status: Status) =>
    ['New', 'PendingExecution', 'PartiallyExecuted'].includes(status.tag);
  const bids = limits
    .filter(c => c.payload.details.side === Side.Buy)
    .filter(c => isPendingLimitOrder(c.payload.status))
    .sort(
      (a, b) =>
        parseFloat((b.payload.details.orderType.value as OrderType.Limit).price) -
        parseFloat((a.payload.details.orderType.value as OrderType.Limit).price)
    );
  const asks = limits
    .filter(c => c.payload.details.side === Side.Sell)
    .filter(c => isPendingLimitOrder(c.payload.status))
    .sort(
      (a, b) =>
        parseFloat((b.payload.details.orderType.value as OrderType.Limit).price) -
        parseFloat((a.payload.details.orderType.value as OrderType.Limit).price)
    );

  const available = assets.filter(
    c => c.payload.account.id.label === service.payload.tradingAccount.id.label
  );
  const tradedAssets = available.filter(
    c => c.payload.asset.id.label === listing.payload.tradedAssetId.label
  );
  const quotedAssets = available.filter(
    c => c.payload.asset.id.label === listing.payload.quotedAssetId.label
  );
  const tradedAssetsTotal = tradedAssets.reduce(
    (acc, c) => acc + parseFloat(c.payload.asset.quantity),
    0
  );
  const quotedAssetsTotal = quotedAssets.reduce(
    (acc, c) => acc + parseFloat(c.payload.asset.quantity),
    0
  );

  const clearOrderForm = (): void => {
    setPrice(0.0);
    setQuantity(0.0);
    setPercentage(0.0);
    setTotal(0.0);
    setExpiryDate(0);
  };

  const getAsset = async (
    deposits: CreateEvent<AssetDeposit>[],
    quantity: number
  ): Promise<ContractId<AssetDeposit> | null> => {
    const deposit = deposits.find(c => parseFloat(c.payload.asset.quantity) >= quantity);
    if (!deposit) return null;
    if (parseFloat(deposit.payload.asset.quantity) > quantity) {
      const [[split]] = await ledger.exercise(AssetDeposit.AssetDeposit_Split, deposit.contractId, {
        quantities: [quantity.toString()],
      });
      return split;
    }
    return deposit.contractId;
  };

  const requestCreateOrder = async () => {
    const isCollateralized = listing.payload.listingType.tag === 'Collateralized';
    const depositCid = isBuy
      ? await getAsset(quotedAssets, price * quantity)
      : await getAsset(tradedAssets, quantity);

    const orderId: string =
      Date.now().toString() + crypto.getRandomValues(new Uint16Array(1))[0].toString();
    const details: Details = {
      id: { signatories: { textMap: {} }, label: orderId, version: '0' },
      symbol: listing.payload.listingId,
      asset: { id: listing.payload.tradedAssetId, quantity: quantity.toString() },
      side: isBuy ? Side.Buy : Side.Sell,
      orderType: isLimit
        ? { tag: 'Limit', value: { price: price.toString() } }
        : { tag: 'Market', value: {} },
      timeInForce:
        timeInForce === 'GTD'
          ? { tag: 'GTD', value: { expiryDate: expiryDate.toString() } }
          : { tag: timeInForce, value: {} },
    };
    clearOrderForm();
    if (listing.payload.listingType.tag === 'Collateralized') {
      if (!depositCid) return;
      await ledger.exercise(Service.RequestCreateOrder, service.contractId, {
        details,
        collateral: { tag: 'Collateral', value: depositCid },
      });
    } else {
      const clearinghouse = listing.payload.listingType.value.clearinghouse;
      await ledger.exercise(Service.RequestCreateOrder, service.contractId, {
        details,
        collateral: { tag: 'Cleared', value: { clearinghouse } },
      });
    }
  };

  return (
    <div>
      <Header as="h2" textAlign="center">
        <b>{listing.payload.listingId}</b>
      </Header>
      <div className="market">
        <div className="orders">
          <Tile header={<h4>Order Book</h4>}>
            <Table basic="very">
              <Table.Header>
                <Table.Cell key={0}></Table.Cell>
                <Table.Cell key={1}></Table.Cell>
                <Table.Cell key={2}>
                  <b>Price</b>
                </Table.Cell>
                <Table.Cell key={3}>
                  <b>Sell Quantity ({listing.payload.tradedAssetId.label})</b>
                </Table.Cell>
                <Table.Cell key={4}>
                  <b>Sell Volume ({listing.payload.quotedAssetId.label})</b>
                </Table.Cell>
              </Table.Header>
              <Table.Body>
                {asks.map((c, i) => (
                  <Table.Row key={i + 1}>
                    <Table.Cell key={0}></Table.Cell>
                    <Table.Cell key={1}></Table.Cell>
                    <Table.Cell key={2} style={{ color: 'red' }}>
                      {getPrice(c)}
                    </Table.Cell>
                    <Table.Cell key={3}>{getRemainingQuantity(c)}</Table.Cell>
                    <Table.Cell key={4}>{getRemainingVolume(c)}</Table.Cell>
                  </Table.Row>
                ))}
                {bids.map((c, i) => (
                  <Table.Row key={i + 1}>
                    <Table.Cell key={0}>{getRemainingVolume(c)}</Table.Cell>
                    <Table.Cell key={1}>{getRemainingQuantity(c)}</Table.Cell>
                    <Table.Cell key={2} style={{ color: 'green' }}>
                      {getPrice(c)}
                    </Table.Cell>
                    <Table.Cell key={3}></Table.Cell>
                    <Table.Cell key={4}></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer>
                <Table.Cell key={0}>
                  <b>Buy Volume ({listing.payload.quotedAssetId.label})</b>
                </Table.Cell>
                <Table.Cell key={1}>
                  <b>Buy Quantity ({listing.payload.tradedAssetId.label})</b>
                </Table.Cell>
                <Table.Cell key={2}>
                  <b>Price</b>
                </Table.Cell>
                <Table.Cell key={3}></Table.Cell>
                <Table.Cell key={4}></Table.Cell>
              </Table.Footer>
            </Table>
          </Tile>
          <Tile header={<h4>Orders</h4>}>
            <StripedTable
              headings={[
                'Symbol',
                'Order ID',
                'Type',
                'Side',
                'Price',
                'Quantity',
                'Volume',
                'Time In Force',
                'Filled',
                'Status',
              ]}
              loading={allOrders.loading}
              rowsClickable
              rows={orders.map(c => {
                return {
                  elements: [
                    c.payload.details.symbol,
                    c.payload.details.id.label,
                    c.payload.details.orderType.tag,
                    <div style={{ color: getColor(c) }}>{c.payload.details.side}</div>,
                    getPrice(c) || '',
                    getQuantity(c),
                    getVolume(c) || '',
                    <Popup
                      content={getTimeInForceText(
                        c.payload.details.timeInForce.tag,
                        c.payload.details.orderType.tag === 'Limit'
                      )}
                      mouseEnterDelay={500}
                      mouseLeaveDelay={500}
                      on="hover"
                      position="top right"
                      trigger={<div>{c.payload.details.timeInForce.tag}</div>}
                    />,
                    <>{getFillPercentage(c)} %</>,
                    c.payload.status.tag !== 'Rejected' &&
                    c.payload.status.tag !== 'CancellationRejected' ? (
                      displayStatus(c.payload.status)
                    ) : (
                      <Popup
                        content={getStatusReason(c.payload.status)}
                        mouseEnterDelay={500}
                        mouseLeaveDelay={500}
                        on="hover"
                        position="top right"
                        trigger={<div>{displayStatus(c.payload.status)}</div>}
                      />
                    ),
                  ],
                  onClick: () =>
                    history.push(`/app/trading/order/${c.contractId.replace('#', '_')}`),
                };
              })}
            />
          </Tile>
        </div>
        <div className="new-order">
          <Tile header={<h4>New Order</h4>}>
            <FormErrorHandled onSubmit={requestCreateOrder}>
              <Button.Group widths="2" toggle>
                <Button type="button" active={isBuy} onClick={() => setIsBuy(true)}>
                  Buy
                </Button>
                <Button type="button" active={!isBuy} onClick={() => setIsBuy(false)}>
                  Sell
                </Button>
              </Button.Group>
              <Button.Group widths="2" toggle>
                <Button type="button" active={isLimit} onClick={() => handleLimitChange(true)}>
                  Limit
                </Button>
                <Button type="button" active={!isLimit} onClick={() => handleLimitChange(false)}>
                  Market
                </Button>
              </Button.Group>
              <Form.Select
                selection
                label="Time in Force"
                options={timeInForceOptions(isLimit)}
                required
                value={timeInForce}
                onChange={(_, change) => setTimeInForce(change.value as TimeInForces)}
              />
              {timeInForce === 'GTD' && (
                <Form.Input
                  label="Price"
                  type="datetime-local"
                  required
                  onChange={(_, change) =>
                    setExpiryDate(DateTime.fromISO(change.value).toUTC().toSeconds())
                  }
                />
              )}
              <Form.Input
                label="Price"
                type="number"
                required
                disabled={!isLimit}
                value={price}
                labelPosition="right"
                onChange={(_, change) => handlePriceChange(parseFloat(change.value as string))}
              >
                <input />
                <Label>{listing.payload.quotedAssetId.label}</Label>
              </Form.Input>
              <Form.Input
                label="Quantity"
                type="number"
                required
                value={quantity}
                labelPosition="right"
                onChange={(_, change) => handleQuantityChange(parseFloat(change.value as string))}
              >
                <input />
                <Label>{listing.payload.tradedAssetId.label}</Label>
              </Form.Input>
              <Form.Input
                min={0}
                max={100}
                step={1}
                value={percentage}
                type="range"
                label={percentage + '%'}
                onChange={(_, change) => handlePercentageChange(parseFloat(change.value as string))}
              />
              <Form.Input
                label="Total"
                type="number"
                required
                value={total}
                disabled={!isLimit}
                labelPosition="right"
                onChange={(_, change) => handleTotalChange(parseFloat(change.value as string))}
              >
                <input />
                <Label>{listing.payload.quotedAssetId.label}</Label>
              </Form.Input>
              <Button className="ghost" type="submit" disabled={!price || !quantity}>
                {isBuy ? 'Buy' : 'Sell'} {listing.payload.tradedAssetId.label}
              </Button>
            </FormErrorHandled>
          </Tile>
        </div>
      </div>
    </div>
  );
};
