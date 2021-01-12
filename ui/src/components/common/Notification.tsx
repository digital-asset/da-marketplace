import React from 'react'
import { Message } from 'semantic-ui-react'

import "./Notification.scss"

const Notification: React.FC = ({ children }) => {
    return (
        <div className='notification'>
            <Message>
                { children }
            </Message>
        </div>
    )
}

export default Notification;
