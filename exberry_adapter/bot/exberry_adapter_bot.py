import logging
import os

import dazl
from dazl import create, exercise, exercise_by_key

import time
from datetime import datetime

dazl.setup_default_logger(logging.INFO)

# SID = 1 # default SID, use ExberrySID contract to change while running
# SID = int(time.mktime(datetime.now().timetuple()))
# def get_sid() -> int:
#     global SID
#     SID = SID + 1
#     return SID

sid_to_order = {}

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
    CreateOrderRequest = 'Marketplace.Trading.Service:CreateOrderRequest'
    CancelOrderRequest = 'Marketplace.Trading.Service:CancelOrderRequest'
    Order = 'Marketplace.Trading.Order:Order'
    Token = 'Marketplace.Token:Token'
    MarketPair = 'Marketplace.Token:MarketPair'
    MatchingService = 'Marketplace.Trading.Matching:Service'
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
        global SID
        SID = event.cdata['sid']
        logging.info(f'Changed current SID to {SID}')
        return exercise(event.cid, 'ExberrySID_Ack', {})

    # Marketplace --> Exberry
    @client.ledger_created(MARKETPLACE.CreateOrderRequest)
    def handle_order_request(event):
        logging.info(f'Received Create Order Request - {event}')
        order = event.cdata['details']

        return create(EXBERRY.NewOrderRequest, {
            'order': {
                'orderType': list(order['orderType'])[0],
                'instrument': order['symbol'],
                'quantity': float(order['asset']['quantity']),
                'price': float(-1) if list(order['orderType'])[0] == 'Market' else float(order['orderType']['Limit']['price']),
                'side': order['side'],
                'timeInForce': list(order['timeInForce'])[0],
                'expiryDate': int(-1) if not list(order['timeInForce'])[0] == 'GTD' else int(order['timeInForce']['GTD']['expiryDate']),
                'mpOrderId': int(order['id']['label']), # This will be the SID for now
                'userId': make_user_user_id(event.cdata['provider']),
            },
            'integrationParty': client.party
        })

    # Marketplace <-- Exberry
    @client.ledger_created(EXBERRY.NewOrderSuccess)
    async def handle_new_order_success(event):
        return [exercise_by_key(MARKETPLACE.CreateOrderRequest,
                                {'_1': client.party, '_2': event.cdata['sid']},
                                'AcknowledgeRequest', {
                                    'providerOrderId' : event.cdata['orderId']
                                }
                            ), exercise(event.cid, 'Archive', {})]

    # Marketplace <-- Exberry
    @client.ledger_created(EXBERRY.NewOrderFailure)
    async def handle_new_order_failure(event):
        return [exercise_by_key(MARKETPLACE.CreateOrderRequest,
                                {'_1': client.party, '_2': event.cdata['sid']},
                                'RejectRequest', {
                                    'errorCode': event.cdata['errorCode'],
                                    'errorMessage': event.cdata['errorMessage']}
                                ), exercise(event.cid, 'Archive', {})]

    # Marketplace --> Exberry
    @client.ledger_created(MARKETPLACE.MarketPair)
    def handle_new_market_pair(event):
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
    @client.ledger_created(MARKETPLACE.CancelOrderRequest)
    async def handle_order_cancel_request(event):
        cancel_request = event.cdata
        return create(EXBERRY.CancelOrderRequest, {
            'integrationParty': client.party,
            'instrument': cancel_request['details']['asset']['id']['label'],
            'mpOrderId': cancel_request['details']['id']['label'],
            'userId': make_user_user_id(cancel_request['provider'])
        })

    # Marketplace <-- Exberry
    @client.ledger_created(EXBERRY.CancelOrderSuccess)
    async def handle_cancel_order_success(event):
        return [exercise_by_key(MARKETPLACE.CancelOrderRequest,
                                {'_1': client.party, '_2': event.cdata['sid']},
                                'AcknowledgeCancel', {}),
                exercise(event.cid, 'Archive', {})]

    # Marketplace <-- Exberry
    @client.ledger_created(EXBERRY.CancelOrderFailure)
    async def handle_cancel_order_failure(event):
        return [exercise_by_key(MARKETPLACE.CancelOrderRequest,
                                {'_1': client.party, '_2': event.cdata['sid']},
                                'FailureCancel', {
                                    'errorCode': event.cdata['errorCode'],
                                    'errorMessage': event.cdata['errorMessage']
                                }),
                exercise(event.cid, 'Archive', {})]

    # Marketplace <-- Exberry
    @client.ledger_created(EXBERRY.ExecutionReport)
    async def handle_execution_report(event):
        execution = event.cdata
        # TODO: Check if we should be calling the matching service directly
        return [exercise_by_key(MARKETPLACE.MatchingService, client.party, 'MatchOrders'
            , { 'execution' : {
                    'matchId' : execution['matchId'],
                    'makerOrderId' : execution['makerMpOrderId'],
                    'takerOrderId' : execution['takerMpOrderId'],
                    'quantity' : execution['executedQuantity'],
                    'price' : execution['executedPrice'],
                    'timestamp' : execution['eventTimestamp']}
            }), exercise(event.cid, 'Archive', {})]

    network.run_forever()


def make_instrument(pair) -> str:
    return f"{pair['_1']['label']}{pair['_2']['label']}"


def make_user_user_id(ledger_party) -> str:
    user_id = ''.join(ch for ch in ledger_party if ch.isalnum())
    return user_id[-20:]


if __name__ == "__main__":
    logging.info("DA Marketplace <> Exberry adapter is starting up...")

    main()
