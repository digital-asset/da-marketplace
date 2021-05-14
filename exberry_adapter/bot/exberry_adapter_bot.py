import logging
import os
from datetime import datetime

import dazl
from dazl import create, exercise, exercise_by_key, ContractId, ContractData

dazl.setup_default_logger(logging.INFO)

SID = 1 # default SID, use ExberrySID contract to change while running
def get_sid() -> int:
    global SID
    SID = SID + 1
    return SID

sid_to_order = {}
sid_is_cleared = {}
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
    MassCancelRequest = 'Exberry.Integration:MassCancelRequest'


class MARKETPLACE:
    OrderRequest = 'Marketplace.Trading:OrderRequest'
    OrderCancelRequest = 'Marketplace.Trading:OrderCancelRequest'
    Order = 'Marketplace.Trading:Order'
    ClearedOrderRequest = 'Marketplace.Trading:ClearedOrderRequest'
    ClearedOrderCancelRequest = 'Marketplace.Trading:ClearedOrderCancelRequest'
    ClearedOrder = 'Marketplace.Trading:ClearedOrder'
    ClearedTrade = 'Marketplace.Trading:ClearedTrade'
    Token = 'Marketplace.Token:Token'
    ResetMarketRequest = 'Marketplace.Exchange:ResetMarketRequest'
    MarketPair = 'Marketplace.Token:MarketPair'
    ExberrySID = 'Marketplace.Utils:ExberrySID'

class FakeContractEvent():
    def __init__(self, cid, cdata):
        self.cid = cid
        self.cdata = cdata

    cid: ContractId
    cdata: ContractData

