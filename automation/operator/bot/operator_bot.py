import logging
import os

import dazl
from dazl import exercise


dazl.setup_default_logger(logging.INFO)


class MARKETPLACE:
    UserSession = 'Marketplace.Onboarding:UserSession'
    Operator = 'Marketplace.Operator:Operator'


def main():
    url = os.getenv('DAML_LEDGER_URL')
    operator = os.getenv('DAML_LEDGER_PARTY')
    public = os.getenv('DABL_PUBLIC_PARTY')

    operator_party = "Operator" if not operator else operator
    public_party = "Public" if not public else public

    network = dazl.Network()
    network.set_config(url=url)

    logging.info(f'Bot will run under party: {operator_party}')

    client = network.aio_party(operator_party)

    @client.ledger_ready()
    def create_operator(event):
        res = client.find_active(MARKETPLACE.Operator)
        logging.info(f"Found {len(res)} {MARKETPLACE.Operator} contracts")

        if not res:
            logging.info(f"Creating Operator contract for {operator_party}...")
            return client.submit_create(MARKETPLACE.Operator,
                                        {'operator': operator_party, 'public': public_party})
        else:
            logging.info("DA Marketplace Operator Bot is ready!")
            user_sessions = client.find_active(MARKETPLACE.UserSession)
            logging.info(f"Found {len(user_sessions)} {MARKETPLACE.UserSession} contracts")
            return [exercise(cid, 'UserSession_Ack') for cid in user_sessions.keys()]

    @client.ledger_created(MARKETPLACE.Operator)
    def handle_operator(event):
        user_sessions = client.find_active(MARKETPLACE.UserSession)
        if len(user_sessions) > 0:
            logging.info(f"Found {len(user_sessions)} {MARKETPLACE.UserSession} contracts")
            return [exercise(cid, 'UserSession_Ack') for cid in user_sessions.keys()]


    @client.ledger_created(MARKETPLACE.UserSession)
    def handle_user_session(event):
        logging.info(f"On {MARKETPLACE.UserSession} created!")
        return client.submit_exercise(event.cid, 'UserSession_Ack')

    network.run_forever()


if __name__ == "__main__":
    logging.info("DA Marketplace Operator bot is starting up...")

    main()
