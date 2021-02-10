import logging
import os

import dazl
from dazl import create, exercise, exercise_by_key

dazl.setup_default_logger(logging.INFO)

SID = 1 # default SID, use ExberrySID contract to change while running
def get_sid() -> int:
    global SID
    SID = SID + 1
    return SID

sid_to_order = {}
market_pairs = {}

class EXBERRY:
    NewOrderRequest = 'Exberry.Integration:NewOrderRequest'
    NewOrderSuccess = 'Exberry.Integration:NewOrderSuccess'
    NewOrderFailure = 'Exberry.Integration:NewOrderFailure'
    CancelOrderRequest = 'Exberry.Integration:CancelOrderRequest'
    CancelOrderSuccess = 'Exberry.Integration:CancelOrderSuccess'
    CancelOrderFailure = 'Exberry.Integration:CancelOrderFailure'
    CreateInstrumentRequest = 'Exberry.Integration:CreateInstrumentRequest'
    Instrument = 'Exberry.Integration:Instrument'
    FailedInstrumentRequest = 'Exberry.Integration:FailedInstrumentRequest'
    ExecutionReport = 'Exberry.Integration:ExecutionReport'


class MARKETPLACE:
    OrderRequest = 'Marketplace.Trading:OrderRequest'
    OrderCancelRequest = 'Marketplace.Trading:OrderCancelRequest'
    Order = 'Marketplace.Trading:Order'
    ClearedOrderRequest = 'Marketplace.Trading:ClearedOrderRequest'
    ClearedOrder = 'Marketplace.Trading:ClearedOrder'
    Token = 'Marketplace.Token:Token'
    MarketPair = 'Marketplace.Token:MarketPair'
    ExberrySID = 'Marketplace.Utils:ExberrySID'


