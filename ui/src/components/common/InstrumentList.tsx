import React from 'react'
import { Header } from 'semantic-ui-react'

import { FairValue } from '@daml.js/da-marketplace/lib/Marketplace/Derivative'

import { UserIcon } from '../../icons/Icons'
import { useContractQuery } from '../../websocket/queryStream'

import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import { MarketPairInfo } from './damlTypes'

import { useRegistryLookup } from './RegistryLookup'
import { RequestFairValues } from '../CCP/ExchangeRelationships'

type Props = {
    exchanges: {
        party: any;
        label: string;
    }[];
    instruments: MarketPairInfo[];
    sideNav: React.ReactElement;
    onLogout: () => void;
    showNotificationAlert?: boolean;
    handleNotificationAlert?: () => void;
}

const InstrumentList: React.FC<Props> = ({ exchanges, instruments, sideNav, onLogout, showNotificationAlert, handleNotificationAlert }) => {

    const { exchangeMap } = useRegistryLookup();
    const tableHeadings = ['Description', 'Exchange', 'Current Fair Value']
    const allFairValues = useContractQuery(FairValue);

    const tableRows = instruments.map(instrument => {
        const fairValues = allFairValues.filter(fv => fv.contractData.instrumentId.label === instrument?.contractData.id.label);
        const price = fairValues[fairValues.length - 1] ? fairValues[fairValues.length - 1].contractData.price : "No FV";
        const exchangeParty = instrument.contractData.exchange;
        const exchange = exchangeMap.get(exchangeParty)?.name || exchangeParty;
        return [instrument.contractData.description, exchange, price]
    });

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon size='24'/>Instruments</>}
            showNotificationAlert={showNotificationAlert}
            handleNotificationAlert={handleNotificationAlert}
        >
            <PageSection>
                <div className='members'>
                    <div className='member-list'>
                        <Header as='h2'>Instruments</Header>
                        <StripedTable
                            headings={tableHeadings}
                            rows={tableRows}
                            emptyLabel='There are no instruments.'/>
                    </div>
                    <RequestFairValues exchanges={exchanges}/>
                </div>
            </PageSection>
        </Page>
    )
}

export default InstrumentList;
