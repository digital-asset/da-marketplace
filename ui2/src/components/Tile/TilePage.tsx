import React from 'react';
import { Grid } from 'semantic-ui-react';
import Tile, { logoHeader } from './Tile';

type TilePageProps = {
  tiles?: React.ReactElement[];
}

const TilePage: React.FC<TilePageProps> = ({ children, tiles }) => {
  return (
    <Grid className='tile-page' textAlign='center' verticalAlign='middle'>
      <Grid.Row>
        <Grid.Column>
          { children &&
              <Tile header={logoHeader}>
                  <Grid.Row>{children}</Grid.Row>
              </Tile> }
          { tiles?.map(tile => <Grid.Row key={tile.key}>{tile}</Grid.Row>) }
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default TilePage;
