import React from 'react';

import { Button } from 'semantic-ui-react';

import { NavLink } from 'react-router-dom';

import { MenuItems } from './QuickSetup';
import classNames from 'classnames';

interface QuickSetupPageProps {
  className?: string;
  nextItem?: MenuItems;
  nextDisabled?: boolean;
  title?: string;
}

const QuickSetupPage: React.FC<QuickSetupPageProps> = ({
  children,
  nextItem,
  nextDisabled,
  className,
  title,
}) => {
  return (
    <div className={classNames('setup-page', className)}>
      <div className="page-content">
        {!!title && <h4>{title}</h4>}
        {children}
      </div>

      {nextItem ? (
        nextDisabled ? (
          <Button disabled className="ghost next">
            Next
          </Button>
        ) : (
          <NavLink to={`${nextItem}`} className="button ghost next">
            <Button className="ghost next">Next</Button>
          </NavLink>
        )
      ) : null}
    </div>
  );
};

export default QuickSetupPage;
