import logging
import os

import dazl
from dazl import exercise


dazl.setup_default_logger(logging.INFO)


class MARKETPLACE:
    AssetDepositTransferRequest = 'Marketplace.Role.AssetDepositTransferRequest'
    Order = 'Marketplace.Trading:Order'


def main():
    url = os.getenv('DAML_LEDGER_URL')
    exchange = os.getenv('DAML_LEDGER_PARTY')
    public = os.getenv('DABL_PUBLIC_PARTY')

    exchange_party = "Exchange" if not exchange else exchange
    public_party = "Public" if not public else public

    network = dazl.Network()
    network.set_config(url=url)

    logging.info(f'Integration will run under party: {exchange_party}')

    client = network.aio_party(exchange_party)

    @client.ledger_ready()
    def say_hello(event):
        logging.info(f"DA Marketplace Exchange bot is ready!")


    @client.ledger_created(MARKETPLACE.AssetDepositTransferRequest)
    def handle_handle_deposit_transfer_request(event):
        deposit_cid = event.cdata['depositCid']
        orders = client.find_active(MARKETPLACE.Order, {'depositCid': deposit_cid})
        if not bool(orders):
            return exercise(event.cid, 'AssetDepositTransferRequest_Approve', {})

        (_, order_data) = next(iter(orders))
        logging.warn(f"Rejecting Deposit Transfer Request as deposit "
                     f"is allocated to order with id {order_data['orderId']}")
        return exercise(event.cid, 'AssetDepositTransferRequest_Reject', {})

    network.run_forever()


if __name__ == "__main__":
    logging.info("DA Marketplace Exchange bot is starting up...")

    main()
