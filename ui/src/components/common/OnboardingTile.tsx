import React from 'react'
import { Grid } from 'semantic-ui-react'

import './OnboardingTile.scss'
import WelcomeHeader from './WelcomeHeader'

type TileProps = {
    header?: React.ReactElement;
    subtitle?: string;
}

export const Tile: React.FC<TileProps> = ({ children, subtitle, header }) => {
    return (
        <div className='onboarding-tile-content'>
            { !!header && <div className='tile-header'>{header}</div> }
            { !!subtitle && <p>{subtitle}</p> }
            { children }
        </div>
    )
}

type OnboardingTileProps = {
    tiles?: React.ReactElement[];
}

const OnboardingTile: React.FC<OnboardingTileProps> = ({ children, tiles }) => {
    return (
        <Grid className='onboarding-tile' textAlign='center' verticalAlign='middle'>
            <Grid.Row>
                <Grid.Column width={8}>
                    { children && <Tile header={<WelcomeHeader/>}><Grid.Row>{children}</Grid.Row></Tile> }
                    { tiles?.map(tile => <Grid.Row key={tile.key}>{tile}</Grid.Row>) }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default OnboardingTile;
