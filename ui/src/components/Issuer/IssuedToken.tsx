import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Header, List, Button } from 'semantic-ui-react'

import { useLedger, useParty } from '@daml/react'

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import {
    RegisteredCustodian,
    RegisteredIssuer,
    RegisteredInvestor,
    RegisteredExchange,
    RegisteredBroker
} from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { GlobeIcon, LockIcon, IconChevronDown, IconChevronUp, AddPlusIcon } from '../../icons/Icons'
import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

import { ContractInfo, wrapTextMap } from '../common/damlTypes'
import Page from '../common/Page'
import PageSection from '../common/PageSection'
import DonutChart, { getDonutChartColor, IDonutChartData } from '../common/DonutChart'
import { getPartyLabel, IPartyInfo } from '../common/utils'
import AddRegisteredPartyModal from '../common/AddRegisteredPartyModal'
import StripedTable from '../common/StripedTable'

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
    const [ showAddRegisteredPartyModal, setShowAddRegisteredPartyModal ] = useState(false)

    const { tokenId } = useParams<{tokenId: string}>()

    const history = useHistory()
    const ledger = useLedger()
    const party = useParty()

    const token = useContractQuery(Token).find(c => c.contractId === decodeURIComponent(tokenId))
    const tokenDeposits = useContractQuery(AssetDeposit)
    .filter(deposit =>
        deposit.contractData.asset.id.label === token?.contractData.id.label &&
        deposit.contractData.asset.id.version === token?.contractData.id.version
    );

    const allRegisteredParties = [
        useContractQuery(RegisteredCustodian, AS_PUBLIC)
            .map(rc => ({ contractId: rc.contractId, contractData: rc.contractData.custodian })),
        useContractQuery(RegisteredIssuer, AS_PUBLIC)
            .map(ri => ({ contractId: ri.contractId, contractData: ri.contractData.issuer })),
        useContractQuery(RegisteredInvestor, AS_PUBLIC)
            .map(ri => ({ contractId: ri.contractId, contractData: ri.contractData.investor })),
        useContractQuery(RegisteredExchange, AS_PUBLIC)
            .map(re => ({ contractId: re.contractId, contractData: re.contractData.exchange })),
        useContractQuery(RegisteredBroker, AS_PUBLIC)
            .map(rb => ({ contractId: rb.contractId, contractData: rb.contractData.broker }))
        ].flat()

    const participants = Object.keys(token?.contractData.observers.textMap || [])

    const partyOptions = allRegisteredParties.filter(d => !Array.from(participants || []).includes(d.contractData))
        .map(d => {
            return {
                text: `${d.contractData}`,
                value: d.contractData
            }
        })

    const isPublic = !!token?.contractData.isPublic

    const nettedTokenDeposits = netTokenDeposits(tokenDeposits)
    const totalAllocatedQuantity = nettedTokenDeposits.length > 0 ? nettedTokenDeposits.reduce((a, b) => +a + +b.quantity, 0) : 0

    const StripedTableRows = nettedTokenDeposits.map(deposit =>
        [deposit.investor, deposit.provider, deposit.quantity.toString(), `${((deposit.quantity/totalAllocatedQuantity)*100).toFixed(1)}%`])
    const StripedTableHeaders = ['Investor', 'Provider', 'Amount', 'Percentage Owned']

    const baseUrl = history.location.pathname.substring(0, history.location.pathname.lastIndexOf('/'))

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
                                <Button className='ghost smaller' onClick={() => setShowAddRegisteredPartyModal(true)}>
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
                    <StripedTable
                        headings={StripedTableHeaders}
                        rows={StripedTableRows}/>
                    {/* <AllocationsChart nettedTokenDeposits={nettedTokenDeposits}/> */}
                </div>
            </PageSection>
            {showAddRegisteredPartyModal &&
                <AddRegisteredPartyModal
                    multiple
                    onRequestClose={() => setShowAddRegisteredPartyModal(false)}
                    onSubmit={(parties) => submitAddParticipant(parties)}
                    title='Add Participants'
                    partyOptions={partyOptions}/>}
        </Page>
    )

    async function submitAddParticipant(selectedParties: string[]) {
        const tokenId = token?.contractData.id

        if (!token?.contractData.id) {
            return
        }

        const newObservers = wrapTextMap([...participants, ...selectedParties])

        await ledger.exerciseByKey(Token.Token_AddObservers, tokenId, { party, newObservers })
            .then(resp => history.push(`${baseUrl}/${resp[0]}`))

        setShowAddRegisteredPartyModal(false)
    }

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

// eslint-disable-next-line
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
