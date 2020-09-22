import logging
import os

import dazl
from dazl import exercise


dazl.setup_default_logger(logging.INFO)


class MARKETPLACE:
    Custodian = 'Marketplace.Custodian:Custodian'
    CustodianRelationshipRequest = 'Marketplace.Custodian:CustodianRelationshipRequest'
    DepositTransferRequest = 'Marketplace.Transfer:DepositTransferRequest'


def main():
    url = os.getenv('DAML_LEDGER_URL')
    custodian = os.getenv('DAML_LEDGER_PARTY')

    custodian_party = "Custodian" if not custodian else custodian

    network = dazl.Network()
    network.set_config(url=url)

    logging.info(f'Bot will run under party: {custodian_party}')

    client = network.aio_party(custodian_party)

    @client.ledger_ready()
    def create_custodian(event):
        logging.info("DA Marketplace Custodian bot is ready!")

    @client.ledger_created(MARKETPLACE.DepositTransferRequest)
    def handle_deposit_transfer_request(event):
        logging.info(f"On {MARKETPLACE.DepositTransferRequest} created!")
        # auto-approve everything for the time being
        return client.submit_exercise(event.cid, 'DepositTransferRequest_Approve', {})

    @client.ledger_created(MARKETPLACE.CustodianRelationshipRequest)
    def handle_custodian_relationship_request(event):
        logging.info(f"On {MARKETPLACE.CustodianRelationshipRequest} created!")
        # auto-approve everything for the time being
        return client.submit_exercise(event.cid, 'CustodianRelationshipRequest_Approve', {})

    network.run_forever()


if __name__ == "__main__":
    logging.info("DA Marketplace Custodian bot is starting up...")

    main()
