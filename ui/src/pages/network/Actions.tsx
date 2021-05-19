import React from 'react';
import Tile from '../../components/Tile/Tile';
import { Button, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

type Action = {
  path: string;
  label: string;
};

type Params = {
  actions: Action[];
  title: string;
};

export const ActionTile: React.FC<Params> = ({ actions, title, children }) => {
  return (
    <div className="action-tile">
      <Header as="h5">{title || ''} Actions</Header>
      <Tile>
        <div className="action-row">
          <Button.Group>
            {actions.map(a => (
              <Link to={a.path}>
                <Button floated="left" className="ghost">
                  {a.label}
                </Button>
              </Link>
            ))}
            {children}
          </Button.Group>
        </div>
      </Tile>
    </div>
  );
};
