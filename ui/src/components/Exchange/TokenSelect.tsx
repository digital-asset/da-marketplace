import React from 'react'
import { Form } from 'semantic-ui-react'

import { TokenInfo } from './Exchange'

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

    return (
        <div className='token-select-container'>
            <Form.Select
                label={label}
                className={className}
                placeholder='Select'
                value={selected}
                options={options}
                onChange={(_, result) => {
                    if (typeof result.value === 'string') {
                        setTokenCid(result.value);
                    }
                }}/>
        </div>
    )
}

export default TokenSelect;
