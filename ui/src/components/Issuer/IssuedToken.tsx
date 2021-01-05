import React from 'react'
import { useParams } from 'react-router-dom'
import { Header, List, Table } from 'semantic-ui-react'

import { useStreamQueries } from '@daml/react'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { makeContractInfo, ContractInfo } from '../common/damlTypes'

import Page from '../common/Page'
import PageSection from '../common/PageSection'
import ReactJson from 'react-json-view'

import './IssueAsset.css'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const IssuedToken: React.FC<Props> = ({ sideNav, onLogout }) => {
    const { tokenId } = useParams<{tokenId: string}>()

    const token = useStreamQueries(Token, () => [], [], (e) => {
        console.log("Unexpected close from token: ", e);
    }).contracts.find(c => c.contractId === decodeURIComponent(tokenId))

    const allDeposits = useStreamQueries(AssetDeposit, () => [], [], (e) => {
        console.log("Unexpected close from assetDeposit: ", e);
    }).contracts.map(makeContractInfo)

    const tokenDeposits = allDeposits.filter(deposit => deposit.contractData.asset.id.label === token?.payload.id.label &&
                                                        deposit.contractData.asset.id.version === token?.payload.id.version);

    const totalAllocatedQuantity = tokenDeposits.length > 0 ? tokenDeposits.map(deposit => Number(deposit.contractData.asset.quantity))
                                                                           .reduce(function(a, b) { return a + b })
                                                            : 0
    
    function calculatePercentage(num: string) {
        return (Number(num)/totalAllocatedQuantity)*100
    }

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<Header as='h3'>{token?.payload.id.label}</Header>}
            onLogout={onLogout}
        >
            <PageSection border='blue' background='white'>
                <p>{token?.payload.description}</p>
                <Header as='h3'>Token Details</Header>
                <ReactJson
                    src={token}
                    collapsed={true}
                    name='contract'
                    displayDataTypes={false}/>
                <Header as='h3'>Position Holdings</Header>
                <Table className='issuer-cap-table' >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Investor</Table.HeaderCell>
                            <Table.HeaderCell>Broker</Table.HeaderCell>
                            <Table.HeaderCell textAlign='right' >Amount</Table.HeaderCell>
                            <Table.HeaderCell textAlign='right'>Percentage Owned</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tokenDeposits.length > 0 ?
                            tokenDeposits.map(deposit => 
                                <Table.Row>
                                    <Table.Cell>{deposit.contractData.account.owner || '-'}</Table.Cell>
                                    <Table.Cell>{deposit.contractData.account.provider || '-'}</Table.Cell>
                                    <Table.Cell textAlign='right'>{deposit.contractData.asset.quantity || '-'}</Table.Cell>
                                    <Table.Cell textAlign='right'>{calculatePercentage(deposit.contractData.asset.quantity)}%</Table.Cell>
                                </Table.Row>
                            )
                        :
                            <Table.Row className='empty-table' >
                                <Table.Cell textAlign={'center'} colSpan={4}>
                                     <i>There are no position holdings for this token</i>
                                </Table.Cell>
                            </Table.Row>
                        }
                    </Table.Body>
                </Table>
            </PageSection>
        </Page>
    )
}

export default IssuedToken;
