import React from 'react';
import { useStreamQueries } from '../../Main';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Model';
import { CreateEvent } from '@daml/ledger';
import { Table } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import { DateTime } from 'luxon';
import {
  displayStatus,
  getFillPercentage,
  getPrice,
  getQuantity,
  getRemainingQuantity,
  getStatusReason,
  getStatusReasonCode,
  getTimeInForceText,
  getVolume,
} from './Utils';
import { useParams } from 'react-router-dom';
import StripedTable from '../../components/Table/StripedTable';
import BackButton from '../../components/Common/BackButton';

type Props = {
  listings: Readonly<CreateEvent<Listing, any, any>[]>;
};

export const TradingOrder: React.FC<Props> = ({ listings }: Props) => {
  const { contractId } = useParams<any>();
  const allOrders = useStreamQueries(Order);
  const order = allOrders.contracts.find(o => o.contractId === contractId);
  if (!order) return <></>; // TODO: Return 404 not found

  const listing = listings.find(
    c => c.payload.listingId.label === order.payload.details.listingId.label
  );
  if (!listing) return <></>; // TODO: Return 404 not found

  return (
    <div>
      <BackButton />
      <div className="market">
        <div className="orders">
          <Tile header="Order">
            <Table basic="very">
              <Table.Body>
                <Table.Row key={0}>
                  <Table.Cell key={0}>
                    <b>Order ID</b>
                  </Table.Cell>
                  <Table.Cell key={1}>{order.payload.details.id.label}</Table.Cell>
                </Table.Row>
                {order.payload.providerOrderId && (
                  <>
                    <Table.Row key={1}>
                      <Table.Cell key={0}>
                        <b>Provider Order ID</b>
                      </Table.Cell>
                      <Table.Cell key={1}>{order.payload.providerOrderId}</Table.Cell>
                    </Table.Row>
                  </>
                )}
                <Table.Row key={2}>
                  <Table.Cell key={0}>
                    <b>Instrument</b>
                  </Table.Cell>
                  <Table.Cell key={1}>{order.payload.details.asset.id.label}</Table.Cell>
                </Table.Row>
                <Table.Row key={3}>
                  <Table.Cell key={0}>
                    <b>Type</b>
                  </Table.Cell>
                  <Table.Cell key={1}>{order.payload.details.orderType.tag}</Table.Cell>
                </Table.Row>
                <Table.Row key={4}>
                  <Table.Cell key={0}>
                    <b>Side</b>
                  </Table.Cell>
                  <Table.Cell key={1}>{order.payload.details.side}</Table.Cell>
                </Table.Row>
                {order.payload.details.orderType.tag === 'Limit' && (
                  <>
                    <Table.Row key={5}>
                      <Table.Cell key={0}>
                        <b>Price</b>
                      </Table.Cell>
                      <Table.Cell key={1}>{getPrice(order)}</Table.Cell>
                    </Table.Row>
                  </>
                )}
                <Table.Row key={6}>
                  <Table.Cell key={0}>
                    <b>Quantity</b>
                  </Table.Cell>
                  <Table.Cell key={1}>{getQuantity(order)}</Table.Cell>
                </Table.Row>
                <Table.Row key={7}>
                  <Table.Cell key={0}>
                    <b>Remaining</b>
                  </Table.Cell>
                  <Table.Cell key={1}>{getRemainingQuantity(order)}</Table.Cell>
                </Table.Row>
                {order.payload.details.orderType.tag === 'Limit' && (
                  <>
                    <Table.Row key={8}>
                      <Table.Cell key={0}>
                        <b>Volume</b>
                      </Table.Cell>
                      <Table.Cell key={1}>{getVolume(order)}</Table.Cell>
                    </Table.Row>
                  </>
                )}
                <Table.Row key={9}>
                  <Table.Cell key={0}>
                    <b>Time In Force</b>
                  </Table.Cell>
                  <Table.Cell key={1}>
                    {getTimeInForceText(
                      order.payload.details.timeInForce.tag,
                      order.payload.details.orderType.tag === 'Limit'
                    )}
                  </Table.Cell>
                </Table.Row>
                {order.payload.details.timeInForce.tag === 'GTD' && (
                  <>
                    <Table.Row key={10}>
                      <Table.Cell key={0}>
                        <b>Expiry Date</b>
                      </Table.Cell>
                      <Table.Cell key={1}>
                        {DateTime.fromMillis(
                          parseInt(order.payload.details.timeInForce.value.expiryDate) * 1000
                        ).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
                      </Table.Cell>
                    </Table.Row>
                  </>
                )}
                <Table.Row key={11}>
                  <Table.Cell key={0}>
                    <b>Filled</b>
                  </Table.Cell>
                  <Table.Cell key={1}>{getFillPercentage(order)} %</Table.Cell>
                </Table.Row>
                <Table.Row key={12}>
                  <Table.Cell key={0}>
                    <b>Status</b>
                  </Table.Cell>
                  <Table.Cell key={1}>{displayStatus(order.payload.status)}</Table.Cell>
                </Table.Row>
                {(order.payload.status.tag === 'Rejected' ||
                  order.payload.status.tag === 'CancellationRejected') && (
                  <>
                    <Table.Row key={13}>
                      <Table.Cell key={0}>
                        <b>Status Code</b>
                      </Table.Cell>
                      <Table.Cell key={1}>{getStatusReasonCode(order.payload.status)}</Table.Cell>
                    </Table.Row>
                    <Table.Row key={14}>
                      <Table.Cell key={0}>
                        <b>Status Reason</b>
                      </Table.Cell>
                      <Table.Cell key={1}>{getStatusReason(order.payload.status)}</Table.Cell>
                    </Table.Row>
                  </>
                )}
              </Table.Body>
            </Table>
          </Tile>
        </div>

        <StripedTable
          title="Executions"
          rowsClickable
          headings={['Match Id', 'Quantity', 'Price', 'Execution Date']}
          loading={allOrders.loading}
          rows={order.payload.executions.map(e => {
            return {
              elements: [
                e.matchId,
                parseFloat(e.quantity),
                parseFloat(e.price),
                DateTime.fromMillis(parseInt(e.timestamp) / 1000000).toLocaleString(
                  DateTime.DATETIME_FULL_WITH_SECONDS
                ),
              ],
            };
          })}
        />
      </div>
    </div>
  );
};
