import React from 'react';

import { Button } from 'semantic-ui-react';

import { ArrowLeftIcon } from '../../icons/icons';

import { useHistory } from 'react-router-dom';

const BackButton = (props: { prevPage?: string }) => {
  const history = useHistory();

  return (
    <Button className="ghost back-button" onClick={() => history.goBack()}>
      <ArrowLeftIcon /> back {props.prevPage ? `to ${props.prevPage}` : ''}
    </Button>
  );
};

export default BackButton;
