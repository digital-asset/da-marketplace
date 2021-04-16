import React from 'react';
import classNames from 'classnames';
import { Header } from 'semantic-ui-react';
import { OpenMarketplaceLogo } from '../../icons/icons';

export const logoHeader = (
  <Header className="dark logo-header">
    <OpenMarketplaceLogo size="32" /> Daml Open Marketplace
  </Header>
);

type TileProps = {
  className?: string;
  header?: React.ReactElement;
  key?: string | number;
  dark?: boolean;
  thinGap?: boolean;
  subtitle?: string;
};

export const Tile: React.FC<TileProps> = ({
  children,
  className,
  dark,
  thinGap,
  subtitle,
  header,
}) => {
  return (
    <>
      {/* {!!header && <h4 className="tile-header">{header}</h4>} */}
      <div className={classNames('tile', className, { dark, 'thin-gap': thinGap })}>
        {!!header && <div className="tile-header">{header}</div>}
        {!!subtitle && <p className="subtitle">{subtitle}</p>}
        <div className="tile-content">{children}</div>
      </div>
    </>
  );
};

export default Tile;
