import logging
import os

import dazl
from dazl import exercise


dazl.setup_default_logger(logging.INFO)


class MARKETPLACE:
    Trade = 'Marketplace.Trading:Trade'


def main():
    url = os.getenv('DAML_LEDGER_URL')
    ccp = os.getenv('DAML_LEDGER_PARTY')

    ccp_party = "CCP" if not ccp else ccp

    network = dazl.Network()
    network.set_config(url=url)

    logging.info(f'Bot will run under party: {ccp_party}')

    client = network.aio_party(ccp_party)

    @client.ledger_ready()
    def say_hello(event):
        logging.info("DA Marketplace CCP bot is ready!")

    @client.ledger_created(MARKETPLACE.Trade)
    def handle_trade(event):
        logging.info(f"On {MARKETPLACE.Trade} created!")

        return client.submit_exercise(event.cid, 'Trade_Novate', {})

    network.run_forever()


if __name__ == "__main__":
    logging.info("DA Marketplace CCP bot is starting up...")

    main()
