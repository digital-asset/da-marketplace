import React, { useEffect, useState, useMemo } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { InformationIcon } from '../../icons/icons';

const MissingServiceModal = (props: {
  missingService: string;
  action: string;
  onClose: () => void;
  onRequest: () => void;
}) => {
  return (
    <Modal className="confirm-action" open={true} size="small" onClose={props.onClose}>
      <Modal.Header as="h2">
        <InformationIcon /> Missing Service
      </Modal.Header>
      <Modal.Content>
        <p>
          To create a {props.action}, this party must first request the {props.missingService}{' '}
          Service.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button className="ghost" onClick={props.onRequest}>
          Request {props.missingService} Service
        </Button>
        <Button className="ghost" onClick={props.onClose}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default MissingServiceModal;
