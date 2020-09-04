import React from 'react'

import chatFace from './chatface.svg'
import lock from './lock.svg'
import logout from './logout.svg'
import publicIcon from './public.svg'
import user from './user.svg'

import './Icons.css'

export const ChatFaceIcon = () => (
    <img
        className="icon chat-icon"
        src={chatFace}
        alt="command"/>
)

export const LockIcon = () => (
    <img
        className="icon lock-icon"
        src={lock}
        alt="command"/>
)

export const LogoutIcon = () => (
    <img
        className="icon logout-icon"
        src={logout}
        alt="command"/>
)

export const PublicIcon = () => (
    <img
        className="icon public-icon"
        src={publicIcon}
        alt="command"/>
)

export const UserIcon = () => (
    <img
        className="icon user-icon"
        src={user}
        alt="command"/>
)
