import React, {useState} from 'react'
import { Header, Form, Button } from 'semantic-ui-react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { UserIcon, AddPlusIcon } from '../../icons/Icons'
import { useContractQuery } from '../../websocket/queryStream'

import { depositSummary } from '../common/utils'
import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import MarginCall from './MarginCall'
import { CCP } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty'
import {CCPCustomer} from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterpartyCustomer'
import {CCPCustomerInfo, wrapDamlTuple, TokenInfo} from '../common/damlTypes'
import { useParty, useLedger } from '@daml/react'
import {useOperator} from '../common/common'
import AddRegisteredPartyModal from '../common/AddRegisteredPartyModal'
import {RegisteredInvestor, RegisteredExchange} from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import {Token} from '@daml.js/da-marketplace/lib/Marketplace/Token'
import {Party, Time} from '@daml/types'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'

type Props = {
    x: Party,
    exchanges: {
        party: any;
        label: string;
    }[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const Clients: React.FC<Props> = ({ exchanges, sideNav, onLogout }) => {
    const allDeposits = useContractQuery(AssetDeposit);
    const ccp = useParty();
    const ledger = useLedger();
    const operator = useOperator();
    const [ showAddRelationshipModal, setShowAddRelationshipModal ] = useState(false);

    const handleExchangeRelationshipRequest = async (party: string) => {
        const choice = CCP.CCP_RequestExchangeRelationship;
        const key = wrapDamlTuple([operator, ccp]);
        const args = { exchange: party };

        await ledger.exerciseByKey(choice, key, args);
    }

    const registeredExchanges = useContractQuery(RegisteredExchange);
    const partyOptions = registeredExchanges.map(d => {
        return {
            text: `${d.contractData.name}`,
            value: d.contractData.exchange
        }
    })

    const tableHeadings = ['Exchange']

    const tableRows = exchanges.map(exchange => {
        return [exchange.label]
    });

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon size='24'/> Clients</>}
        >
            <PageSection>
                <div className='clients'>
                    <div className='client-list'>
                        <Header as='h2'>Customers</Header>
                        <a className='a2' onClick={()=> setShowAddRelationshipModal(true)}>
                            <AddPlusIcon/> Add Investor
                        </a>
                        <StripedTable
                            headings={tableHeadings}
                            rows={tableRows}
                            emptyLabel='There are no customers.'/>
                    </div>
                    <MarginCall/>
                    {showAddRelationshipModal &&
                        <AddRegisteredPartyModal
                            title='Add Investor'
                            partyOptions={partyOptions}
                            onRequestClose={() => setShowAddRelationshipModal(false)}
                            multiple={false}
                            emptyMessage='All registered investors have been added'
                            onSubmit={handleExchangeRelationshipRequest}/>
                    }
                </div>
            </PageSection>
        </Page>
    )
}

type RequestFairValuesProps = {
    exchanges: {
        party: any;
        label: string;
    }[];
}

const RequestFairValues: React.FC<RequestFairValuesProps> = ({exchanges}) => {
    const [ exchange, setExchange ] = useState('');
    const [ currency, setCurrency ] = useState<TokenInfo>();
    const [ upTo, setUpTo ] = useState<Time>('');

    const operator = useOperator();
    const custodian = useParty();
    const ledger = useLedger();

    const allTokens: TokenInfo[] = useContractQuery(Token);

    const handleExchangeChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setExchange(result.value);
        }
    }
    const exchangeOptions = exchanges
        .map(exchange => ({
            key: exchange.party,
            text: exchange.label,
            value: exchange.party
        }));

    const handleRequestFairValue = async () => {
        if (!currency) {
            throw new Error('Currency not selected');
        }

        const args = {
            exchange: exchange,
            currency: currency.contractData.id,
            upTo
        };
        const key = wrapDamlTuple([operator, custodian]);
        await ledger.exerciseByKey(CCP.CCP_RequestFairValues, key, args);

        setExchange('');
        setCurrency(undefined)
        setUpTo('')
    }

    return (
        <div className='margin-call'>
            <FormErrorHandled onSubmit={handleRequestFairValue}>
                <Header as='h2'>Margin Call</Header>
                    <Form.Select
                        clearable
                        className='beneficiary-select'
                        label={<p>Exchange</p>}
                        value={exchange}
                        placeholder='Select...'
                        options={exchangeOptions}
                        onChange={handleExchangeChange}/>
                    <Form.Group className='inline-form-group'>
                        <ContractSelect
                            clearable
                            className='asset-select'
                            contracts={allTokens}
                            label='Currency'
                            placeholder='Select...'
                            value={currency?.contractId || ""}
                            getOptionText={token => token.contractData.id.label}
                            setContract={token => setCurrency(token)}/>
                    </Form.Group>
                    <Button
                        disabled={!exchange || !currency || !upTo}
                        content='Create Margin Call'
                        className='ghost'/>
            </FormErrorHandled>
        </div>
    )
}

export default MarginCall;

export default Clients;
