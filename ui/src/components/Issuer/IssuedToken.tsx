import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, Table, List, Button } from 'semantic-ui-react'

import { useStreamQueries } from '@daml/react'

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { GlobeIcon, LockIcon, IconChevronDown, IconChevronUp, AddPlusIcon } from '../../icons/Icons'

import { makeContractInfo, ContractInfo} from '../common/damlTypes'
import Page from '../common/Page'
import PageSection from '../common/PageSection'
import DonutChart, { getDonutChartColor, IDonutChartData } from '../common/DonutChart'

import AddParticipantModal from './AddParticipantModal'

type DepositInfo = {
    investor: string,
    provider: string,
    quantity: number
}

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const IssuedToken: React.FC<Props> = ({ sideNav, onLogout }) => {
    const [ showParticipants, setShowParticipants ] = useState(false)
    const [ showAddParticipantModal, setShowAddParticipantModal ] = useState(false)
    const { tokenId } = useParams<{tokenId: string}>()

    const token = useStreamQueries(Token, () => [], [], (e) => {
        console.log("Unexpected close from token: ", e);
    }).contracts.map(makeContractInfo).find(c => c.contractId === decodeURIComponent(tokenId))

    const isPublic = !!token?.contractData.isPublic

    const tokenDeposits = useStreamQueries(AssetDeposit, () => [], [], (e) => {
        console.log("Unexpected close from assetDeposit: ", e);
    }).contracts.map(makeContractInfo).filter(deposit =>
        deposit.contractData.asset.id.label === token?.contractData.id.label &&
        deposit.contractData.asset.id.version === token?.contractData.id.version
    );

    const participants = Object.keys(token?.contractData.observers.textMap || [])

    const nettedTokenDeposits = netTokenDeposits(tokenDeposits)

    const totalAllocatedQuantity = nettedTokenDeposits.length > 0 ? nettedTokenDeposits.reduce((a, b) => +a + +b.quantity, 0) : 0

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<Header as='h3'>{token?.contractData.id.label}</Header>}
            onLogout={onLogout}>
            <PageSection className='issued-token'>
                <div className='token-subheading'>
                    <p>{token?.contractData.description}</p>
                    <div className='token-details'>
                        {isPublic ? <p> <GlobeIcon/> Public </p> : <p> <LockIcon/> Private </p>}
                        <p> Quantity Precision: {token?.contractData.quantityPrecision} </p>
                    </div>
                </div>
                {!isPublic &&
                    <div className='participants-viewer'>
                        <Button className='ghost smaller' onClick={() => setShowParticipants(!showParticipants)}>
                            {showParticipants?
                                <p> Hide Participants <IconChevronUp/></p>
                                :
                                <p> View/Add Participants <IconChevronDown/></p>
                            }
                        </Button>
                        {showParticipants &&
                            <>
                            <div className='list-heading'>
                                <p><b>Participants</b></p>
                                <Button className='ghost smaller' onClick={() => setShowAddParticipantModal(true)}>
                                    <AddPlusIcon/> <p>Add Participant</p>
                                </Button>
                            </div>
                                <ul className='participants-list'>
                                    {Array.from(participants).map(o =>
                                        <li key={o}>
                                            <List.Content>
                                                <p>{o}</p>
                                            </List.Content>
                                        </li>
                                    )}
                                </ul>
                            </>}
                    </div>
                }
                <Header as='h3'>Position Holdings</Header>
                <div className='position-holdings-data'>
                    <Table className='issuer-cap-table'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Investor</Table.HeaderCell>
                                <Table.HeaderCell>Provider</Table.HeaderCell>
                                <Table.HeaderCell textAlign='right'>Amount</Table.HeaderCell>
                                <Table.HeaderCell textAlign='right'>Percentage Owned</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {nettedTokenDeposits.length > 0 ?
                                nettedTokenDeposits.map(deposit =>
                                    <Table.Row>
                                        <Table.Cell>{deposit.investor || '-'}</Table.Cell>
                                        <Table.Cell>{deposit.provider || '-'}</Table.Cell>
                                        <Table.Cell textAlign='right'>{deposit.quantity || '-'}</Table.Cell>
                                        <Table.Cell textAlign='right'>{((deposit.quantity/totalAllocatedQuantity)*100).toFixed(1)}%</Table.Cell>
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
                    <AllocationsChart nettedTokenDeposits={nettedTokenDeposits}/>
                </div>
            </PageSection>
            <AddParticipantModal
                tokenId={token?.contractData.id}
                onRequestClose={() => setShowAddParticipantModal(false)}
                show={showAddParticipantModal}
                currentParticipants={participants}/>
        </Page>
    )

    function netTokenDeposits(tokenDeposits: ContractInfo<AssetDeposit>[]) {
        let netTokenDeposits: DepositInfo[] = []

        tokenDeposits.forEach(deposit => {
            const { account, asset } = deposit.contractData
            const token = netTokenDeposits.find(d => d.provider === account.provider && d.investor === account.owner)

            if (token) {
                return token.quantity += Number(asset.quantity)
            }

            return netTokenDeposits = [...netTokenDeposits, {investor: account.owner, provider: account.provider, quantity: Number(asset.quantity) }]
        })

        return netTokenDeposits
    }
}


const AllocationsChart = (props: { nettedTokenDeposits: DepositInfo[] }) => {
    if (props.nettedTokenDeposits.length === 0) {
        return null
    }
    return (
        <div className='allocations'>
            <DonutChart data={formatNetTokenDeposits(props.nettedTokenDeposits)}/>
        </div>
    )

    function formatNetTokenDeposits(tokens: DepositInfo[]): IDonutChartData[] {
        return tokens.map(t => {
            return {
                title: `${t.investor}@${t.provider}`,
                value: t.quantity,
                color: getDonutChartColor(tokens.indexOf(t))
            }
        })
    }
}

export default IssuedToken;
