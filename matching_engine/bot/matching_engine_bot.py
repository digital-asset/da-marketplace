import logging
import os

import dazl
from dazl import exercise


dazl.setup_default_logger(logging.INFO)

ORDER_ID = 0
def get_order_id() -> int:
    global ORDER_ID
    ORDER_ID = ORDER_ID + 1
    return ORDER_ID


class MARKETPLACE:
    OrderRequest = 'Marketplace.Trading:OrderRequest'
    OrderCancelRequest = 'Marketplace.Trading:OrderCancelRequest'
    Order = 'Marketplace.Trading:Order'


def sorter(kv):
    (_, cdata) = kv
    return cdata['price']


def is_crossing(passive_order, aggressive_order):
    if passive_order['exchParticipant'] == aggressive_order['exchParticipant']:
        return False

    if aggressive_order['isBid']:
        return passive_order['price'] <= aggressive_order['price']
    return passive_order['price'] >= aggressive_order['price']


def order_to_str(order):
    bid_offer = 'BID' if order['isBid'] else 'ASK'
    price = order['price']
    qty = order['qty']
    base_ccy = order['pair']['_1']['label']
    quote_ccy = order['pair']['_2']['label']
    return f'{base_ccy}/{quote_ccy} - {bid_offer} {qty}@{price}'


def main():
    url = os.getenv('DAML_LEDGER_URL')
    exchange = os.getenv('DAML_LEDGER_PARTY')

    exchange_party = "Exchange" if not exchange else exchange

    network = dazl.Network()
    network.set_config(url=url)

    logging.info(f'DA Marketplace matching engine will run under party: {exchange_party}')

    client = network.aio_party(exchange_party)

    @client.ledger_ready()
    def say_hello(event):
        logging.info("DA Marketplace matching engine is ready!")

    @client.ledger_created(MARKETPLACE.OrderRequest)
    def handle_order_request(event):
        logging.info(f'{MARKETPLACE.OrderRequest} created!')
        return exercise(event.cid, 'OrderRequest_Ack', {'orderId': get_order_id()})

    @client.ledger_created(MARKETPLACE.OrderCancelRequest)
    def handle_order_cancel_request(event):
        logging.info(f'{MARKETPLACE.OrderCancelRequest} created!')
        return exercise(event.cid, 'OrderCancel_Ack', {})

    @client.ledger_created(MARKETPLACE.Order)
    def check_for_matches(event):
        order = event.cdata
        is_bid = order['isBid']
        logging.info(f"{order_to_str(order)} - Cid: {event.cid}")

        opposite_book = client.find_active(MARKETPLACE.Order, {'isBid': (not is_bid), 'pair': order['pair']})
        for (cid, passive_order) in sorted(opposite_book.items(), key=sorter, reverse=(not is_bid)):
            if is_crossing(passive_order, order):
                logging.info(f"Order crosses with \n{order_to_str(passive_order)}")

                fill_qty = min(passive_order['qty'], order['qty'])
                fill_price = passive_order['price']

                fill_passive = exercise(cid, 'Order_Fill', {
                    'fillQty': fill_qty,
                    'fillPrice': fill_price,
                    'counterParty': order['exchParticipant']
                })
                fill_aggressive = exercise(event.cid, 'Order_Fill', {
                    'fillQty': fill_qty,
                    'fillPrice': fill_price,
                    'counterParty': passive_order['exchParticipant']
                })

                return client.submit([fill_passive, fill_aggressive])

        logging.info("No matches found!")

    network.run_forever()

if __name__ == '__main__':
    logging.info("DA Marketplace matching engine is starting up...")

    main()
