import React from 'react'

import {OrderKind} from './InvestorTrade'

import {StringKeyedObject} from '../common/utils'

type OrderCellProp = {
    value?: number;
}

const OrderCell: React.FC<OrderCellProp> = ({ value }) => {
    return <div className='order-cell'><p>{value}</p></div>
}

type MarketData = {
    qtyOrders: number;
    price: number;
    kind: OrderKind;
}

export type MarketDataMap = StringKeyedObject<MarketData>;

type OrderLadderProps = {
    orders?: MarketDataMap;
}

const NUM_COLS = 3;
const NUM_ROWS = 10;

function getTileIndex(col: number, row: number) {
    return (col % NUM_COLS) + (row * NUM_COLS);
}

function insertOrders(orders: MarketDataMap, blankCells: JSX.Element[]) {
    let cells = blankCells;

    const [ openBids, openOffers ] = splitOrders(orders);

    openBids.forEach((data, index) => {
        const bidIndex = getTileIndex(0, 5 + index);
        const priceIndex = getTileIndex(1, 5 + index);

        cells[bidIndex] = <OrderCell key={bidIndex} value={data.qtyOrders}/>;
        cells[priceIndex] = <OrderCell key={priceIndex} value={data.price}/>;
    });

    openOffers.forEach((data, index) => {
        const offerIndex = getTileIndex(2, 4 - index);
        const priceIndex = getTileIndex(1, 4 - index);

        cells[offerIndex] = <OrderCell key={offerIndex} value={data.qtyOrders}/>;
        cells[priceIndex] = <OrderCell key={priceIndex} value={data.price}/>;
    })

    return cells;
}

const OrderLadder: React.FC<OrderLadderProps> = ({ orders }) => {
    const blankCells = Array(NUM_ROWS * NUM_COLS).fill(0).map((_, n) => <OrderCell key={n}/>);
    const cells = insertOrders(orders || {}, blankCells);

    return (
        <div className='order-ladder'>
            <div className='grid-container'>
                {cells}
            </div>
        </div>
    )
}

export default OrderLadder;

function splitOrders(orders: MarketDataMap): [ MarketData[], MarketData[] ] {
    return Object.entries(orders).reduce((arrays, item) => {
        const [ bids, offers ] = arrays;
        const newOrder = item[1];

        const newBids = addNewOrderSorted(bids, newOrder, (a, b) => a < b);
        const newOffers = addNewOrderSorted(offers, newOrder, (a, b) => a > b);

        if (newOrder.kind === OrderKind.BID) {
            return [ mergePriceLevels(newBids), offers ];
        } else {
            return [ bids, mergePriceLevels(newOffers) ];
        }
    }, [[], []] as [ MarketData[], MarketData[] ]);
}

function addNewOrderSorted(
    orders: MarketData[],
    item: MarketData,
    comparator: (a: number, b: number) => boolean): MarketData[]
{
    return [...orders, item].sort((a: MarketData, b: MarketData) => {
        if (comparator(a.price, b.price)) {
            return 1;
        }

        if (a.price === b.price) {
            return 0;
        }

        return -1;
    });
}

function mergePriceLevels(orders: MarketData[]): MarketData[] {
    return orders.reduce((orders, order) => {
        const sameIndex = orders.findIndex(o => o.price === order.price);

        if (sameIndex < 0) {
            return [...orders, order];
        } else {
            let newOrders = [...orders];
            newOrders[sameIndex].qtyOrders += order.qtyOrders;
            return newOrders;
        }
    }, [] as MarketData[]);
}
