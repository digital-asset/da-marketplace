import React from 'react'
import { Button } from 'semantic-ui-react'

import { AddPlusIcon } from '../../icons/Icons'

const AddRelationshipTile = (props: {
    disabled: boolean;
    disabledMessage: string;
    onClick: () => void;
    label: string
}) => (
    <Button
        disabled={props.disabled}
        className='add-relationship-tile'
        onClick={props.onClick}>
            <AddPlusIcon/> <a className='bold'>{props.label}</a>
            {props.disabled && <i className='disabled'>{props.disabledMessage}</i>}
    </Button>
)

export default AddRelationshipTile;
