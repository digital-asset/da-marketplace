import React, { useEffect } from 'react'
import { Form, Message } from 'semantic-ui-react'

import { ErrorMessage } from './errorTypes'

import "./FormErrorHandled.css";

type Props = {
    size?: string;
    loading?: boolean;
    className?: string;
    error?: ErrorMessage;
    clearError: () => void;
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

const FormErrorHandled: React.FC<Props> = ({ children, className, size, error, loading, clearError, onSubmit }) => {
    useEffect(() => {
        if (error) {
            setTimeout(() => {
                clearError();
            }, 6000);
        }
    }, [error]);

    return (
        <Form className={className} size={size} loading={loading} error={!!error} onSubmit={onSubmit}>
            { children }
            <Message error header={error?.header} content={error?.message}/>
        </Form>
    )
}


export default FormErrorHandled;
