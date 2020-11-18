import React from 'react'

import marketplaceLogo from './marketplace.svg'
import exchange from './exchange.svg'
import lock from './lock.svg'
import logout from './logout.svg'
import orders from './orders.svg'
import publicIcon from './public.svg'
import user from './user.svg'
import wallet from './wallet.svg'

import './Icons.css'

export const ArrowRightIcon = () => (
    <svg className="icon arrow-right-icon" viewBox="0 0 13 12">
        <path
            d="M6.3,2.3L9,5H0.8C0.4,5,0,5.3,0,5.8s0.3,0.8,0.8,0.8H9L6.3,9.3C6.2,9.4,6.1,9.6,6.1,9.8s0.1,0.4,0.2,0.5
            c0.3,0.3,0.8,0.3,1.1,0l4-4c0.1-0.1,0.1-0.2,0.1-0.3c0.1-0.1,0.1-0.4,0-0.5c0-0.1-0.1-0.2-0.2-0.2l-4-4C7,1,6.5,1,6.2,1.3
            C6,1.5,6,2,6.3,2.3"/>
    </svg>
)

export const LogoIcon = () => (
    <img
        className="icon logo-icon"
        src={marketplaceLogo}
        alt="command"/>
)

export const ExchangeIcon = () => (
    <img
        className="icon exchange-icon"
        src={exchange}
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

export const MarketIcon = () => (
    <svg className="icon market-icon" width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 4.36865L2.94737 6.05286L6.73684 4.36865L10.5263 6.05286L13.4737 4.36865V17.0002H0V4.36865Z" fill="#303132"/>
        <path d="M2.10523 6.89474C1.96488 4.92982 2.6947 1 6.73681 1" stroke="#303132" strokeWidth="1.5"/>
        <path d="M10.9314 6.89474C11.0717 4.92982 10.3419 1 6.29981 1" stroke="#303132" strokeWidth="1.5"/>
    </svg>
)

export const OrdersIcon = () => (
    <img
        className="icon orders-icon"
        src={orders}
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

export const WalletIcon = () => (
    <img
        className="icon wallet-icon"
        src={wallet}
        alt="command"/>
)

export const CircleIcon = () => (
    <div className="icon circle"></div>
)
