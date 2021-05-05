import React from 'react'
import {Button, Form, Header} from 'semantic-ui-react'

import FormErrorHandled from './FormErrorHandled';
import Notification from './Notification'

type ActionRequiredNotificationProps = {
    actionText: string;
    onAction: () => Promise<void>;
}

const ActionRequiredNotification: React.FC<ActionRequiredNotificationProps> = ({
    children,
    actionText,
    onAction
}) => (
        <Notification>
            <Header as='h3'>{children}</Header>
            <FormErrorHandled onSubmit={onAction}>
                <Form.Group className='inline-form-group'>
                    <Button className='ghost' content={actionText} type='submit'/>
                </Form.Group>
            </FormErrorHandled>
        </Notification>
)

export default ActionRequiredNotification;
