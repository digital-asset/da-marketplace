import React from 'react'

import './OrderLadder.css'

const OrderCell: React.FC = () => {
    return <div className='order-cell'><h1>Hey</h1></div>
}

const OrderLadder: React.FC = () => {
    return (
        <div className='order-ladder'>
            <div className='bids-column'><OrderCell/></div>
            <div className='price-column'><OrderCell/></div>
            <div className='offers-column'><OrderCell/></div>
        </div>
    )
}


export default OrderLadder;
