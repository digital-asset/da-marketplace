import {
  Order,
  OrderType,
  Side,
  Status,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Model';
import { CreateEvent } from '@daml/ledger';

export type TimeInForces = 'GTC' | 'GTD' | 'GAA' | 'IOC' | 'FOK';

export const timeInForceOptions = (isLimitOrder: boolean) =>
  isLimitOrder
    ? [
        { text: 'Good Till Cancelled', value: 'GTC' },
        { text: 'Good Till Date', value: 'GTD' },
        { text: 'Good At Auction', value: 'GAA' },
        { text: 'Immediate Or Cancel', value: 'IOC' },
        { text: 'Fill Or Kill', value: 'FOK' },
      ]
    : [
        { text: 'Immediate Or Cancel', value: 'IOC' },
        { text: 'Fill Or Kill', value: 'FOK' },
      ];

export const getTimeInForceText = (timeInForce: TimeInForces, isLimitOrder: boolean) =>
  timeInForceOptions(isLimitOrder)
    .filter(({ text, value }) => value === timeInForce)
    .map(({ text, value }) => text)[0];

export const displayStatus = (status: Status) => {
  switch (status.tag) {
    case 'New':
    case 'Rejected':
    case 'Cancelled':
      return status.tag;
    case 'PendingExecution':
      return 'Pending Execution';
    case 'PartiallyExecuted':
      return 'Partially Executed';
    case 'FullyExecuted':
      return 'Fully Executed';
    case 'PendingCancellation':
      return 'Pending Cancellation';
    case 'CancellationRejected':
      return 'Cancellation Rejected';
  }
};

export const getStatusReason = (status: Status) => {
  if (status.tag === 'Rejected' || status.tag === 'CancellationRejected') {
    return status.value.reason.message;
  }
};

export const getStatusReasonCode = (status: Status) => {
  if (status.tag === 'Rejected' || status.tag === 'CancellationRejected') {
    return status.value.reason.code;
  }
};

export const getColor = (c: CreateEvent<Order>) => {
  return c.payload.details.side === Side.Buy ? 'green' : 'red';
};

export const getPrice = (c: CreateEvent<Order>) => {
  return parseFloat((c.payload.details.orderType.value as OrderType.Limit).price);
};

export const getQuantity = (c: CreateEvent<Order>) => {
  return parseFloat(c.payload.details.asset.quantity);
};

export const getVolume = (c: CreateEvent<Order>) => {
  return getPrice(c) * getQuantity(c);
};

export const getRemainingQuantity = (c: CreateEvent<Order>) => {
  return parseFloat(c.payload.remainingQuantity);
};

export const getRemainingVolume = (c: CreateEvent<Order>) => {
  return getPrice(c) * getRemainingQuantity(c);
};

export const isPendingLimitOrder = (status: Status) =>
  ['New', 'PendingExecution', 'PartiallyExecuted'].includes(status.tag);

export const getFillPercentage = (c: CreateEvent<Order>) =>
  (100.0 - (100.0 * parseFloat(c.payload.remainingQuantity)) / getQuantity(c)).toFixed(2);
