import React from 'react';
import Tile from '../../components/Tile/Tile';
import { Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

type Action = {
  path: string;
  label: string;
};

type Params = {
  actions: Action[];
};

export const ActionTile: React.FC<Params> = ({ actions }) => {
  return (
    <Tile header={<h4>Actions</h4>}>
      <div className="action-row">
        <Button.Group>
          {actions.map(a => (
            <NavLink to={a.path}>
              <Button floated="left" className="ghost">
                {a.label}
              </Button>
            </NavLink>
          ))}
        </Button.Group>
      </div>
    </Tile>
  );
};
