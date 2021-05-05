import React from 'react'
import {Button, Form, Header} from 'semantic-ui-react'

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
            <Header as='h3'>{children}</Header>
            <FormErrorHandled onSubmit={onAccept}>
                { loadAndCatch =>
                    <Form.Group className='inline-form-group'>
                        <Button className='ghost' content='Accept' type='submit'/>
                        <Button
                            className='ghost warning'
                            content='Reject'
                            type='button'
                            onClick={() => loadAndCatch(onReject)}/>
                    </Form.Group>
                }
            </FormErrorHandled>
        </Notification>
)

export default AcceptRejectNotification;
