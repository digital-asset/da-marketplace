import classNames from 'classnames';
import React from 'react';

import { OpenMarketplaceLogo } from '../../icons/icons';

type Control = undefined | React.ReactElement | React.ReactElement[];

interface WidgetProps {
  className?: string;
  pageControls?: {
    left?: Control;
    right?: Control;
  };
  subtitle?: string | JSX.Element;
}

const Widget: React.FC<WidgetProps> = ({ children, className, pageControls, subtitle }) => {
  return (
    <div className={classNames('widget', className)}>
      <div className="page-controls">
        <div className="left">{pageControls?.left}</div>
        <div className="right">{pageControls?.right}</div>
      </div>

      <div className="widget-header">
        <h1 className="logo-header">
          <OpenMarketplaceLogo size="32" /> Daml Open Marketplace
        </h1>
        <h2>{subtitle}</h2>
      </div>

      <div className="widget-tile">{children}</div>
    </div>
  );
};

export default Widget;
