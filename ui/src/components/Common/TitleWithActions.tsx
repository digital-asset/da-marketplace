import React from 'react';
import { useHistory } from 'react-router-dom';

import { Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AddPlusIcon } from '../../icons/icons';
import OverflowMenu, { OverflowMenuEntry } from '../../pages/page/OverflowMenu';

type Action = {
  path: string;
  label: string;
};

type Params = {
  addNewActions?: Action[];
  otherActions?: Action[];
  title: string;
};

const TitleWithActions: React.FC<Params> = ({ addNewActions, otherActions, title, children }) => {
  const history = useHistory();
  return (
    <div className="title-with-actions">
      <Header as="h2">{title}</Header>
      {addNewActions?.map(a => (
        <Link className="a2 with-icon" to={a.path}>
          <AddPlusIcon /> {a.label}
        </Link>
      ))}
      {otherActions?.map(a => (
        <Link to={a.path}>
          <Button className="ghost">{a.label}</Button>
        </Link>
      ))}
      <OverflowMenu>
        {[...(addNewActions || []), ...(otherActions || [])]?.map(a => (
          <OverflowMenuEntry label={a.label} onClick={() => history.push(a.path)} />
        ))}
      </OverflowMenu>
      {children}
    </div>
  );
};

export default TitleWithActions;
