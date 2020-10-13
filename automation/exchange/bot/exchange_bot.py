import logging
import os

import dazl
from dazl import exercise


dazl.setup_default_logger(logging.INFO)


class MARKETPLACE:
    TradeSide = 'Marketplace.Trading:TradeSide'
    SettledBinaryOption = 'Marketplace.BinaryOption:SettledBinaryOption'


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

    @client.ledger_created(MARKETPLACE.SettledBinaryOption)
    def handle_binary_option_settlement(event):
        logging.info(f"On {MARKETPLACE.SettledBinaryOption} created!")
        trade_to_settle = client.find_active(MARKETPLACE.TradeSide)
        commands = []
        for cid, cdata in trade_to_settle:
            if cdata['pair']['_1'] == event.cdata['id']:
                commands.append(exercise(cid, 'TradeSide_SettleBinaryOption',
                                         {'settledBinOptionCid': event.cid}))
        logging.info(f'Settling {len(commands)} trade sides' \
            if len(commands) > 0 else 'Found no trade sides to settle')
        return client.submit(commands)

    @client.ledger_created(MARKETPLACE.TradeSide)
    def handle_trade_settlement(event):
        logging.info(f"On {MARKETPLACE.TradeSide} created!")
        trade_side = event.cdata
        if not trade_side['isBinaryOption']:
            return client.submit_exercise(event.cid, 'TradeSide_Settle', {})

        settled_options = client.find_active(MARKETPLACE.SettledBinaryOption,
                                             {'id': trade_side['pair']['_1']})
        if len(settled_options) > 0:
            (cid, cdata) = next(iter(settled_options))
            return client.submit_exercise(event.cid,
                                          'TradeSide_SettleBinaryOption',
                                          {'settledBinOptionCid': cid})

    network.run_forever()


if __name__ == "__main__":
    logging.info("DA Marketplace Exchange bot is starting up...")

    main()
