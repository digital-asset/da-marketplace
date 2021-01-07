import React from 'react'
import { Grid, Header } from 'semantic-ui-react'

import WelcomeHeader from './WelcomeHeader'

import './OnboardingTile.css'

type Props = {
    subtitle?: string;
}

const OnboardingTile: React.FC<Props> = ({ children, subtitle }) => {
    return (
        <Grid className='onboarding-tile' textAlign='center' verticalAlign='middle'>
            <Grid.Row>
                <Grid.Column width={8} className='onboarding-tile-content'>
                    <Header textAlign='center'>
                        <Header.Content>
                            <WelcomeHeader/>
                        </Header.Content>
                    </Header>
                    { !!subtitle && <p> {subtitle} </p>  }
                    { children }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default OnboardingTile;
