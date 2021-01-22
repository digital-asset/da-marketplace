import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, List, Button } from 'semantic-ui-react'

import { useStreamQueries } from '@daml/react'

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { GlobeIcon, LockIcon, IconChevronDown, IconChevronUp, AddPlusIcon } from '../../icons/Icons'

import { makeContractInfo, ContractInfo} from '../common/damlTypes'
import Page from '../common/Page'
import PageSection from '../common/PageSection'
import DonutChart, { getDonutChartColor, IDonutChartData } from '../common/DonutChart'
import { getPartyLabel, IPartyInfo } from '../common/utils';
import AddParticipantModal from './AddParticipantModal'
import CapTable from '../common/CapTable'
import { useContractQuery } from '../../websocket/queryStream'

type DepositInfo = {
    investor: string,
    provider: string,
    quantity: number
}

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
    providers: IPartyInfo[],
    investors: IPartyInfo[]
}

const IssuedToken: React.FC<Props> = ({ sideNav, onLogout, providers, investors }) => {
    const [ showParticipants, setShowParticipants ] = useState(false)
    const [ showAddParticipantModal, setShowAddParticipantModal ] = useState(false)
    const { tokenId } = useParams<{tokenId: string}>()

    const token = useContractQuery(Token).find(c => c.contractId === decodeURIComponent(tokenId))

    const isPublic = !!token?.contractData.isPublic

    const tokenDeposits = useContractQuery(AssetDeposit)
        .filter(deposit =>
            deposit.contractData.asset.id.label === token?.contractData.id.label &&
            deposit.contractData.asset.id.version === token?.contractData.id.version
    );

    const participants = Object.keys(token?.contractData.observers.textMap || [])

    const nettedTokenDeposits = netTokenDeposits(tokenDeposits)
    const totalAllocatedQuantity = nettedTokenDeposits.length > 0 ? nettedTokenDeposits.reduce((a, b) => +a + +b.quantity, 0) : 0

    const capTableRows = nettedTokenDeposits.map(deposit =>
        [deposit.investor, deposit.provider, deposit.quantity.toString(), `${((deposit.quantity/totalAllocatedQuantity)*100).toFixed(1)}%`])
    const capTableHeaders = ['Investor', 'Provider', 'Amount', 'Percentage Owned']

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
                    <CapTable
                        headings={capTableHeaders}
                        rows={capTableRows}/>
                    {/* <AllocationsChart nettedTokenDeposits={nettedTokenDeposits}/> */}
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
            const provider = getPartyLabel(account.provider, providers)
            const investor = getPartyLabel(account.owner, investors)
            return netTokenDeposits = [...netTokenDeposits, {investor: investor.label, provider: provider.label, quantity: Number(asset.quantity) }]
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
