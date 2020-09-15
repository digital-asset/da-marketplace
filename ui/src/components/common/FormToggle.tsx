import React, { useState } from 'react'
import { Radio } from 'semantic-ui-react'

type Props = {
    className?: string;
    onLabel: string;
    onInfo?: string;
    offLabel: string;
    offInfo?: string;
    defaultChecked?: boolean;
    onClick: (val: boolean) => void;
}

const FormToggle: React.FC<Props> = ({
    className,
    onLabel,
    onInfo,
    offLabel,
    offInfo,
    defaultChecked,
    onClick
}) => {
    const [ enabled, setEnabled ] = useState<boolean>(!!defaultChecked);

    const handleClick = (event: React.MouseEvent) => {
        onClick(!enabled);
        setEnabled(!enabled);
    }

    return (
        <div className={className}>
            {enabled?
                <>
                    <p>{onLabel} </p>
                    <p><i>{onInfo}</i></p>
                </>
            :
                <>
                    <p>{offLabel}</p>
                    <p><i>{offInfo}</i></p>
                </>}
            <Radio toggle defaultChecked={!!defaultChecked} onClick={handleClick}/>
        </div>
    )
}

export default FormToggle;
