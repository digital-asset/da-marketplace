import React, { useState } from 'react'

import { useParty, useLedger } from '@daml/react'

import { Header } from 'semantic-ui-react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { UserIcon, AddPlusIcon} from '../../icons/Icons'

import { useContractQuery } from '../../websocket/queryStream'

import { wrapDamlTuple, ContractInfo } from '../common/damlTypes'
import { useOperator } from '../common/common'
import AddRegisteredPartyModal from '../common/AddRegisteredPartyModal'
import { depositSummary } from '../common/utils'
import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
    registeredInvestors: ContractInfo<RegisteredInvestor>[];
    showNotificationAlert?: boolean;
    handleNotificationAlert?: () => void;
}

const ExchangeParticipants: React.FC<Props> = ({ sideNav, onLogout, registeredInvestors, showNotificationAlert, handleNotificationAlert }) => {
    const [ showAddRelationshipModal, setShowAddRelationshipModal ] = useState(false);

    const allDeposits = useContractQuery(AssetDeposit);
    const exchangeParticipants = useContractQuery(ExchangeParticipant);
    const activeOrders = useContractQuery(Order);

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useOperator();

    const handleExchParticipantInviteSubmit = async (investors: string[]) => {
        const choice = Exchange.Exchange_InviteParticipant;
        const key = wrapDamlTuple([operator, exchange]);

        // TO-DO: Modify choice to take in a list of parties directly. Got tricky with return types.
        await ledger.exerciseByKey(choice, key, { exchParticipant: investors[0] });
    }

    const partyOptions = registeredInvestors.map(d => {
        return {
            text: `${d.contractData.name}`,
            value: d.contractData.investor
        }
    })

    const rows = exchangeParticipants.map(participant => {
        const { exchange, exchParticipant } = participant.contractData;

        const activeOrderCount = activeOrders.filter(o => o.contractData.exchange === exchange && o.contractData.exchParticipant === exchParticipant).length

        const investorDeposits = allDeposits.filter(deposit => deposit.contractData.account.owner === exchParticipant);

        return [exchParticipant, activeOrderCount.toString(), '-', depositSummary(investorDeposits).join(',') || '-']
    });

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon size='24'/>Investors</>}
            showNotificationAlert={showNotificationAlert}
            handleNotificationAlert={handleNotificationAlert}
        >
            <PageSection>
                <div className='exchange-participants'>
                    <div className='title'>
                        <Header as='h2'>Exchange Participants</Header>
                        <a className='a2' onClick={()=> setShowAddRelationshipModal(true)}>
                            <AddPlusIcon/> Add Investor
                        </a>
                    </div>
                    <StripedTable
                        headings={['Id', 'Active Orders', 'Volume Traded (USD)', 'Amount Committed']}
                        rows={rows}/>
                    {showAddRelationshipModal &&
                        <AddRegisteredPartyModal
                            title='Add Investor'
                            multiple={false} // Keep single select for now
                            partyOptions={partyOptions}
                            onRequestClose={() => setShowAddRelationshipModal(false)}
                            emptyMessage='All registered investors have been added'
                            onSubmit={handleExchParticipantInviteSubmit}/>
                    }
                </div>
            </PageSection>
        </Page>
    )
}

export default ExchangeParticipants;
