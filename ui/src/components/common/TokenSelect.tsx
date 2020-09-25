import React from 'react'
import { Form } from 'semantic-ui-react'

import { TokenInfo } from './damlTypes'

type Props = {
    label: string;
    className?: string;
    selected?: string;
    tokens: TokenInfo[];
    setTokenCid: (contractId: string) => void;
}

const TokenSelect: React.FC<Props> = ({ label, className, selected, tokens, setTokenCid }) => {
    const options = tokens.map(t => ({
        key: t.contractId,
        text: t.contractData.id.label,
        value: t.contractId
    }));

    const handleTokenChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setTokenCid(result.value);
        }
    }

    return (
        <div className='token-select-container'>
            <Form.Select
                label={label}
                className={className}
                placeholder='Select'
                value={selected}
                options={options}
                onChange={handleTokenChange}/>
        </div>
    )
}

export default TokenSelect;
