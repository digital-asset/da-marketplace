import React, {useState} from 'react'
import { useParty, useLedger } from '@daml/react'
import { Header } from 'semantic-ui-react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { CCP } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty'
import { CCPCustomer } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterpartyCustomer'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { UserIcon, AddPlusIcon } from '../../icons/Icons'
import { useContractQuery, AS_PUBLIC } from '../../websocket/queryStream'

import { depositSummary } from '../common/utils'
import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import { useOperator } from '../common/common'
import { wrapDamlTuple } from '../common/damlTypes'

import { useCCPCustomerNotifications } from './CCPCustomerNotifications'
import MarginCall from './MarginCall'
import MarkToMarketCalc from './MarkToMarketCalc'
import AddRegisteredPartyModal from '../common/AddRegisteredPartyModal'

type Props = {
    members: {
        party: any;
        label: string;
    }[];
    sideNav: React.ReactElement;
    onLogout: () => void;
    showNotificationAlert?: boolean;
    handleNotificationAlert?: () => void;
}

const Members: React.FC<Props> = ({ members, sideNav, onLogout, showNotificationAlert, handleNotificationAlert }) => {
    const allDeposits = useContractQuery(AssetDeposit);
    const ccp = useParty();
    const ledger = useLedger();
    const operator = useOperator();
    const [ showAddRelationshipModal, setShowAddRelationshipModal ] = useState(false);

    const notifications = useCCPCustomerNotifications();

    const handleCCPCustomerInviteSubmit = async (members: string[]) => {
        const choice = CCP.CCP_InviteCustomer;
        const key = wrapDamlTuple([operator, ccp]);

        await Promise.all(members.map(ccpCustomer => {
            return ledger.exerciseByKey(choice, key, {
                ccpCustomer
            })
        }))
    }

    const registeredInvestors = useContractQuery(RegisteredInvestor, AS_PUBLIC);
    const partyOptions = registeredInvestors.map(d => {
        return {
            text: `${d.contractData.name}`,
            value: d.contractData.investor
        }
    })

    const tableHeadings = ['Name', 'In Good Standing', 'Clearing Account', 'Margin Account']
    const ccpCustomers = useContractQuery(CCPCustomer);

    const tableRows = members.map(member => {
        const currentCCPCustomers = ccpCustomers.filter(ccpCustomer => ccpCustomer.contractData.ccpCustomer === member.party)
        const marginDepositCids = currentCCPCustomers
            .flatMap(ccpCustomer => {
                return ccpCustomer.contractData.marginDepositCids
            });
        const customerName = member.label
        const allCustomerDeposits = allDeposits.filter(deposit => deposit.contractData.account.owner === member.party)
        const marginDeposits = allCustomerDeposits
                .filter(deposit => marginDepositCids.includes(deposit.contractId));
        const clearingDeposits = allCustomerDeposits.filter(cd => !marginDepositCids.includes(cd.contractId));
        const inGoodStanding = currentCCPCustomers[0].contractData.inGoodStanding ? "Yes" : "No";
        return [customerName, inGoodStanding, depositSummary(clearingDeposits).join(','), depositSummary(marginDeposits).join(',')]
    });

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon size='24'/> Members</>}
            showNotificationAlert={showNotificationAlert}
            handleNotificationAlert={handleNotificationAlert}
        >
            <PageSection>
                <div className='members'>
                    <div className='member-list'>
                        {notifications.length > 0 && <Header as='h2'>Notifications</Header>}
                        {notifications}
                        <Header as='h2'>Clearing Members</Header>
                        <a className='a2' onClick={()=> setShowAddRelationshipModal(true)}>
                            <AddPlusIcon/> Add Investor
                        </a>
                        <StripedTable
                            headings={tableHeadings}
                            rows={tableRows}
                            emptyLabel='There are no customers.'/>
                    </div>
                    <MarginCall allCustomers={members}/>
                    <MarkToMarketCalc allCustomers={members}/>
                    {showAddRelationshipModal &&
                        <AddRegisteredPartyModal
                            multiple
                            title='Add Member'
                            partyOptions={partyOptions}
                            onRequestClose={() => setShowAddRelationshipModal(false)}
                            emptyMessage='All registered investors have been added'
                            onSubmit={handleCCPCustomerInviteSubmit}/>
                    }
                </div>
            </PageSection>
        </Page>
    )
}

export default Members;
