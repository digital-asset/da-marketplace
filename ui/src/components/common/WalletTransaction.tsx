import React, { useState, FunctionComponent } from 'react';

import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'

import { WalletIcon } from '../../icons/Icons'

import PageSection from '../common/PageSection'
import Page from '../common/Page'


const WalletTransaction : FunctionComponent<{
    transactionType: string;
    sideNav: React.ReactElement;
    onLogout: () => void;
    baseUrl: string;
}> = ({children, sideNav, onLogout, transactionType, baseUrl }) => {

    return (
        <Page
            sideNav={sideNav}
            activeMenuTitle={true}
            menuTitle={<><WalletIcon/>Wallet</>}
            onLogout={onLogout}
            >
            <PageSection className='wallet-transaction' border='blue' background='grey'>
                <h2>{transactionType} Funds</h2>
                {children}
            </PageSection>
        </Page>
    )
}

export default WalletTransaction;
