import React from 'react'
import { Grid, Header } from 'semantic-ui-react'

import { ChatFaceIcon } from '../../icons/Icons'

import './OnboardingTile.css'

type Props = {
    subtitle?: string;
}

const OnboardingTile: React.FC<Props> = ({ children, subtitle }) => {
    return (
        <Grid className='onboarding-tile' textAlign='center' verticalAlign='middle'>
            <Grid.Row>
                <Grid.Column width={8} className='onboarding-tile-content'>
                    <Header as='h3' textAlign='center'>
                        <Header.Content>
                            <ChatFaceIcon/> Welcome to the DABL Social Marketplace
                        </Header.Content>
                    </Header>

                    <Header as='h4' textAlign='center'>
                        <Header.Content>
                            { subtitle }
                        </Header.Content>
                    </Header>

                    { children }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default OnboardingTile;
