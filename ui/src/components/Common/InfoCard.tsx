import React from 'react';
import { Header, List } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';

interface ICardInfo {
  label: string;
  data: string;
}

const InfoCard = (props: { title: string; info: ICardInfo[] }) => (
  <Tile className="info-card">
    <Header as="h3">{props.title}</Header>
    <List>
      {props.info.map(i => (
        <List.Item>
          <Header as="h4">{i.label}:</Header> <p>{i.data}</p>
        </List.Item>
      ))}
    </List>
  </Tile>
);

export default InfoCard;
