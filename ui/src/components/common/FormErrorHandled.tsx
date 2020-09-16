import React from 'react'
import { Form, Message } from 'semantic-ui-react'

import "./FormErrorHandled.css";

type Props = {
    error: string;
    loading?: boolean;
    className?: string;
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

const FormErrorHandled: React.FC<Props> = ({ children, className, error, loading, onSubmit }) => (
    <Form className={className} loading={loading} error={!!error} onSubmit={onSubmit}>
        { children }
        <Message error header='DAML API error' content={error}/>
    </Form>
)


export default FormErrorHandled;
