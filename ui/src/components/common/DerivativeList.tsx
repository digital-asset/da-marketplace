import React, {useState} from 'react'
import { Header, Divider } from 'semantic-ui-react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { UserIcon, AddPlusIcon } from '../../icons/Icons'
import { useContractQuery } from '../../websocket/queryStream'

import { depositSummary } from '../common/utils'
import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import {DerivativeInfo} from './damlTypes'
import {FairValue} from '@daml.js/da-marketplace/lib/Marketplace/Derivative'

type Props = {
    derivatives: DerivativeInfo[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const DerivativeList: React.FC<Props> = ({ derivatives, sideNav, onLogout }) => {

    const tableHeadings = ['Description']
    // const allFairValues = useContractQuery(FairValue);

    const tableRows = derivatives.map(derivative => {
        // const fairValues = allFairValues.filter(fv => fv.contractData.instrumentId.label === derivative?.contractData.id.label);
        // const price = fairValues[0] ? fairValues[0].contractData.price : "No FV";
        return [derivative.contractData.description]
    });

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon size='24'/>Derivatives</>}
        >
            <PageSection>
                <div className='clients'>
                    <div className='client-list'>
                        <Header as='h2'>Derivatives</Header>
                        <StripedTable
                            headings={tableHeadings}
                            rows={tableRows}
                            emptyLabel='There are no derivatives.'/>
                    </div>
                </div>
            </PageSection>
        </Page>
    )
}

export default DerivativeList;
