import React, { useEffect, useState } from 'react'
import { Form } from 'semantic-ui-react'

import { ContractInfo } from './damlTypes'
import { parseError } from './errorTypes'

type DropdownOption = {
    key: string;
    text: string;
    value: string;
}

type Props<T> = {
    allowAdditions?: boolean;
    className?: string;
    clearable?: boolean;
    contracts: ContractInfo<T>[];
    label?: string;
    placeholder?: string;
    search?: boolean;
    selection?: boolean;
    value?: string;
    getOptionText: (contractInfo: ContractInfo<T>) => string;
    setAddition?: (value: string) => void;
    setContract: (contract: ContractInfo<T>) => void;
}

function ContractSelect <T>({
    allowAdditions,
    className,
    clearable,
    contracts,
    label,
    placeholder,
    search,
    selection,
    value,
    getOptionText,
    setAddition,
    setContract
}: Props<T>) {
    const [ cid, setCid ] = useState<string>();
    const [ options, setOptions ] = useState<DropdownOption[]>([]);
    const searchQuery = search ? options.find(opt => opt.key === cid)?.text : undefined;

    useEffect(() => {
        setCid(value);
    }, [value])

    useEffect(() => {
        const opts = contracts.map(c => ({
            key: c.contractId,
            text: getOptionText(c),
            value: c.contractId
        }));
        setOptions(opts);
    }, [contracts, getOptionText])

    const handleAddedItem = (event: React.SyntheticEvent, data: any) => {
        setOptions([...options, { key: data.value, text: data.value, value: data.value}])
        setCid(data.value);
    }

    const handleContractChange = (event: React.SyntheticEvent, data: any) => {
        try {
            if (typeof data.value === 'string') {
                const value = data.value.trim();
                const contract = contracts.find(t => t.contractId === value);

                if (!contract && !!allowAdditions && setAddition && value) {
                    setCid(value);
                    setAddition(value);
                    return;
                }

                setCid(value);
                contract && setContract(contract);
            } else {
                throw new Error(`Unexpected result value type ${typeof data.value}.`);
            }
        } catch (err) {
            console.error(parseError(err));
        }
    }

    return (
        <div className='contract-select-container'>
            <Form.Select
                additionLabel='Add a private investor by ID: '
                allowAdditions={allowAdditions}
                className={className}
                clearable={clearable}
                label={label}
                options={options}
                placeholder={placeholder}
                search={search}
                searchQuery={searchQuery}
                selection={selection}
                value={cid}
                onAddItem={handleAddedItem}
                onChange={handleContractChange}/>
        </div>
    )
}

export default ContractSelect;
