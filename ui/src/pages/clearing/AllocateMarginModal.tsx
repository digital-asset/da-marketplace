import React, {useState} from 'react';
import {useLedger, useParty} from '@daml/react';
import {ContractId, Party} from '@daml/types';
import {makeDamlSet} from '../common';
import {Form} from 'semantic-ui-react';
import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';
import {CreateEvent} from "@daml/ledger";
import {
  AssetDeposit,
  AssetDeposit_Lock,
  AssetDeposit_Split,
  AssetDeposit_Unlock
} from "@daml.js/da-marketplace/lib/DA/Finance/Asset";
import {InputDialog} from "../../components/InputDialog/InputDialog";

interface AllocationInterface {
  amount : number
};

type MarginCallProps = {
  clearingParty : Party;
  deposit : CreateEvent<AssetDeposit>;
  title : string;
  open : boolean;
  onClose : (open : boolean) => void;
  // request : AssetDeposit_Lock | AssetDeposit_Unlock;
};

const MarginAllocationModal: React.FC<MarginCallProps> = ({
  clearingParty,
  deposit,
  title,
  open,
  onClose
}) => {
  const ledger = useLedger();
  const [allocation, setAllocation] = useState<AllocationInterface>({
    amount : parseFloat(deposit.payload.asset.quantity)
  });

  const requestMarginAllocation = async () => {
    const targetAmount = allocation.amount;
    const depositQuantity = parseFloat(deposit.payload.asset.quantity);

    if (targetAmount <= 0 || targetAmount > depositQuantity) return
    const request: AssetDeposit_Lock = {
      newLockers: makeDamlSet([clearingParty])
    };

    if (targetAmount < depositQuantity) {
      const splitRequest : AssetDeposit_Split = {
        quantities: [targetAmount.toString()]
      };
      await ledger
        .exercise(AssetDeposit.AssetDeposit_Split, deposit.contractId, splitRequest)
        .then(([[depositCid]]) =>
          ledger.exercise(AssetDeposit.AssetDeposit_Lock, depositCid, request)
        );
    }
    else if (targetAmount === depositQuantity ) {
        await ledger.exercise(AssetDeposit.AssetDeposit_Lock, deposit.contractId, request);
    } else {
      console.log("Specified amount is greater than the deposit");
    }
    setAllocation({
      amount : 0.0
    });
    onClose(false);
  };

  return (
    <InputDialog
      isModal={true}
      open={open}
      title={title}
      defaultValue={allocation}
      fields={{
        amount: {
          label: "Amount",
          type: 'number'
        },
      }}
      onChange={state => !!state && setAllocation(state)}
      onClose={() => requestMarginAllocation()}
    />
  );
};

export default MarginAllocationModal;