def main():
    url = os.getenv('DAML_LEDGER_URL')
    exchange = os.getenv('DAML_LEDGER_PARTY')

    exchange_party = "Exchange" if not exchange else exchange

    network = dazl.Network()
    network.set_config(url=url)

    logging.info(f'Integration will run under party: {exchange_party}')

    client = network.aio_party(exchange_party)

    def find_highest_sid():
        current_highest = 0
        exberry_requests = client.find_active(EXBERRY.NewOrderRequest)
        orders = client.find_active(MARKETPLACE.Order)
        cleared_orders = client.find_active(MARKETPLACE.ClearedOrder)

        for (_,exberry_request) in exberry_requests.items():
            if exberry_request['order']['mpOrderId'] > current_highest:
                current_highest = exberry_request['order']['mpOrderId']

        for(_,order) in orders.items():
            if order['orderId'] > current_highest: current_highest = order['orderId']

        for(_,order) in cleared_orders.items():
            if order['orderId'] > current_highest: current_highest = order['orderId']

        return current_highest


    def find_and_run(template_name, fn):
        commands = []
        templates = client.find_active(template_name)

        for (cid,item) in templates.items():
            event = FakeContractEvent(cid, item)
            result = fn(event)
            if isinstance(result, list):
                commands.extend(result)
            else:
                commands.append(result)
        return commands

    def collect_run_commands(template_pairs):
        commands = []
        for (template, fn) in template_pairs:
            commands.extend(find_and_run(template, fn))
        return commands

    @client.ledger_ready()
    def say_hello(event):
        logging.info("DA Marketplace <> Exberry adapter is ready!")
        # Populate market_pairs store on startup
        marketpairs = client.find_active(MARKETPLACE.MarketPair)
        for (_, pair) in marketpairs.items():
            market_pairs[pair['id']['label']] = pair

        global SID
        SID = find_highest_sid() + 1

        return collect_run_commands([
            (MARKETPLACE.ExberrySID, handle_exberry_SID),
            (MARKETPLACE.MarketPair, handle_new_market_pair),
            (EXBERRY.ExecutionReport, handle_execution_report),
            (MARKETPLACE.ClearedOrderRequest, handle_cleared_order_request),
            (MARKETPLACE.OrderRequest, handle_order_request),
            (EXBERRY.NewOrderSuccess, handle_new_order_success),
            (EXBERRY.NewOrderFailure, handle_new_order_failure),
            (MARKETPLACE.OrderCancelRequest, handle_order_cancel_request),
            (MARKETPLACE.ClearedOrderCancelRequest, handle_cleared_order_cancel_request),
            (EXBERRY.CancelOrderSuccess, handle_cancel_order_success),
            (EXBERRY.CancelOrderFailure, handle_cancel_order_failure),
            (MARKETPLACE.ResetMarketRequest, handle_clear_market)
        ])

    @client.ledger_created(MARKETPLACE.ResetMarketRequest)
    def handle_clear_market(event):
        logging.info('running clear market...')
        sid = get_sid()
        pair = event.cdata['pair']
        commands = []
        instrument = ""
        if event.cdata['clearedMarket']:
            logging.info(f"resetting cleared market...")
            orders = client.find_active(MARKETPLACE.ClearedOrder)
            for (order_cid, order) in orders.items():
                if order['pair'] == pair:
                    commands.append(exercise(order_cid, "ClearedOrder_Cancel"))

            cancel_requests = client.find_active(MARKETPLACE.ClearedOrderCancelRequest)
            for (req_cid, req) in cancel_requests.items():
                if req['order']['pair'] == pair:
                    commands.append(exercise(req_cid, "ClearedOrderCancel_Reject"))

            order_requests = client.find_active(MARKETPLACE.ClearedOrderRequest)
            for (req_cid, req) in order_requests.items():
                if req['order']['pair'] == pair:
                    commands.append(exercise(req_cid, "ClearedOrderRequest_Reject"))
            instrument = make_instrument(pair, True)
        else:
            logging.info(f"resetting regular market...")
            orders = client.find_active(MARKETPLACE.Order)
            for (order_cid, order) in orders.items():
                if order['pair'] == pair:
                    commands.append(exercise(order_cid, "Order_Cancel"))

            cancel_requests = client.find_active(MARKETPLACE.OrderCancelRequest)
            for (req_cid, req) in cancel_requests.items():
                if req['order']['pair'] == pair:
                    commands.append(exercise(req_cid, "OrderCancel_Reject"))

            order_requests = client.find_active(MARKETPLACE.OrderRequest)
            for (req_cid, req) in order_requests.items():
                if req['order']['pair'] == pair:
                    commands.append(exercise(req_cid, "OrderRequest_Reject"))
            instrument = make_instrument(pair)
        commands.append(create(EXBERRY.MassCancelRequest, {
            'integrationParty': client.party,
            'sid': sid,
            'instrument': instrument
        }))
        commands.append(exercise(event.cid, "ResetMarketRequest_Ack"))

        return commands



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

        instrument = make_instrument(order['pair'], True)
        logging.info(f"Instrument label is: {instrument}")

        return create(EXBERRY.NewOrderRequest, {
            'order': {
                'orderType': 'Limit',
                'instrument': instrument,
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

        sid_is_cleared[event_sid] = order['isCleared']

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

        logging.info(f'{query}')

        if order['isCleared']:
            logging.info(f"Acknowledging Cleared Order Failure")
            req_cid, _ = await client.find_one(MARKETPLACE.ClearedOrderRequest, query)
            return [exercise(req_cid, 'ClearedOrderRequest_Reject', {})]
                    # exercise(event.cid, 'Archive', {})]
        else:
            logging.info(f"Acknowledging Order Failure")
            req_cid, _ = await client.find_one(MARKETPLACE.OrderRequest, query)
            return [exercise(req_cid, 'OrderRequest_Reject', {})]
                    # exercise(event.cid, 'Archive', {})]

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

        logging.info(f"New market_pairs is {market_pairs}")

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

    # Marketplace --> Exberry
    @client.ledger_created(MARKETPLACE.ClearedOrderCancelRequest)
    def handle_cleared_order_cancel_request(event):
        logging.info(f"Handling ClearedOrderCancelRequest")

        order = event.cdata['order']
        return create(EXBERRY.CancelOrderRequest, {
            'integrationParty': client.party,
            'instrument': make_instrument(order['pair'], True),
            'mpOrderId': order['orderId'],
            'userId': make_user_user_id(order['exchParticipant'])
        })

    # Marketplace <-- Exberry
    @client.ledger_created(EXBERRY.CancelOrderSuccess)
    async def handle_cancel_order_success(event):
        logging.info(f"Handling CancelOrderSuccess")

        if sid_is_cleared[event.cdata['sid']]:
            return [
                exercise_by_key(MARKETPLACE.ClearedOrderCancelRequest,
                                {'_1': client.party, '_2': event.cdata['sid']},
                                'ClearedOrderCancel_Ack', {}),
                exercise(event.cid, 'Archive', {})
                ]
        else:
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
        instrument_name = execution['instrument']
        if instrument_name in market_pairs:
            cleared_market = market_pairs[instrument_name]['clearedMarket']
            base_token_id = market_pairs[instrument_name]['baseTokenId']
            quote_token_id = market_pairs[instrument_name]['quoteTokenId']
            token_pair = {
                '_1': base_token_id,
                '_2': quote_token_id
            }

            if cleared_market:
                logging.info(f"Processing cleared order report")
                commands = [exercise(event.cid, 'Archive', {})]

                taker_cid, taker = await client.find_one(MARKETPLACE.ClearedOrder, {
                    'orderId': execution['takerMpOrderId']
                })
                maker_cid, maker = await client.find_one(MARKETPLACE.ClearedOrder, {
                    'orderId': execution['makerMpOrderId']
                })

                ccp = taker['ccp'] if (taker['ccp'] == maker['ccp']) else None

                if not ccp:
                    logging.error(f"Error: non-matching ccp parties: {taker['ccp']} !== {maker['ccp']}")
                    return commands

                pair = market_pairs[execution['instrument']]
                (buyer, seller) = determine_participants(maker, taker)

                commands.append(create(MARKETPLACE.ClearedTrade, {
                    'ccp': ccp,
                    'exchange': client.party,
                    'eventId': execution['eventId'],
                    'timeMatched': execution['eventTimestamp'],
                    'instrument': pair['id'],
                    'pair': token_pair,
                    'trackingNumber': execution['trackingNumber'],
                    'buyer': buyer['exchParticipant'],
                    'buyerOrderId': buyer['orderId'],
                    'seller': seller['exchParticipant'],
                    'sellerOrderId': seller['orderId'],
                    'matchId': execution['matchId'],
                    'executedQuantity': execution['executedQuantity'],
                    'executedPrice': execution['executedPrice']
                }))
                commands.append(exercise(taker_cid, 'ClearedOrder_Fill', {
                    'fillQty': execution['executedQuantity'],
                    'fillPrice': execution['executedPrice']
                }))
                commands.append(exercise(maker_cid, 'ClearedOrder_Fill', {
                    'fillQty': execution['executedQuantity'],
                    'fillPrice': execution['executedPrice']
                }))
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
                    'timeMatched': execution['eventTimestamp']
                }))
                commands.append(exercise(maker_cid, 'Order_Fill', {
                    'fillQty': execution['executedQuantity'],
                    'fillPrice': execution['executedPrice'],
                    'counterParty': taker['exchParticipant'],
                    'counterOrderId': taker['orderId'],
                    'timeMatched': execution['eventTimestamp']
                }))

            return commands
        else:
            logging.info(f"Instrument: {instrument_name} does not exist, ignoring ExecutionReport.")
            commands = [exercise(event.cid, 'Archive', {})]

    network.run_forever()

def determine_participants(maker, taker):
    if maker['isBid']:
        return (maker, taker)
    else:
        return (taker, maker)

def make_instrument(pair, cleared = False) -> str:
    label = f"{pair['_1']['label']}{pair['_2']['label']}"
    return f"{label}CLR" if cleared else label


def make_user_user_id(ledger_party) -> str:
    user_id = ''.join(ch for ch in ledger_party if ch.isalnum())
    return user_id[-20:]

if __name__ == "__main__":
    logging.info("DA Marketplace <> Exberry adapter is starting up...")

    main()
