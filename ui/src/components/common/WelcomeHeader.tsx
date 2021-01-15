import React from 'react'
import { Header } from 'semantic-ui-react'

import { OpenMarketplaceLogo } from '../../icons/Icons'

import './WelcomeHeader.scss'

const WelcomeHeader: React.FC = () => (
    <div className="welcome-header">
        <OpenMarketplaceLogo size='48'/>
        <div className="welcome-header-row">
            <Header as='h2'>
                Welcome to the <span className='h2 bold'>DAML Open Marketplace</span>
            </Header>
            <p className='p2'>An app written in <b><a href='https://daml.com'>DAML</a></b> and deployed using <b><a href='https://projectdabl.com'>project:DABL</a></b></p>
        </div>
    </div>
)


export default WelcomeHeader;
