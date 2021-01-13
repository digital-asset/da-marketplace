import React from 'react'

import { OrderKind } from '../Investor/InvestorTrade'

import './OrderLadder.scss'

type MarketData = {
    qtyOrders: number;
    price: number;
    kind: OrderKind;
}

type OrderCellProp = {
    value?: number;
}

const OrderCell: React.FC<OrderCellProp> = ({ value }) => {
    return <div className='order-cell'><p>{value}</p></div>
}

export type MarketDataMap = {
    [price: number]: MarketData;
}

type OrderLadderProps = {
    bids?: number[];
    orders?: MarketDataMap;
    // price
}

const NUM_COLS = 3;
const NUM_ROWS = 10;

function getTileIndex(col: number, row: number) {
    return (col % NUM_COLS) + (row * NUM_COLS);
}

function insertOrders(orders: MarketDataMap, blankCells: JSX.Element[]) {
    let cells = blankCells;

    console.log("take a look: ", orders);
    const [openBids, openOffers] = Object.entries(orders).reduce((arrays, item) => {
        const [ bids, offers ] = arrays;
        const [ _, marketData ] = item;

        const newBids = [...bids, marketData].sort((a: MarketData, b: MarketData) => {
            if (a.price < b.price) {
                return 1;
            }

            if (a.price === b.price) {
                return 0;
            }

            return -1;
        });

        const newOffers = [...bids, marketData].sort((a: MarketData, b: MarketData) => {
            if (a.price > b.price) {
                return 1;
            }

            if (a.price === b.price) {
                return 0;
            }

            return -1;
        });

        if (marketData.kind === OrderKind.BID) {
            return [ newBids, offers ];
        } else {
            return [ bids, newOffers ];
        }
    }, [[], []] as [ MarketData[], MarketData[] ]);

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

    // const sortedKeys = Object.keys(orders).sort((a: string, b: string) => {
    //     const numA = Number(a);
    //     const numB = Number(b);

    //     if (numA < numB) {
    //         return 1;
    //     }

    //     if (numA === numB) {
    //         return 0;
    //     }

    //     return -1;
    // });

    // sortedKeys.forEach((key, index) => {
    //     const bidIndex = index*3;
    //     const priceIndex = index*3 + 1;
    //     const offerIndex = index*3 + 2;

    //     const kind = orders[+key]?.kind;
    //     const numOrders = orders[+key]?.qtyOrders;

    //     cells[priceIndex] = <OrderCell key={priceIndex} value={+key}/>

    //     if (kind === OrderKind.BID) {
    //         cells[bidIndex] = <OrderCell key={bidIndex} value={numOrders}/>
    //     } else if (kind === OrderKind.OFFER) {
    //         cells[offerIndex] = <OrderCell key={offerIndex} value={numOrders}/>
    //     }

    // })

    // Object.entries(orders).forEach(([price, marketData]) => {
    //     cells[30] = <OrderCell key={30} value={marketData.numOrders}/>
    //     cells[31] = <OrderCell key={31} value={+price}/>
    // })

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
            {/* <div className='column bids'>{cells}</div>
            <div className='column price'>{cells}</div>
            <div className='column offers'>{cells}</div> */}
        </div>
    )
}


export default OrderLadder;
