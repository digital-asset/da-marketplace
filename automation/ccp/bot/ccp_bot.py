import logging
import os

import dazl
from dazl import exercise_by_key


dazl.setup_default_logger(logging.INFO)


class MARKETPLACE:
    CCP = 'Marketplace.CentralCounterparty:CCP'
    Trade = 'Marketplace.Trading:DerivativeTrade'
    MarginCalculation = 'Marketplace.Clearing:MarginCalculation'
    MarkToMarketCalculation = 'Marketplace.Clearing:MarkToMarketCalculation'
    CCPCustomer = 'Marketplace.CentralCounterpartyCustomer:CCPCustomer'

class DA:
    AssetDeposit = 'DA.Finance.Asset:AssetDeposit'


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


    @client.ledger_created(MARKETPLACE.MarginCalculation)
    def handle_margin_calculation(event):
        net_diff = event.cdata['netDiff']
        account_id = event.cdata['accountId']
        customer = event.cdata['customer']
        # todo: query an asset deposit that covers the net diff amount if the
        # asset_deposits = client.find_active(DA.AssetDeposit {'account':})

        # exercise_by_key(MARKETPLACE.CCPCustomer, {'_1': client.party, '_2': operator_party, '_3': ccpCustomer}, 'CCPCustomer_RequestInternalTransfer',
        # {'depositCid': , 'isInbound': True if net_diff > 0 else False, 'amount': net_diff })

        raise NotImplementedError("this is work in progress")


    @client.ledger_created(MARKETPLACE.MarkToMarketCalculation)
    def handle_margin_mtm_calculation(event):
        raise NotImplementedError("this is work in progress")

    network.run_forever()


if __name__ == "__main__":
    logging.info("DA Marketplace CCP bot is starting up...")

    main()
