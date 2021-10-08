import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import { ArrowLeftIcon } from '../../icons/icons';

const BackButton = (props: { prevPageLabel?: string; prevPagePath?: string }) => {
  const history = useHistory();

  return (
    <Button
      className="ghost back-button"
      onClick={() => (props.prevPagePath ? history.push(props.prevPagePath) : history.goBack())}
    >
      <ArrowLeftIcon /> back {props.prevPageLabel ? `to ${props.prevPageLabel}` : ''}
    </Button>
  );
};

export default BackButton;
