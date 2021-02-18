import React from 'react'
import { Header } from 'semantic-ui-react'

import { UserIcon } from '../../icons/Icons'

import { DerivativeInfo } from './damlTypes'
import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

type Props = {
    derivatives: DerivativeInfo[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const DerivativeList: React.FC<Props> = ({ derivatives, sideNav, onLogout }) => {

    const tableHeadings = ['Description']

    const tableRows = derivatives.map(derivative => {
        // TODO : show fair values
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
