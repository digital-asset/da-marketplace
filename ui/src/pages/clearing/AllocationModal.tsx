import React, { useEffect, useState } from 'react';
import { useLedger } from '@daml/react';
import { CreateEvent } from '@daml/ledger';
import {
  AssetDeposit,
  AssetDeposit_SetObservers,
  AssetDeposit_Split,
} from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { Button, Form, Header, Modal } from 'semantic-ui-react';

type MarginCallProps = {
  deposit?: CreateEvent<AssetDeposit>;
  title: string;
  open: boolean;
  onClose: (open: boolean) => void;
  observers: AssetDeposit_SetObservers;
};

const AllocationModal: React.FC<MarginCallProps> = ({
  deposit,
  title,
  open,
  onClose,
  observers,
}) => {
  const ledger = useLedger();
  const [allocation, setAllocation] = useState<number>(0.0);

  useEffect(() => {
    if (!!deposit) setAllocation(parseFloat(deposit.payload.asset.quantity));
  }, [open, deposit]);

  if (!deposit) return null;

  const requestAllocation = async () => {
    const depositQuantity = parseFloat(deposit.payload.asset.quantity);

    if (allocation <= 0 || allocation > depositQuantity) {
      onClose(false);
      return;
    }

    if (allocation < depositQuantity) {
      const splitRequest: AssetDeposit_Split = {
        quantities: [allocation.toString()],
      };
      await ledger
        .exercise(AssetDeposit.AssetDeposit_Split, deposit.contractId, splitRequest)
        .then(([[depositCid]]) =>
          ledger.exercise(AssetDeposit.AssetDeposit_SetObservers, depositCid, observers)
        );
    } else {
      await ledger.exercise(AssetDeposit.AssetDeposit_SetObservers, deposit.contractId, observers);
    }

    onClose(false);
  };

  return (
    <Modal className="input-dialog" open={open} size="small" onClose={() => onClose(false)}>
      <Modal.Header as="h2">{title}</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            key={deposit.contractId}
            required
            label={<Header as="h4">Amount</Header>}
            type={'number'}
            onChange={(_, change) => setAllocation(parseFloat(change.value))}
            placeholder={allocation}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button className="ghost" onClick={() => requestAllocation()}>
          Confirm
        </Button>
        <Button className="ghost warning" onClick={() => onClose(false)}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AllocationModal;