def main():
    url = os.getenv('DAML_LEDGER_URL')
    exchange = os.getenv('DAML_LEDGER_PARTY')

    exchange_party = "Exchange" if not exchange else exchange

    network = dazl.Network()
    network.set_config(url=url)

    logging.info(f'Integration will run under party: {exchange_party}')

    client = network.aio_party(exchange_party)

    @client.ledger_ready()
    def say_hello(event):
        logging.info("DA Marketplace <> Exberry adapter is ready!")
        sids = client.find_active(MARKETPLACE.ExberrySID)
        global SID
        for (_,item) in sids.items():
            SID = item['sid']
            logging.info(f'Changed current SID to {SID}')
        return [exercise(cid, 'ExberrySID_Ack') for cid in sids.keys()]

    @client.ledger_created(MARKETPLACE.ExberrySID)
    def handle_exberry_SID(event):
        logging.info(f"Handling new Exberry SID")
        global SID
        SID = event.cdata['sid']
        logging.info(f'Changed current SID to {SID}')
        return exercise(event.cid, 'ExberrySID_Ack', {})

    # Marketplace --> Exberry
    @client.ledger_created(MARKETPLACE.ClearedOrderRequest)
    def handle_cleared_order_request(event):
        logging.info(f"Handling new ClearedOrderRequest")
        sid = get_sid()

        order = event.cdata['order']
        order['isCleared'] = True

        sid_to_order[sid] = order

        return create(EXBERRY.NewOrderRequest, {
            'order': {
                'orderType': 'Limit',
                'instrument': make_instrument(order['pair']),
                'quantity': float(order['qty']),
                'price': float(order['price']),
                'side': 'Buy' if order['isBid'] else 'Sell',
                'timeInForce': 'GTC',
                'mpOrderId': sid,  # we use sid for order ids
                'userId': make_user_user_id(order['exchParticipant']),
            },
            'integrationParty': client.party
        })

    # Marketplace --> Exberry
    @client.ledger_created(MARKETPLACE.OrderRequest)
    def handle_order_request(event):
        logging.info(f"Handling new OrderRequest")

        sid = get_sid()

        order = event.cdata['order']
        order['isCleared'] = False

        sid_to_order[sid] = order

        return create(EXBERRY.NewOrderRequest, {
            'order': {
                'orderType': 'Limit',
                'instrument': make_instrument(order['pair']),
                'quantity': float(order['qty']),
                'price': float(order['price']),
                'side': 'Buy' if order['isBid'] else 'Sell',
                'timeInForce': 'GTC',
                'mpOrderId': sid,  # we use sid for order ids
                'userId': make_user_user_id(order['exchParticipant']),
            },
            'integrationParty': client.party
        })

    # Marketplace <-- Exberry
    @client.ledger_created(EXBERRY.NewOrderSuccess)
    async def handle_new_order_success(event):
        logging.info(f"Handling NewOrderSuccess")

        event_sid = event.cdata['sid']
        order = sid_to_order.pop(event_sid)

        query = { 'order': order }

        if order['isCleared']:
            logging.info(f"Acknowledging Cleared Order Success")
            req_cid, _ = await client.find_one(MARKETPLACE.ClearedOrderRequest, query)

            return [exercise(req_cid, 'ClearedOrderRequest_Ack', {
                'orderId': event_sid
            }), exercise(event.cid, 'Archive', {})]
        else:
            logging.info(f"Acknowledging Order Success")
            req_cid, _ = await client.find_one(MARKETPLACE.OrderRequest, query)
            return [exercise(req_cid, 'OrderRequest_Ack', {
                'orderId': event_sid
            }), exercise(event.cid, 'Archive', {})]

    # Marketplace <-- Exberry
    @client.ledger_created(EXBERRY.NewOrderFailure)
    async def handle_new_order_failure(event):
        logging.info(f"Handling NewOrderFailure")

        event_sid = event.cdata['sid']
        order = sid_to_order.pop(event_sid)

        query = { 'order': order }

        if order['isCleared']:
            logging.info(f"Acknowledging Cleared Order Failure")
            req_cid, _ = await client.find_one(MARKETPLACE.ClearedOrderRequest, query)
            return [exercise(req_cid, 'ClearedOrderRequest_Reject', {}),
                    exercise(event.cid, 'Archive', {})]
        else:
            logging.info(f"Acknowledging Order Failure")
            req_cid, _ = await client.find_one(MARKETPLACE.OrderRequest, query)
            return [exercise(req_cid, 'OrderRequest_Reject', {}),
                    exercise(event.cid, 'Archive', {})]

    # Marketplace --> Exberry
    @client.ledger_created(MARKETPLACE.MarketPair)
    def handle_new_market_pair(event):
        logging.info(f"Handling new MarketPair")

        pair = event.cdata
        symbol = pair['id']['label']
        description = pair['description']
        calendar_id = pair['calendarId']
        quote_currency = pair['quoteTokenId']['label']
        price_precision = pair['pricePrecision']
        quantity_precision = pair['quantityPrecision']
        min_quantity = pair['minQuantity']
        max_quantity = pair['maxQuantity']
        status = pair['status'][10:]

        market_pairs[symbol] = pair

        logging.info(f"New market_pairs is ${market_pairs}")

        return create(EXBERRY.CreateInstrumentRequest, {
            'integrationParty': client.party,
            'symbol': symbol,
            'quoteCurrency': quote_currency,
            'instrumentDescription': description,
            'calendarId': calendar_id,
            'pricePrecision': price_precision,
            'quantityPrecision': quantity_precision,
            'minQuantity': min_quantity,
            'maxQuantity': max_quantity,
            'status': status
        })

    # Marketplace --> Exberry
    @client.ledger_created(MARKETPLACE.OrderCancelRequest)
    def handle_order_cancel_request(event):
        logging.info(f"Handling OrderCancelRequest")

        order = event.cdata['order']
        return create(EXBERRY.CancelOrderRequest, {
            'integrationParty': client.party,
            'instrument': make_instrument(order['pair']),
            'mpOrderId': order['orderId'],
            'userId': make_user_user_id(order['exchParticipant'])
        })

    # Marketplace <-- Exberry
    @client.ledger_created(EXBERRY.CancelOrderSuccess)
    async def handle_cancel_order_success(event):
        logging.info(f"Handling CancelOrderSuccess")

        return [exercise_by_key(MARKETPLACE.OrderCancelRequest,
                                {'_1': client.party, '_2': event.cdata['sid']},
                                'OrderCancel_Ack', {}),
                exercise(event.cid, 'Archive', {})]

    # Marketplace <-- Exberry
    @client.ledger_created(EXBERRY.CancelOrderFailure)
    async def handle_cancel_order_failure(event):
        logging.info(f"Handling CancelOrderFailure")

        return [exercise_by_key(MARKETPLACE.OrderCancelRequest,
                                {'_1': client.party, '_2': event.cdata['sid']},
                                'OrderCancel_Reject', {}),
                exercise(event.cid, 'Archive', {})]

    # Marketplace <-- Exberry
    @client.ledger_created(EXBERRY.ExecutionReport)
    async def handle_execution_report(event):
        logging.info(f"Handling execution report")

        execution = event.cdata
        instrumentName = execution['instrument']
        cleared_market = market_pairs[instrumentName]['clearedMarket']

        if cleared_market:
            logging.info(f"Processing cleared order report")

            taker_cid, _ = await client.find_one(MARKETPLACE.ClearedOrder, {
                'orderId': execution['takerMpOrderId']
            })
            maker_cid, _ = await client.find_one(MARKETPLACE.ClearedOrder, {
                'orderId': execution['makerMpOrderId']
            })

            # TO-DO: create ClearedTrade here too
            commands = [exercise(event.cid, 'Archive', {})]
            commands.append(exercise(taker_cid, 'Archive', {}))
            commands.append(exercise(maker_cid, 'Archive', {}))
        else:
            logging.info(f"Processing collateralized order report")

            taker_cid, taker = await client.find_one(MARKETPLACE.Order, {
                'orderId': execution['takerMpOrderId']
            })
            maker_cid, maker = await client.find_one(MARKETPLACE.Order, {
                'orderId': execution['makerMpOrderId']
            })

            commands = [exercise(event.cid, 'Archive', {})]
            commands.append(exercise(taker_cid, 'Order_Fill', {
                'fillQty': execution['executedQuantity'],
                'fillPrice': execution['executedPrice'],
                'counterOrderId': maker['orderId'],
                'counterParty': maker['exchParticipant'],
                'timestamp': execution['eventTimestamp']
            }))
            commands.append(exercise(maker_cid, 'Order_Fill', {
                'fillQty': execution['executedQuantity'],
                'fillPrice': execution['executedPrice'],
                'counterParty': taker['exchParticipant'],
                'counterOrderId': taker['orderId'],
                'timestamp': execution['eventTimestamp']
            }))

        return commands

    network.run_forever()


def make_instrument(pair) -> str:
    return f"{pair['_1']['label']}{pair['_2']['label']}"


def make_user_user_id(ledger_party) -> str:
    user_id = ''.join(ch for ch in ledger_party if ch.isalnum())
    return user_id[-20:]


if __name__ == "__main__":
    logging.info("DA Marketplace <> Exberry adapter is starting up...")

    main()
