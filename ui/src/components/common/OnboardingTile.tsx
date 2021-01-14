import React from 'react'
import { Grid } from 'semantic-ui-react'
import { MarketplaceLogoTitle } from '../../icons/Icons'

import './OnboardingTile.scss'

type TileProps = {
    header?: React.ReactElement;
    subtitle?: string;
}

export const Tile: React.FC<TileProps> = ({ children, subtitle, header }) => {
    return (
        <div className='onboarding-tile'>
            { !!header && <div className='tile-header'>{header}</div> }
            { !!subtitle && <p>{subtitle}</p> }
            <div className='onboarding-tile-content'>
                { children }
            </div>
        </div>
    )
}

type OnboardingTileProps = {
    tiles?: React.ReactElement[];
}

const OnboardingTile: React.FC<OnboardingTileProps> = ({ children, tiles }) => {
    return (
        <Grid className='onboarding-screen' textAlign='center' verticalAlign='middle'>
            <Grid.Row>
                <Grid.Column width={6}>
                    { children &&
                        <Tile header={<MarketplaceLogoTitle/>}>
                            <Grid.Row>{children}</Grid.Row>
                        </Tile> }
                    { tiles?.map(tile => <Grid.Row key={tile.key}>{tile}</Grid.Row>) }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default OnboardingTile;
