import React, { useState } from 'react'
import { Button, Header } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQueries } from '@daml/react'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import { AddPlusIcon } from '../../icons/Icons'

import { wrapDamlTuple, RegisteredInvestorInfo,makeContractInfo } from './damlTypes'

import { useOperator } from './common'
import AddRegisteredPartyModal from './AddRegisteredPartyModal'
import { getAbbreviation } from '../common/utils';
import { useRegistryLookup } from '../common/RegistryLookup';

type Props = {
    registeredInvestors: RegisteredInvestorInfo[];
}

const RequestInvestorRelationship: React.FC<Props> = ({ registeredInvestors }) => {
    const [ showAddRelationshipModal, setShowAddRelationshipModal ] = useState(false);

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useOperator();

    const investorMap = useRegistryLookup().investorMap;

    const exchangeParticipants = useStreamQueries(ExchangeParticipant, () => [], [], (e) => {
        console.log("Unexpected close from exchangeParticipant: ", e);
    }).contracts.map(makeContractInfo);
    const rows = exchangeParticipants.map(relationship => {
        const custodian = investorMap.get(relationship.contractData.exchParticipant);

        if (!custodian) {
            return null
        }

        return (
            <div className='relationship-row' key={relationship.contractId}>
                <div className='default-profile-icon'>
                    {getAbbreviation(custodian.name)}
                </div>
                <div className='relationship-info'>
                    <Header className='name' as='h4'>{custodian.name}</Header>
                    <p className='p2'>{custodian?.investor}</p>
                </div>
            </div>
        )
    });
    const handleExchParticipantInviteSubmit = async (party: string[]) => {
        const choice = Exchange.Exchange_InviteParticipant;
        const key = wrapDamlTuple([operator, exchange]);
        const args = { exchParticipant: party[0] };

        await ledger.exerciseByKey(choice, key, args);
    }

    const partyOptions = registeredInvestors.map(d => {
        return {
            text: `${d.contractData.name}`,
            value: d.contractData.investor
        }
    })

    return (
        <>
            {rows}
            <Button
                disabled={partyOptions.length === 0}
                className='profile-link add-relationship'
                onClick={()=> setShowAddRelationshipModal(true)}>
                    <AddPlusIcon/> <a>Add Investor</a>
                    {partyOptions.length === 0 && <i className='disabled'>All registered investors have been added</i>}
            </Button>
            {showAddRelationshipModal &&
                <AddRegisteredPartyModal
                    title='Add Custodian'
                    partyOptions={partyOptions}
                    onRequestClose={() => setShowAddRelationshipModal(false)}
                    multiple={false}
                    onSubmit={handleExchParticipantInviteSubmit}/>
            }
        </>
    )
}

export default RequestInvestorRelationship;
