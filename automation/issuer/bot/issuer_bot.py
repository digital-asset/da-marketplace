import logging
import os

import dazl
from dazl import exercise


dazl.setup_default_logger(logging.INFO)


class MARKETPLACE:
    RegisteredBroker = 'Marketplace.Registry:RegisteredBroker'
    RegisteredCustodian = 'Marketplace.Registry:RegisteredCustodian'
    RegisteredExchange = 'Marketplace.Registry:RegisteredExchange'
    RegisteredInvestor = 'Marketplace.Registry:RegisteredInvestor'
    Token = 'Marketplace.Token:Token'


def main():
    url = os.getenv('DAML_LEDGER_URL')
    issuer = os.getenv('DAML_LEDGER_PARTY')
    public = os.getenv('DABL_PUBLIC_PARTY')

    issuer_party = "Issuer" if not issuer else issuer
    public_party = "Public" if not public else public

    network = dazl.Network()
    network.set_config(url=url, party_groups=[public_party])

    logging.info(f'Bot will run under party: {issuer_party}')

    client = network.aio_party(issuer_party)

    @client.ledger_ready()
    def say_hello(event):
        logging.info(f"DA Marketplace Issuer bot is ready!")


    @client.ledger_created(MARKETPLACE.RegisteredBroker)
    def handle_registered_broker(event):
        logging.info(f"{MARKETPLACE.RegisteredBroker} created!")
        tokens = client.find_active(MARKETPLACE.Token)
        commands = []

        for token_cid, token in tokens.items():
            logging.info(f"token_cid: {token_cid}, token: {token}")

            if not token['isPublic']:
                logging.info(f"{MARKETPLACE.Token} is not public")
                return

            if client.party in token['id']['signatories']['textMap']:
                commands.append(exercise(token_cid, 'Token_AddObservers',
                                         {'party': client.party,
                                          'newObservers': {'textMap': {event.cdata['broker']: {}}}
                                         }))
        logging.info(f"submitting {len(commands)} command(s)")
        client.submit(commands)


    @client.ledger_created(MARKETPLACE.RegisteredCustodian)
    def handle_registered_custodian(event):
        logging.info(f"{MARKETPLACE.RegisteredCustodian} created!")
        tokens = client.find_active(MARKETPLACE.Token)
        commands = []

        for token_cid, token in tokens.items():
            logging.info(f"token_cid: {token_cid}, token: {token}")

            if not token['isPublic']:
                logging.info(f"{MARKETPLACE.Token} is not public")
                return

            if client.party in token['id']['signatories']['textMap']:
                commands.append(exercise(token_cid, 'Token_AddObservers',
                                         {'party': client.party,
                                          'newObservers': {'textMap': {event.cdata['custodian']: {}}}
                                         }))
        logging.info(f"submitting {len(commands)} command(s)")
        client.submit(commands)

    @client.ledger_created(MARKETPLACE.RegisteredExchange)
    def handle_registered_exchange(event):
        logging.info(f"{MARKETPLACE.RegisteredExchange} created!")
        tokens = client.find_active(MARKETPLACE.Token)
        commands = []
        for token_cid, token in tokens.items():
            logging.info(f"token_cid: {token_cid}, token: {token}")

            if not token['isPublic']:
                logging.info(f"{MARKETPLACE.Token} is not public")
                return

            if client.party in token['id']['signatories']['textMap']:
                commands.append(exercise(token_cid, 'Token_AddObservers',
                                         {'party': client.party,
                                          'newObservers': {'textMap': {event.cdata['exchange']: {}}}
                                         }))
        logging.info(f"submitting {len(commands)} command(s)")
        client.submit(commands)

    @client.ledger_created(MARKETPLACE.RegisteredInvestor)
    def handle_registered_investor(event):
        logging.info(f"{MARKETPLACE.RegisteredInvestor} created!")
        tokens = client.find_active(MARKETPLACE.Token)
        commands = []
        for token_cid, token in tokens.items():
            logging.info(f"token_cid: {token_cid}, token: {token}")

            if not token['isPublic']:
                logging.info(f"{MARKETPLACE.Token} is not public")
                return

            if client.party in token['id']['signatories']['textMap']:
                commands.append(exercise(token_cid, 'Token_AddObservers',
                                         {'party': client.party,
                                          'newObservers': {'textMap': {event.cdata['investor']: {}}}
                                         }))
        logging.info(f"submitting {len(commands)} command(s)")
        client.submit(commands)

    @client.ledger_created(MARKETPLACE.Token)
    def handle_token_created(event):
        logging.info(f"{MARKETPLACE.Token} created!")

        if not event.cdata['isPublic']:
            logging.info(f"{MARKETPLACE.Token} is not public")
            return

        if client.party in event.cdata['id']['signatories']['textMap'] and \
            len(event.cdata['observers']['textMap']) <= 1:

            investor_contracts = client.find_active(MARKETPLACE.RegisteredInvestor)
            exchange_contracts = client.find_active(MARKETPLACE.RegisteredExchange)
            custodian_contracts = client.find_active(MARKETPLACE.RegisteredCustodian)
            broker_contracts = client.find_active(MARKETPLACE.RegisteredBroker)

            investors = {c['investor']: {} for c in investor_contracts.values()}
            exchanges = {c['exchange']: {} for c in exchange_contracts.values()}
            custodians = {c['custodian']: {} for c in custodian_contracts.values()}
            brokers = {c['broker']: {} for c in broker_contracts.values()}
            total_observers = len(investors) + len(exchanges) + len(custodians) + len(brokers)

            if total_observers == 0:
                return

            logging.info(f"adding {total_observers} observer(s)")
            client.submit_exercise(event.cid, 'Token_AddObservers',
                                {'party': client.party,
                                    'newObservers': {'textMap': {**investors, **exchanges, **custodians, **brokers}}
                                })

    network.run_forever()

if __name__ == "__main__":
    logging.info("DA Marketplace Issuer bot is starting up...")

    main()
