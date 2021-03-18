import React from "react";
import { Link } from "react-router-dom";
import networkImage from "./images/network.jpg";
import custodyImage from "./images/custody.jpg";
import registryImage from "./images/registry.png";
import issuanceImage from "./images/issuance.jpg";
import distributionImage from "./images/distribution.png";
import listingImage from "./images/listing.jpg";
import tradingImage from "./images/trading.jpg";
import LandingPage from "./pages/page/LandingPage";
import Tile from "./components/Tile/Tile";

type ServiceTileProps = {
  name: string,
  description: string,
  image: string,
  url: string
}

const ServiceTile: React.FC<ServiceTileProps> = ({ name, description, image, url }) => {
  return (
    <Tile className='service-tile'>
      <Link to={url}>
        <img src={image} alt={name}></img>
        <div className='text'>
          <h4>{name}</h4>
          <p>{description}</p>
        </div>
      </Link>
    </Tile>
  )
}

export default function Apps() {
  return (
    <LandingPage className='apps'>
      <h1>Services</h1>
      <div className='services'>
        <ServiceTile
          name='Network'
          description='Manage your network and relationships'
          url='/apps/network/custody'
          image={networkImage}/>

        <ServiceTile
          name='Custody'
          description='Manage your custodial services'
          url='/apps/custody/accounts'
          image={custodyImage}/>

        <ServiceTile
          name='Origination'
          description='Manage your originations'
          url='/apps/registry/instruments'
          image={registryImage}/>

        <ServiceTile
          name='Issuance'
          description='Manage your issuances'
          url='/apps/issuance/issuances'
          image={issuanceImage}/>

        <ServiceTile
          name='Distribution'
          description='Manage your primary distributions'
          url='/apps/distribution/auctions'
          image={distributionImage}/>

        <ServiceTile
          name='Listing'
          description='Manage your exchange listings'
          url='/apps/listing/listings'
          image={listingImage}/>

        <ServiceTile
          name='Trading'
          description='Manage your trading activities'
          url='/apps/trading/markets'
          image={tradingImage}/>
      </div>
    </LandingPage>
  );
}
