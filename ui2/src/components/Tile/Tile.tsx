import React from 'react';
import { Header } from 'semantic-ui-react';
import { OpenMarketplaceLogo } from '../../icons/icons';

export const logoHeader = (
  <Header className='dark logo-header'>
    <OpenMarketplaceLogo size='32'/> Daml Open Marketplace
  </Header>
);

type TileProps = {
  header?: React.ReactElement;
  key?: string | number;
  subtitle?: string;
}

export const Tile: React.FC<TileProps> = ({ children, subtitle, header }) => {
  return (
    <div className='tile'>
      { !!header && <div className='tile-header'>{header}</div> }
      { !!subtitle && <p className='subtitle'>{subtitle}</p> }
      <div className='tile-content'>
        { children }
      </div>
    </div>
  )
}

export default Tile;
