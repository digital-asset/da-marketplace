import logging
import os

import dazl
from dazl import create, exercise, exercise_by_key

import time
from datetime import datetime

dazl.setup_default_logger(logging.INFO)

class EXBERRY:
    NewOrderRequest = 'Exberry.Integration:NewOrderRequest'
    NewOrderSuccess = 'Exberry.Integration:NewOrderSuccess'
    NewOrderFailure = 'Exberry.Integration:NewOrderFailure'
    NewOrderCancelled = 'Exberry.Integration:NewOrderCancelled'
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
    Order = 'Marketplace.Trading.Model:Order'
    CreateListingRequest = 'Marketplace.Listing.Service:CreateListingRequest'
    MatchingService = 'Marketplace.Trading.Matching.Service:Service'


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

    # Marketplace --> Exberry
    @client.ledger_created(MARKETPLACE.CreateOrderRequest)
    def handle_order_request(event):
        logging.info(f'Received Create Order Request - {event}')
        order = event.cdata['details']

        return create(EXBERRY.NewOrderRequest, {
            'order': {
                'orderType': list(order['orderType'])[0],
                'instrument': order['listingId']['label'],
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

    # Marketplace <-- Exberry
    @client.ledger_created(EXBERRY.NewOrderCancelled)
    async def handle_new_order_cancel(event):
        return [exercise_by_key(MARKETPLACE.CreateOrderRequest,
                                {'_1': client.party, '_2': event.cdata['mpOrderId']},
                                'CancelRequest', {
                                    'providerOrderId': event.cdata['orderId'],
                                    'cancelledQuantity': event.cdata['cancelledQuantity']}
                                ), exercise(event.cid, 'Archive', {})]

    # Marketplace --> Exberry
    @client.ledger_created(MARKETPLACE.CreateListingRequest)
    def handle_new_listing(event):
        logging.info(f'Received Listing request - {event}')
        listing = event.cdata
        symbol = listing['symbol']
        description = listing['description']
        calendar_id = listing['calendarId']
        quote_currency = listing['quotedAssetId']['label']
        price_precision = listing['quotedAssetPrecision']
        quantity_precision = listing['tradedAssetPrecision']
        min_quantity = listing['minimumTradableQuantity']
        max_quantity = listing['maximumTradableQuantity']
        status = listing['status']

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

    # Exberry --> Marketplace
    @client.ledger_created(EXBERRY.Instrument)
    def handle_new_listing_success(event):
        return [exercise_by_key(MARKETPLACE.CreateListingRequest,
                                {'_1': client.party, '_2': event.cdata['symbol']},
                                'ListingRequestSuccess', {
                                    'providerId': event.cdata['instrumentId']
                                }), exercise(event.cid, 'Archive', {})]

    # Exberry --> Marketplace
    @client.ledger_created(EXBERRY.FailedInstrumentRequest)
    def handle_new_listing_failure(event):
        return [exercise_by_key(MARKETPLACE.CreateListingRequest,
                                {'_1': client.party, '_2': event.cdata['symbol']},
                                'ListingRequestFailure', {
                                    'message': event.cdata['message'],
                                    'name': event.cdata['name'],
                                    'code': event.cdata['code']
                                }), exercise(event.cid, 'Archive', {})]


    # Marketplace --> Exberry
    @client.ledger_created(MARKETPLACE.CancelOrderRequest)
    async def handle_order_cancel_request(event):
        cancel_request = event.cdata
        return create(EXBERRY.CancelOrderRequest, {
            'integrationParty': client.party,
            'instrument': cancel_request['details']['listingId']['label'],
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
