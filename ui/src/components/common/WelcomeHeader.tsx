import React from 'react'
import { Header } from 'semantic-ui-react'

import { OpenMarketplaceLogo } from '../../icons/Icons'

const WelcomeHeader: React.FC = () => (
    <div className="welcome-header">
        <OpenMarketplaceLogo size='48'/>
        <div className="welcome-header-row">
            <div className='title'>
                <Header as='h1'>
                    Welcome to the
                </Header>
                <Header className='bold' as='h1'>
                    DAML Open Marketplace
                </Header>
            </div>
            <p>An app written in <a className='a2 bold' href='https://daml.com'>Daml</a> and deployed using <a className='a2 bold' href='https://hub.daml.com'>Daml Hub</a></p>
        </div>
    </div>
)


export default WelcomeHeader;
