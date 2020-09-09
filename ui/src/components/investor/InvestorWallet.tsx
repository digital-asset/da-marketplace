import React from 'react'
import { Card, Header } from 'semantic-ui-react'

import { useStreamQuery } from '@daml/react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'


const InvestorWallet = () => {
    const allDeposits = useStreamQuery(AssetDeposit).contracts;

    return (
        <>
            <Header as="h2">Holdings</Header>

            { allDeposits.map(deposit => (
                <Card key={deposit.contractId}>
                    {deposit.payload.asset.quantity} {deposit.payload.asset.id.label}
                </Card>
            ))}
        </>
    )
}

export default InvestorWallet;
