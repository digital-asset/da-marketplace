import React from 'react'
import { Card, Header } from 'semantic-ui-react'

import { ContractInfo } from './Investor'

type Props = {
    deposits: ContractInfo[];
}

const InvestorWallet: React.FC<Props> = ({ deposits }) => {
    return (
        <>
            <Header as="h2">Holdings</Header>

            { deposits.map(deposit => (
                <Card key={deposit.contractId}>
                    {deposit.contractData.asset.quantity} {deposit.contractData.asset.id.label}
                </Card>
            ))}
        </>
    )
}

export default InvestorWallet;
