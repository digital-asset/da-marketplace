import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Header, List } from 'semantic-ui-react'

import { useLedger, useParty } from '@daml/react'

import { Derivative } from '@daml.js/da-marketplace/lib/Marketplace/Derivative'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import {
    RegisteredCustodian,
    RegisteredIssuer,
    RegisteredInvestor,
    RegisteredExchange,
    RegisteredBroker
} from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { GlobeIcon, LockIcon, IconChevronDown, IconChevronUp, AddPlusIcon } from '../../icons/Icons'
import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

import { wrapTextMap, damlSetValues, makeDamlSet } from '../common/damlTypes'
import Page from '../common/Page'
import PageSection from '../common/PageSection'
import AddRegisteredPartyModal from '../common/AddRegisteredPartyModal'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const IssuedDerivative: React.FC<Props> = ({ sideNav, onLogout }) => {
    const [ showParticipants, setShowParticipants ] = useState(false)
    const [ showAddRegisteredPartyModal, setShowAddRegisteredPartyModal ] = useState(false)

    const { derivativeId } = useParams<{derivativeId: string}>()

    const history = useHistory()
    const ledger = useLedger()
    const party = useParty()

    const derivative = useContractQuery(Derivative).find(c => c.contractId === decodeURIComponent(derivativeId))

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


    const isPublic = !!derivative?.contractData.isPublic
    const participants = !!derivative ? damlSetValues(derivative.contractData.observers) : []

    const partyOptions = allRegisteredParties.filter(d => !Array.from(participants || []).includes(d.contractData))
        .map(d => {
            return {
                text: `${d.contractData}`,
                value: d.contractData
            }
        })

    // TODO: Show all FairValues for derivative
    //
    // const fairValues = useContractQuery(FairValue).filter(fv => fv.contractData.instrumentId.label === derivative?.contractData.id.label);
    // const StripedTableRows = fairValues.map(fv => [fv.contractData.exchange, fv.contractData.upTo, fv.contractData.price]);
    // const StripedTableHeaders = ["Exchange", "Time", "Price"]

    const baseUrl = history.location.pathname.substring(0, history.location.pathname.lastIndexOf('/'))

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<Header as='h2'>{derivative?.contractData.id.label}</Header>}
            onLogout={onLogout}>
            <PageSection>
                <div className='issued-token'>
                    <div className='token-subheading'>
                        <Header as='h1'>{derivative?.contractData.description}</Header>
                        <div className='token-details'>
                            {isPublic ? <Header as='h3'> <GlobeIcon/> Public </Header> : <Header as='h3'> <LockIcon/> Private </Header>}
                            <Header as='h3'> Price Precision: {derivative?.contractData.pricePrecision} </Header>
                        </div>
                    </div>
                    {!isPublic &&
                        <div className='participants-viewer'>
                            <a className='a2' onClick={() => setShowParticipants(!showParticipants)}>
                                {showParticipants?
                                    <> Hide Participants <IconChevronUp/></>
                                    :
                                    <> View/Add Participants <IconChevronDown/></>
                                }
                            </a>
                            {showParticipants &&
                                <>
                                <div className='list-heading'>
                                    <p><b>Participants</b></p>
                                    <a className='a2' onClick={() => setShowAddRegisteredPartyModal(true)}>
                                        <AddPlusIcon/> Add Participant
                                    </a>
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
        const derivativeId = derivative?.contractData.id

        if (!derivative?.contractData.id) {
            return
        }

        const newObservers = makeDamlSet([...participants, ...selectedParties])

        await ledger.exerciseByKey(Token.Token_AddObservers, derivativeId, { party, newObservers })
            .then(resp => history.push(`${baseUrl}/${resp[0]}`))

        setShowAddRegisteredPartyModal(false)
    }
}

export default IssuedDerivative;
