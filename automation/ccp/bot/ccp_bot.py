import logging
import os

import dazl
from dazl import exercise_by_key


dazl.setup_default_logger(logging.INFO)


class MARKETPLACE:
    CCP = 'Marketplace.CentralCounterparty:CCP'
    Trade = 'Marketplace.Trading:DerivativeTrade'


def main():
    url = os.getenv('DAML_LEDGER_URL')
    ccp = os.getenv('DAML_LEDGER_PARTY')

    ccp_party = "CCP" if not ccp else ccp
    operator_party = "Operator"

    network = dazl.Network()
    network.set_config(url=url)

    logging.info(f'Bot will run under party: {ccp_party}')

    client = network.aio_party(ccp_party)

    @client.ledger_ready()
    def say_hello(event):
        logging.info("DA Marketplace CCP bot is ready!")
        ccps = client.find_active(Marketplace.CCP, {})
        for _, cdata in ccps.items():
            logging.info(f"Setting operator party to {cdata['operator']}")
            operator_party = cdata['operator']

    @client.ledger_created(Marketplace.CCP)
    def handle_ccp(event):
        logging.info(f"Setting operator party to {cdata['operator']}")
        operator_party = event.cdata['operator']

    @client.ledger_created(MARKETPLACE.DerivativeTrade)
    def handle_trade(event):
        logging.info(f"On {MARKETPLACE.DerivativeTrade} created!")
        return [exercise_by_key(Marketplace.CCP, {'_1': operator_party, '_2': client.party},
                                'CCP_NovateDerivativeTrade', {'derivativeTradeCid': event.cid})]

    network.run_forever()


if __name__ == "__main__":
    logging.info("DA Marketplace CCP bot is starting up...")

    main()
