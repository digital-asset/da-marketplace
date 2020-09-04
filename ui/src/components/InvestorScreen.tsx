import React from 'react'
import { Button, Card, Grid, Header } from 'semantic-ui-react'

import { useParty, useStreamQuery, useLedger } from '@daml/react'

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { Exchange, ExchangeParticipant, Investor } from '@daml.js/da-marketplace/lib/Marketplace/Role'

import LogoutMenu from './common/LogoutMenu'
import './InvestorScreen.css'

type Props = {
    onLogout: () => void;
}

const InvestorScreen: React.FC<Props> = ({ onLogout }) => {
    const userparty = useParty();
    const allTokens = useStreamQuery(Token).contracts;
    const allDeposits = useStreamQuery(AssetDeposit).contracts;
    const allExchanges = useStreamQuery(Exchange).contracts;

    const ledger = useLedger();

    const placeOffer = async (depositCid: string) => {
        try {
            const key = {
                _1: "Operator",
                _2: userparty
            };

            const depositCid2 = await ledger.exerciseByKey(Investor.Investor_AllocateToExchange, key, {depositCid, exchange: "Exchange"});

            const expkey = {
                _1: "Exchange",
                _2: "Operator",
                _3: userparty
            }

            const pair = {
                _1: allTokens.find(t => t.payload.id.label === "BTC")?.payload.id,
                _2: allTokens.find(t => t.payload.id.label === "USDT")?.payload.id
            }

            await ledger.exerciseByKey(ExchangeParticipant.ExchangeParticipant_PlaceBid, expkey, {
                depositCid: depositCid2[0],
                pair: pair,
                price: "10000.00"
            })
            return true;
          } catch (error) {
            alert("Unknown error:\n" + JSON.stringify(error));
            return false;
          }
    }

    return (
        <Grid textAlign='center'>
            <Grid.Column stackable={false} width={4}>
                <Header as="h1">
                    @{userparty}
                </Header>

                <Header as="h3">
                    Tokens
                </Header>
                { allTokens.map(token => {
                    return <Card key={token.contractId}>{token.payload.id.label}</Card>
                }) }

                <Header as="h3">
                    Exchanges
                </Header>
                { allExchanges.map(exchanges => {
                    return <Card key={exchanges.contractId}>
                        {exchanges.payload.tokenPairs[0]._1.label}/
                        {exchanges.payload.tokenPairs[0]._2.label}
                    </Card>
                }) }
            </Grid.Column>

            <Grid.Column width={12} style={{backgroundColor: "#fff"}}>
                <LogoutMenu onLogout={onLogout}/>
                <Header as="h3">
                    Deposits
                </Header>
                { allDeposits.map(deposit => {
                    return (
                        <Card key={deposit.contractId}>
                            {deposit.payload.asset.id.label}: {deposit.payload.asset.quantity}
                            <Button onClick={() => placeOffer(deposit.contractId)}>Bid</Button>
                            <Button>Offer</Button>
                        </Card>
                    )
                })}
            </Grid.Column>
        </Grid>
    );
}

export default InvestorScreen;
