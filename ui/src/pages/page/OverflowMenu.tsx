import classNames from 'classnames';
import React, { FunctionComponent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import { OverflowIcon } from '../../icons/icons';

import { useDismissableElement } from './utils';

export const OverflowMenuEntry: FunctionComponent<{
  label: React.ReactElement | string;
  onClick?: () => void;
  href?: string;
}> = props => {
  const { href, onClick } = props;
  const history = useHistory();

  function handleClick() {
    if (href) {
      history.push(href);
    }
    if (onClick) {
      onClick();
    }
  }

  return (
    <div className="overflow-menu-entry" onClick={handleClick}>
      <p>{props.label}</p>
    </div>
  );
};

type OverflowMenuProps = {
  align?: 'left' | 'right';
};

const OverflowMenu: React.FC<OverflowMenuProps> = ({ children, align }) => {
  const [showModal, setShowModal] = useState(false);

  const { refDismissable, refControl } = useDismissableElement<HTMLDivElement, HTMLDivElement>(() =>
    setShowModal(false)
  );

  return (
    <Button
      className={classNames('ghost overflow-menu', { inactive: showModal })}
      onClick={() => setShowModal(!showModal)}
    >
      <div className="overflow-menu-title" ref={refControl}>
        <OverflowIcon />
      </div>
      {showModal && (
        <div className={classNames('overflow-menu-modal', align)} ref={refDismissable}>
          {children}
        </div>
      )}
    </Button>
  );
};

export default OverflowMenu;
