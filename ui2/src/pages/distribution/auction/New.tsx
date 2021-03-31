import React, { useEffect, useRef, useState } from "react";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import {IconButton} from "@material-ui/core";
import { transformClaim } from "../../../components/Claims/util";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AssetDeposit } from "@daml.js/da-marketplace/lib/DA/Finance/Asset";
import { Service, RequestCreateAuction, CreateAuctionRequest } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service";
import { CreateEvent } from "@daml/ledger";
import {ContractId, Party} from "@daml/types";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { render } from "../../../components/Claims/render";
import { AssetDescription } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription";
import {Button, Form, Header} from "semantic-ui-react";
import FormErrorHandled from "../../../components/Form/FormErrorHandled";
import {IconClose} from "../../../icons/icons";
import Tile from "../../../components/Tile/Tile";
import {ServicePageProps} from "../../common";

const NewComponent : React.FC<RouteComponentProps & ServicePageProps<Service>> = ({ history, services } : RouteComponentProps & ServicePageProps<Service>) => {
  const el1 = useRef<HTMLDivElement>(null);
  const el2 = useRef<HTMLDivElement>(null);

  const [ showAuctionedAsset, setShowAuctionedAsset ] = useState(false);
  const [ showQuotedAsset, setShowQuotedAsset ] = useState(false);

  const [ auctionedAssetLabel, setAuctionedAssetLabel ] = useState("");
  const [ quotedAssetLabel, setQuotedAssetLabel ] = useState("");
  const [ quantity, setQuantity ] = useState("");
  const [ floorPrice, setFloorPrice ] = useState("");
  const [ auctionId, setAuctionId ] = useState("");

  const ledger = useLedger();
  const party = useParty();
  const customerServices = services.filter(s => s.payload.customer === party);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(c => c.payload.assetId.version === "0");
  const auctionedAsset = assets.find(c => c.payload.assetId.label === auctionedAssetLabel);
  const quotedAsset = assets.find(c => c.payload.assetId.label === quotedAssetLabel);
  const deposits = useStreamQueries(AssetDeposit).contracts;
  const heldAssets = deposits.filter(c => c.payload.account.owner === party);
  const heldAssetLabels = heldAssets.map(c => c.payload.asset.id.label).filter((v, i, a) => a.indexOf(v) === i);
  const auctionRequests = useStreamQueries(CreateAuctionRequest).contracts;

  const canRequest = !!auctionedAssetLabel && !!auctionedAsset && !!quotedAssetLabel && !!quotedAsset && !!auctionId && !!quantity && !!floorPrice;

  useEffect(() => {
    if (!el1.current || !auctionedAsset) return;
    el1.current.innerHTML = "";
    const data = transformClaim(auctionedAsset.payload.claims, "root");
    render(el1.current, data);
  }, [el1, auctionedAsset, showAuctionedAsset]);

  useEffect(() => {
    if (!el2.current || !quotedAsset) return;
    el2.current.innerHTML = "";
    const data = transformClaim(quotedAsset.payload.claims, "root");
    render(el2.current, data);
  }, [el2, quotedAsset, showQuotedAsset]);

  console.log(customerServices);
  const service = customerServices[0];
  if (!service) return (<></>);

  const rightsizeAsset = async (deposit : CreateEvent<AssetDeposit>, quantity : string) : Promise<ContractId<AssetDeposit>> => {
    if (parseFloat(deposit.payload.asset.quantity) > parseFloat(quantity)) {
      const [ [ splitDepositCid,], ] = await ledger.exercise(AssetDeposit.AssetDeposit_Split, deposit.contractId, { quantities: [ quantity ] });
      return splitDepositCid;
    }
    return deposit.contractId;
  }

  const requestCreateAuction = async () => {
    const deposit = deposits
      .filter(c => auctionRequests.findIndex(a => a.payload.depositCid === c.contractId) === -1)
      .filter(c => c.payload.account !== service.payload.allocationAccount)
      .filter(c => c.payload.asset.id.label === auctionedAssetLabel)
      .find(c => parseFloat(c.payload.asset.quantity) >= parseFloat(quantity));
    if (!auctionedAsset || !quotedAsset || !deposit) return;
    const depositCid = await rightsizeAsset(deposit, quantity);
    const request : RequestCreateAuction = {
      auctionId,
      asset: { id: deposit.payload.asset.id, quantity },
      quotedAssetId: quotedAsset.payload.assetId,
      floorPrice,
      depositCid,
    };
    await ledger.exercise(Service.RequestCreateAuction, service.contractId, request);
    history.push("/app/distribution/requests");
  }

  return (
    <div className='auction'>
      <div className='new-auction'>
        <Header as='h2'>New Auction</Header>
        <FormErrorHandled onSubmit={() => requestCreateAuction()} >
          <div className='form-select'>
            <Form.Select
              className='select'
              label='Auctioned Asset'
              placeholder='Select...'
              required
              options={ heldAssetLabels.filter(a => a !== quotedAssetLabel).map(c => ({ key: c, text: c, value: c })) }
              onChange={(_, change) => setAuctionedAssetLabel(change.value as Party)}
            />
            <IconButton className='icon' color="primary" size="small" component="span" onClick={() => setShowAuctionedAsset(!showAuctionedAsset)}>
              {showAuctionedAsset ? <VisibilityOff fontSize="small"/> : <Visibility fontSize="small"/>}
            </IconButton>
          </div>
          <div className='form-select'>
            <Form.Select
              className='select'
              label='Quoted Asset'
              placeholder='Select...'
              required
              options={ assets.filter(c => c.payload.assetId.label !== auctionedAssetLabel).map(c => ({ key: c, text: c.payload.assetId.label, value: c.payload.assetId.label })) }
              onChange={(_, change) => setQuotedAssetLabel(change.value as Party)}
            />
            <IconButton className='icon' color="primary" size="small" component="span" onClick={() => setShowQuotedAsset(!showQuotedAsset)}>
              {showQuotedAsset ? <VisibilityOff fontSize="small"/> : <Visibility fontSize="small"/>}
            </IconButton>
          </div>
          <Form.Input
            label='Quantity'
            type='number'
            required
            onChange={(_, change) => setQuantity(change.value as string)}
          />
          <Form.Input
            label='Floor Price'
            type='number'
            required
            onChange={(_, change) => setFloorPrice(change.value as string)}
          />
          <Form.Input
            label='Auction ID'
            required
            onChange={(_, change) => setAuctionId(change.value as string)}
          />
          <div className='submit'>
            <Button
              type='submit'
              className='ghost'
              disabled={!canRequest}
              content='Submit'/>
            <a className='a2' onClick={() => history.goBack()}><IconClose/> Cancel</a>
          </div>
        </FormErrorHandled>
      </div>
      <div className='asset'>
        {showAuctionedAsset && (
          <Tile header={<h2>Auctioned Asset</h2>}>
            <div ref={el1} style={{ height: "100%" }}/>
          </Tile>
        )}
        {showQuotedAsset && (
          <Tile header={<h2>Quoted Asset</h2>}>
            <div ref={el2} style={{ height: "100%" }}/>
          </Tile>
        )}
      </div>
    </div>
  );
};

export const New = withRouter(NewComponent);