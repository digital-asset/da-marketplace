import logging
import os

import dazl
from dazl import exercise


dazl.setup_default_logger(logging.INFO)


def main():
    url = os.getenv('DAML_LEDGER_URL')
    exchange = os.getenv('DAML_LEDGER_PARTY')

    exchange_party = "Exchange" if not exchange else exchange

    network = dazl.Network()
    network.set_config(url=url)

    logging.info(f'Bot will run under party: {exchange_party}')

    client = network.aio_party(exchange_party)

    @client.ledger_ready()
    def say_hello(event):
        logging.info(f"DA Marketplace Exchange bot is ready!")

    network.run_forever()


if __name__ == "__main__":
    logging.info("DA Marketplace Exchange bot is starting up...")

    main()
