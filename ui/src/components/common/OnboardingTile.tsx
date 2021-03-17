import classNames from 'classnames'
import React from 'react'
import { Grid, Header } from 'semantic-ui-react'
import { OpenMarketplaceLogo } from '../../icons/Icons'

type TileProps = {
    header?: React.ReactElement;
    subtitle?: string;
    className?: string;
}

export const Tile: React.FC<TileProps> = ({ children, subtitle, header, className }) => {
    return (
        <div className={`onboarding-tile ${className}`}>
            { !!header && <div className='tile-header'>{header}</div> }
            { !!subtitle && <p className='subtitle'>{subtitle}</p> }
            <div className='onboarding-tile-content'>
                { children }
            </div>
        </div>
    )
}

type OnboardingTileProps = {
    tiles?: React.ReactElement[];
}

export const logoHeader = <Header className='dark logo-header'><OpenMarketplaceLogo size='32'/> Daml Open Marketplace</Header>

const OnboardingTile: React.FC<OnboardingTileProps> = ({ children, tiles }) => {
    return (
        <Grid className='onboarding-screen' textAlign='center' verticalAlign='middle'>
            <Grid.Row>
                <Grid.Column center>
                    { children &&
                        <Tile header={logoHeader}>
                            <Grid.Row>{children}</Grid.Row>
                        </Tile> }
                    { tiles?.map(tile => <Grid.Row key={tile.key}>{tile}</Grid.Row>) }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default OnboardingTile;
