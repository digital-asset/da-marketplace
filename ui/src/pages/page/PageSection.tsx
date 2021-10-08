import classNames from 'classnames';
import React from 'react';

type Props = {
  className?: string;
};

const PageSection: React.FC<Props> = ({ children, className }) => (
  <div className={classNames('page-section', className)}>{children}</div>
);

export default PageSection;
