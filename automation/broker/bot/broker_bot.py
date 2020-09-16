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
    BrokerOrderRequest = 'Marketplace.Trading:BrokerOrderRequest'


def main():
    url = os.getenv('DAML_LEDGER_URL')
    broker = os.getenv('DAML_LEDGER_PARTY')

    broker_party = "Broker" if not broker else broker

    network = dazl.Network()
    network.set_config(url=url)

    logging.info(f'Bot will run under party: {broker_party}')

    client = network.aio_party(broker_party)

    @client.ledger_ready()
    def say_hellpo(event):
        logging.info("DA Marketplace Broker bot is ready!")

    @client.ledger_created(MARKETPLACE.BrokerOrderRequest)
    def handle_deposit_transfer_request(event):
        logging.info(f"On {MARKETPLACE.BrokerOrderRequest} created!")
        # auto-approve everything for the time being
        return client.submit_exercise(event.cid, 'BrokerOrderRequest_Accept',
                                      {'brokerOrderId': get_order_id()})

    network.run_forever()


if __name__ == "__main__":
    logging.info("DA Marketplace Broker bot is starting up...")

    main()
