import React from 'react'
import { Button, Form } from 'semantic-ui-react'

import FormErrorHandled from './FormErrorHandled';
import Notification from './Notification'

type AcceptRejectNotificationProps = {
    onAccept: () => Promise<void>;
    onReject: () => Promise<void>;
}

const AcceptRejectNotification: React.FC<AcceptRejectNotificationProps> = ({
    children,
    onAccept,
    onReject
}) => (
        <Notification>
            <p>{children}</p>
            <FormErrorHandled onSubmit={onAccept}>
                { loadAndCatch =>
                    <Form.Group className='inline-form-group'>
                        <Button secondary content='Accept' type='submit'/>
                        <Button
                            secondary
                            content='Reject'
                            type='button'
                            onClick={() => loadAndCatch(onReject)}/>
                    </Form.Group>
                }
            </FormErrorHandled>
        </Notification>
)

export default AcceptRejectNotification;
