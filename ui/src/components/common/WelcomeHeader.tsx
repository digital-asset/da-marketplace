import React from 'react'
import { Header } from 'semantic-ui-react'

import { ChatFaceIcon } from '../../icons/Icons'

import './WelcomeHeader.css'

const WelcomeHeader: React.FC = () => (
    <div className="welcome-header">
        <Header>
            <Header.Content>
                <ChatFaceIcon/>
            </Header.Content>
        </Header>

        <Header as='h1'>
            <Header.Content>
                Welcome to the DABL Social Marketplace
            </Header.Content>
        </Header>

        <Header as='h3'>
            <Header.Content>
                An app written in <a href='https://daml.com'>DAML</a> and deployed using <a href='https://projectdabl.com'>project:DABL</a>
            </Header.Content>
        </Header>
    </div>
)


export default WelcomeHeader;
