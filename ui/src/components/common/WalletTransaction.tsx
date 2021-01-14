import React, { useState, FunctionComponent } from 'react';

import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { WalletIcon } from '../../icons/Icons'

import PageSection from '../common/PageSection'
import Page from '../common/Page'


const WalletTransaction : FunctionComponent<{
    transactionType: string;
    sideNav: React.ReactElement;
    onLogout: () => void;
}> = ({children, sideNav, onLogout, transactionType }) => {

    const { path, url } = useRouteMatch();

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><WalletIcon/>Wallet</>}
            onLogout={onLogout}
            >
            <PageSection border='blue' background='grey'>
            <h2>{transactionType}</h2>
            {children}
            </PageSection>
        </Page>
    )
}

const WalletTransactionStep = () => {
    return (
        <div>
            
        </div>
    )
}

export default WalletTransaction;
