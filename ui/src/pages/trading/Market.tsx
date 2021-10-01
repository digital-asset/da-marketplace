import React, {useMemo, useState} from 'react';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import {
  Details,
  Order,
  OrderType,
  Side,
  FeeSchedule, MarketType,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Model';
import { Service as TradingService } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import { CreateEvent } from '@daml/ledger';
import { ContractId } from '@daml/types';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { isEmptySet } from '../common';
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
  isPendingLimitOrder,
  timeInForceOptions,
  TimeInForces,
} from './Utils';
import StripedTable from '../../components/Table/StripedTable';
import { useHistory } from 'react-router-dom';
import { usePartyName } from '../../config';
import paths from '../../paths';
import { formatCurrency } from '../../util';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import {AssetDescription} from "@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription";
import _ from "lodash";

type Props = {
  cid: string;
  listings: Readonly<CreateEvent<Listing, any, any>[]>;
  feeSchedules: Readonly<CreateEvent<FeeSchedule, any, any>[]>;
  tradingServices: Readonly<CreateEvent<TradingService, any, any>[]>;
  custodyServices: Readonly<CreateEvent<CustodyService, any, any>[]>;
};

export const Market: React.FC<Props> = ({
  tradingServices,
  custodyServices,
  cid,
  listings,
  feeSchedules,
}) => {
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
  const listing = listings.find(c => c.contractId === cid);
  const tradingService = tradingServices
    .filter(t => t.payload.customer === party)
    .find(t => t.payload.provider === listing?.payload.provider);
  const feeSchedule = feeSchedules.find(fs => fs.payload.provider === listing?.payload.provider);
  const feeAmount = Number(feeSchedule?.payload.currentFee.amount) || 0.0;
  const { getName } = usePartyName(party);

  const assets = useStreamQueries(AssetDeposit).contracts;
  const allOrders = useStreamQueries(Order);
  const assetDescriptions = useStreamQueries(AssetDescription).contracts;
  const tradedAssetDescription = assetDescriptions.find(a => _.isEqual(a.payload.assetId, listing?.payload.tradedAssetId));
  const quotedAssetDescription = assetDescriptions.find(a => _.isEqual(a.payload.assetId, listing?.payload.quotedAssetId));
  const receivableAccount = useMemo(() =>
    custodyServices
      .filter(c => c.payload.account.owner === party)
      .find(c => isBuy
        ? c.payload.provider === tradedAssetDescription?.payload.registrar
        : c.payload.provider === quotedAssetDescription?.payload.registrar
      )?.payload.account
    , [isBuy, custodyServices, party, tradedAssetDescription, quotedAssetDescription]);

  if (!listing || !tradedAssetDescription || !quotedAssetDescription || !tradingService) return <></>; // TODO: Return 404 not found
  const clearinghouse =
    listing.payload.listingType.tag === 'Collateralized'
      ? 'Collateralized'
      : listing.payload.listingType.value.clearinghouse;
  const isCollateralized = listing.payload.listingType.tag === 'Collateralized';

  const orders = allOrders.contracts.filter(
    o => o.payload.details.listingId === listing.payload.listingId
  );
  const limits = orders.filter(c => c.payload.details.orderType.tag === 'Limit');
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

  const available = assets;
  const tradedAssets = available.filter(
    c => c.payload.asset.id.label === listing.payload.tradedAssetId.label
  );
  const quotedAssets = available.filter(
    c => c.payload.asset.id.label === listing.payload.quotedAssetId.label
  );

  const feeCurrency = feeSchedule?.payload.currentFee.currency.label || 'USD';
  const feeAssets = available.filter(c => c.payload.asset.id.label === feeCurrency);

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
    const deposit = deposits
      .sort((a, b) => parseFloat(a.payload.asset.quantity) - parseFloat(b.payload.asset.quantity))
      .find(c => parseFloat(c.payload.asset.quantity) >= quantity);

    if (!!deposit) {
      if (parseFloat(deposit.payload.asset.quantity) > quantity) {
        const [[split]] = await ledger.exercise(
          AssetDeposit.AssetDeposit_Split,
          deposit.contractId,
          {
            quantities: [quantity.toString()],
          }
        );
        return split;
      }
      return deposit.contractId;
    } else if (
      deposits.reduce((acc, cur) => acc + parseFloat(cur.payload.asset.quantity), 0) >= quantity
    ) {
      const [[headDeposit, ...tailDeposits], depositTotal] = deposits
        .sort((a, b) => parseFloat(a.payload.asset.quantity) - parseFloat(b.payload.asset.quantity))
        .reduce(
          ([assetDeposits, total], cur): [CreateEvent<AssetDeposit>[], number] => {
            if (total < quantity)
              return [[cur, ...assetDeposits], parseFloat(cur.payload.asset.quantity) + total];
            else return [assetDeposits, total];
          },
          [[], 0] as [CreateEvent<AssetDeposit>[], number]
        );

      const [mergedDepositCid] = await ledger.exercise(
        AssetDeposit.AssetDeposit_Merge,
        headDeposit.contractId,
        {
          depositCids: tailDeposits.map(d => d.contractId),
        }
      );

      if (depositTotal === quantity) return mergedDepositCid;
      else {
        const [[split]] = await ledger.exercise(AssetDeposit.AssetDeposit_Split, mergedDepositCid, {
          quantities: [quantity.toString()],
        });
        return split;
      }
    } else return null;
  };

  const requestCreateOrder = async () => {
    const orderId: string =
      Date.now().toString() + crypto.getRandomValues(new Uint16Array(1))[0].toString();
    const details = (optExchangeFee : any, marketType : MarketType) : Details=> ({
      id: orderId,
      listingId: listing.payload.listingId,
      asset: { id: listing.payload.tradedAssetId, quantity: quantity.toString() },
      side: isBuy ? Side.Buy : Side.Sell,
      orderType: isLimit
        ? { tag: 'Limit', value: { price: price.toString() } }
        : { tag: 'Market', value: {} },
      timeInForce:
        timeInForce === 'GTD'
          ? { tag: 'GTD', value: { expiryDate: expiryDate.toString() } }
          : { tag: timeInForce, value: {} },
      optExchangeFee: optExchangeFee,
      marketType: marketType,
    });

    if (listing.payload.listingType.tag === 'Collateralized') {
      if (!receivableAccount) return;
      const depositCid = isBuy
        ? await getAsset(quotedAssets, price * quantity)
        : await getAsset(tradedAssets, quantity);
      if (!depositCid) return;
      let optExchangeFee = null;
      if (feeAmount > 0) {
        const feeAssets = await ledger
          .query(AssetDeposit)
          .then(ds =>
            ds.filter(
              ad =>
                ad.contractId !== depositCid &&
                ad.payload.asset.id.label === feeCurrency &&
                isEmptySet(ad.payload.lockers)
            )
          );
        optExchangeFee = await getAsset(feeAssets, feeAmount);
      }
      const collateralized : MarketType = {
        tag: 'Collateralized',
        value: {
          depositCid : depositCid,
          receivableAccount : receivableAccount
        }
      }
      await ledger.exercise(TradingService.RequestCreateOrder, tradingService.contractId, {
        details: {
          ...details(optExchangeFee, collateralized)
        },
      });
    } else {
      const cleared : MarketType = {
        tag: 'Cleared',
        value: { clearinghouse : listing.payload.listingType.value.clearinghouse }
      };
      const optExchangeFee = feeAmount > 0 ? await getAsset(feeAssets, feeAmount) : null;

      await ledger.exercise(TradingService.RequestCreateOrder, tradingService.contractId, {
        details: {
          ...details(optExchangeFee, cleared)
        },
      });
    }
    clearOrderForm();
  };

  return (
    <div>
      <Header as="h2" textAlign="center">
        <b>
          {listing.payload.listingId} ({getName(clearinghouse)})
        </b>
      </Header>
      <div className="market">
        <div className="orders">
          <Tile header="Order Book">
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
          <StripedTable
            title="Orders"
            rowsClickable
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
            rows={orders.map(c => {
              return {
                elements: [
                  c.payload.details.listingId,
                  c.payload.details.id,
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
                  history.push(`${paths.app.markets.order}/${c.contractId.replace('#', '_')}`),
              };
            })}
          />
        </div>
        <div className="new-order">
          <Tile header="New Order">
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
                <Button
                  type="button"
                  active={!isLimit}
                  disabled={isCollateralized}
                  onClick={() => handleLimitChange(false)}
                >
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
              <Form.Input label="Fee" disabled={true} value={formatCurrency(feeAmount)} />
              <Button
                className="ghost"
                type="submit"
                disabled={(isLimit && !price) || !quantity}
              >
                {isBuy ? 'Buy' : 'Sell'} {listing.payload.tradedAssetId.label}
              </Button>
            </FormErrorHandled>
          </Tile>
        </div>
      </div>
    </div>
  );
};
