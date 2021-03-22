import React, { useState, useEffect } from 'react'
import { Form, Message } from 'semantic-ui-react'
import classNames from 'classnames'

import { ErrorMessage, parseError } from '../../pages/error/errorTypes'

type Renderable = number | string | React.ReactElement | React.ReactNode | Renderable[];
type Callable = ((callback: (fn: () => Promise<void>) => void) => Renderable);

const isCallable = (maybeCallable: any): maybeCallable is Callable => {
    return typeof maybeCallable === 'function';
}

type Props = {
    size?: string;
    className?: string;
    children: Callable | Renderable;
    onSubmit: () => Promise<void>;
}

const FormErrorHandled: (props: Props) => React.ReactElement = ({
    size,
    className,
    children,
    onSubmit
}) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(undefined);
            }, 6000);
        }
    }, [error]);

    const loadAndCatch = async (fn: () => Promise<void>) => {
        setLoading(true);
        try {
            await fn();
        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    const errorMsgList = error?.message instanceof Array ? error.message : undefined;
    const errorMsgContent = error?.message instanceof Array ? undefined : error?.message;

    return (
        <Form
            className={classNames('form-error-handled', className)}
            size={size}
            loading={loading}
            error={!!error}
            onSubmit={() => loadAndCatch(onSubmit)}
        >
            { isCallable(children) ? children(callback => loadAndCatch(callback)) : children }
            <Message
                error
                header={error?.header}
                content={errorMsgContent}
                list={errorMsgList}/>
        </Form>
    )
}


export default FormErrorHandled;
