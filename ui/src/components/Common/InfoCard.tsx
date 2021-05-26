import React from 'react';
import { Header, List } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';

interface ICardInfo {
  label: string;
  data: string;
}

const InfoCard = (props: { title: string; info: ICardInfo[]; actions?: JSX.Element[] }) => (
  <Tile className="info-card">
    <Header as="h3">{props.title}</Header>
    <List>
      {props.info.map(i => (
        <List.Item key={i.label}>
          <Header as="h4">{i.label}:</Header> <p>{i.data}</p>
        </List.Item>
      ))}
    </List>
    {props.actions}
  </Tile>
);

export default InfoCard;
