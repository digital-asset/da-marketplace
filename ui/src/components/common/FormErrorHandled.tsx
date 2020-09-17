import React from 'react'
import { Form, Message } from 'semantic-ui-react'

import { ErrorMessage } from './utils'

import "./FormErrorHandled.css";

type Props = {
    error?: ErrorMessage;
    loading?: boolean;
    className?: string;
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

const FormErrorHandled: React.FC<Props> = ({ children, className, error, loading, onSubmit }) => (
    <Form className={className} loading={loading} error={!!error} onSubmit={onSubmit}>
        { children }
        <Message error header={error?.header} content={error?.message}/>
    </Form>
)


export default FormErrorHandled;
