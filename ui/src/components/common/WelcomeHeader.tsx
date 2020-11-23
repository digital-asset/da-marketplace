import React from 'react'
import { Header } from 'semantic-ui-react'

import { LogoIcon } from '../../icons/Icons'

import './WelcomeHeader.css'

const WelcomeHeader: React.FC = () => (
    <>
        <LogoIcon/>
        <div className="welcome-header">
            <div>
                <Header as='h3' className='welcome-header-row'>
                    <Header.Content>
                        Welcome to the DABL Social Marketplace
                    </Header.Content>
                </Header>
                <p>An app written in <a href='https://daml.com'>DAML</a> and deployed using <a href='https://projectdabl.com'>project:DABL</a></p>
            </div>
        </div>
    </>
)


export default WelcomeHeader;
