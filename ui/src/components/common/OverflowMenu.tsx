import React, { useState, FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';

import { OverflowIcon } from '../../icons/Icons';

import { useDismissableElement } from './utils';

import "./OverflowMenu.css"

export const OverflowMenuEntry : FunctionComponent<{
    label : React.ReactElement | string,
    onClick?: () => void,
    href?: string
}> = (props) => {
    const { href, onClick } = props;
    const history  = useHistory()

    function handleClick() {
        if (href) {
            history.push(href);
        }
        if (onClick) {
            onClick();
        }
    }

    return (
      <div className='overflow-menu-entry' onClick={handleClick}>
          <p>{props.label}</p>
      </div>
    );
};


const OverflowMenu : FunctionComponent<{}> = (props) => {

    const [ showModal, setShowModal ] = useState(false);

    const { refDismissable, refControl } =
        useDismissableElement<HTMLDivElement, HTMLDivElement>(() => setShowModal(false));

    return (
        <div className='overflow-menu'
             onClick={() => setShowModal(!showModal)}>
            <div className="overflow-menu-title" ref={refControl}>
                <OverflowIcon/>
            </div>
            {showModal &&
               <div className="overflow-menu-modal" ref={refDismissable}>
                   {props.children}
               </div>}
        </div>
    );
}

export default OverflowMenu;
