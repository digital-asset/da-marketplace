import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { getName, publicParty } from "../../config";
import useStyles from "../styles";
import { Party, ContractId } from "@daml/types";
import { AssetSettlementRule } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement";
import { ServicePageProps } from "../common";
import FormErrorHandled from "../../components/Form/FormErrorHandled";
import {Button, Form, Header, Modal} from "semantic-ui-react";
import {DropdownItemProps} from "semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem";
import {IconClose} from "../../icons/icons";
import {Service, CreateMarginCalculation} from "@daml.js/da-marketplace/lib/Marketplace/Clearing/Service";

function generateGuid() {
  var result, i, j;
  result = '';
  for(j=0; j<32; j++) {
    if( j === 8 || j === 12 || j === 16 || j === 20)
      result = result + '-';
    i = Math.floor(Math.random()*16).toString(16).toUpperCase();
    result = result + i;
  }
  return result;
}

type MarginCallProps = {
  member?: Party
}

const MarginCallComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({ history, services }: RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();
  const ledger = useLedger();

  const [customer, setCustomer] = useState<Party>();
  const [targetAmount, setTargetAmount] = useState<string>();

  const canRequest = !!customer
                  && !!targetAmount;
    // && accounts.find(a => a.payload.account.provider === provider && a.payload.account.owner === party && a.payload.account.id.label === accountName) === undefined

  const requestAccount = async () => {
    const service = services.find(s => s.payload.customer === customer && s.payload.provider === party);
    if (!service || !targetAmount) return;
    const request: CreateMarginCalculation = {
      calculationId: generateGuid(),
      currency: "USD",
      targetAmount: targetAmount
    };
    await ledger.exercise(Service.CreateMarginCalculation, service.contractId, request);
    history.goBack();
  }

  const customers : DropdownItemProps[] = services.map((c, i) => (
    { key: i, text: c.payload.customer, value: c.payload.customer }
  ));

  const providerByOperator = (operator: string) : DropdownItemProps[] => services
    .filter(s => s.payload.operator === operator)
    .map((c, i) => (
      { key: i, text: c.payload.provider, value: c.payload.provider }
  ));

  return (
    <div className='new-account'>
      <Header as='h2'>Perform Margin Call</Header>
      <FormErrorHandled onSubmit={() => requestAccount()} >
        <Form.Select
          label='Customer'
          placeholder='Select...'
          required
          options={customers}
          onChange={(_, change) => setCustomer(change.value as Party)}
        />
        <Form.Input
          label='Target Amount'
          placeholder='0'
          type='number'
          onChange={(_, change) => setTargetAmount(change.value as string)}
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
  );
};

export const MarginCall = withRouter(MarginCallComponent);
