import React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import binaryOptionImage from '../../images/binary-option.png';
import convertibleNoteImage from '../../images/convertible-note.png';
import Tile from '../../components/Tile/Tile';

const NewComponent = ({ history }: RouteComponentProps) => {
  return (
    <div className="origination-new">
      <NavLink to="/app/registry/instruments/new/base">
        <Tile header={<h2>Base Instrument</h2>}>
          <p>Create a simple instrument with no claims</p>
        </Tile>
      </NavLink>

      <NavLink to="/app/registry/instruments/new/binaryoption">
        <Tile header={<img height="100px" src={binaryOptionImage} />}>
          <h2>Binary Option</h2>
          <p>Create a binary option instrument</p>
        </Tile>
      </NavLink>

      <NavLink to="/app/registry/instruments/new/convertiblenote">
        <Tile header={<img height="100px" src={convertibleNoteImage} />}>
          <h2>Convertible Note</h2>
          <p>Create a convertible note</p>
        </Tile>
      </NavLink>
    </div>
  );
};

export const New = withRouter(NewComponent);
