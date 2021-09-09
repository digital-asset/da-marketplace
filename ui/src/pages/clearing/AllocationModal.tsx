import React, {useEffect, useState} from 'react';
import {useLedger} from '@daml/react';
import {CreateEvent} from "@daml/ledger";
import {
  AssetDeposit,
  AssetDeposit_SetObservers,
  AssetDeposit_Split
} from "@daml.js/da-marketplace/lib/DA/Finance/Asset";
import {InputDialog} from "../../components/InputDialog/InputDialog";

interface AllocationInterface {
  amount : number
};

type MarginCallProps = {
  deposit : CreateEvent<AssetDeposit> | undefined;
  title : string;
  open : boolean;
  onClose : (open : boolean) => void;
  observers : AssetDeposit_SetObservers
};

const AllocationModal: React.FC<MarginCallProps> = ({
  deposit,
  title,
  open,
  onClose,
  observers,
}) => {
  const ledger = useLedger();
  const [allocation, setAllocation] = useState<AllocationInterface>({
    amount : !!deposit ? parseFloat(deposit.payload.asset.quantity) : 0.0
  });

  useEffect(() => {
    if (!!deposit) {
      console.log("im here" + deposit.payload.asset.quantity);
      setAllocation({
        amount: parseFloat(deposit.payload.asset.quantity)
      })
    }
  }, [deposit]);

  if (!deposit) return <></>;

  const requestAllocation = async () => {
    const targetAmount = allocation.amount;
    const depositQuantity = parseFloat(deposit.payload.asset.quantity);

    if (targetAmount <= 0 || targetAmount > depositQuantity) {
      console.log("targetAmount=" + targetAmount.toString());
      console.log("depositQuantity=" + depositQuantity.toString());
      onClose(false);
      return;
    }

    if (targetAmount < depositQuantity) {
      const splitRequest : AssetDeposit_Split = {
        quantities: [targetAmount.toString()]
      };
      await ledger
        .exercise(AssetDeposit.AssetDeposit_Split, deposit.contractId, splitRequest)
        .then(([[depositCid]]) =>
          ledger.exercise(AssetDeposit.AssetDeposit_SetObservers, depositCid, observers)
        );
    }
    else {
        await ledger.exercise(AssetDeposit.AssetDeposit_SetObservers, deposit.contractId, observers);
    }

    cleanup();
  };

  const cleanup = () => {
    setAllocation({
      amount : 0.0
    });
    onClose(false);
  }

  const cancel = () => {
    cleanup();
    return Promise.resolve();
  }

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
      onClose={state => state ? requestAllocation() : cancel()}
    />
  );
};

export default AllocationModal;
