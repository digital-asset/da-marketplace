import React from 'react';
import { Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AddPlusIcon } from '../../icons/icons';

type Action = {
  path: string;
  label: string;
};

type Params = {
  actions?: Action[];
  title: string;
};

const TitleWithActions: React.FC<Params> = ({ actions, title, children }) => {
  return (
    <div className="title-with-actions">
      <Header as="h2">{title}</Header>
      {actions?.map(a => (
        <Link className="a2 with-icon" to={a.path}>
          <AddPlusIcon /> {a.label}
        </Link>
      ))}
      {children}
    </div>
  );
};

export default TitleWithActions;
