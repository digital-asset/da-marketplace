import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getName } from "../../config";
import { Listing } from "@daml.js/da-marketplace/lib/Marketplace/Listing/Model";
import {CreateEvent} from "@daml/ledger";
import Tile from "../../components/Tile/Tile";
import {Button, Header, Icon} from "semantic-ui-react";
import StripedTable from "../../components/Table/StripedTable";

type Props = {
  listings : Readonly<CreateEvent<Listing, any, any>[]>
}

const MarketsComponent : React.FC<RouteComponentProps & Props> = ({ history, listings } : RouteComponentProps & Props) => {

  return (
    <div>
      <Tile header={<h2>Actions</h2>}>
        <Button className='ghost' onClick={() => history.push("/app/listing/new")}>New Market</Button>
      </Tile>
      <Header as='h2'>Markets</Header>
      <StripedTable
        headings={[
          'Provider',
          'Client',
          'Symbol',
          'Traded Asset',
          'Quoted Asset',
          'Details',
        ]}
        rows={
          listings.map(c => [
            getName(c.payload.provider),
            getName(c.payload.customer),
            c.payload.listingId,
            c.payload.tradedAssetId.label,
            c.payload.quotedAssetId.label,
            <Icon name='angle right' link onClick={() => history.push("/app/trading/markets/" + c.contractId.replace("#", "_"))} />
          ])
        }
      />
    </div>
  );
};

export const Markets = withRouter(MarketsComponent);