import React from 'react';
import classNames from 'classnames';
import { Header } from 'semantic-ui-react';
import { OpenMarketplaceLogo } from '../../icons/icons';

const logoHeader = (
  <Header className="dark logo-header">
    <OpenMarketplaceLogo size="32" /> Daml Open Marketplace
  </Header>
);

type TileProps = {
  className?: string;
  header?: string;
  key?: string | number;
  dark?: boolean;
  thinGap?: boolean;
  subtitle?: string;
  showLogoHeader?: boolean;
};

const Tile: React.FC<TileProps> = ({
  children,
  className,
  dark,
  thinGap,
  subtitle,
  header,
  showLogoHeader,
}) => {
  return (
    <>
      <div className={classNames('tile', className, { dark, 'thin-gap': thinGap })}>
        {!!showLogoHeader && <div className="tile-header">{logoHeader}</div>}
        {!!header && <Header as="h3">{header}</Header>}
        {!!subtitle && <p className="subtitle">{subtitle}</p>}
        <div className="tile-content">{children}</div>
      </div>
    </>
  );
};

export default Tile;
