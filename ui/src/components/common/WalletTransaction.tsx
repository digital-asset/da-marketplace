import React, { useState, FunctionComponent } from 'react';

import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'

import { WalletIcon } from '../../icons/Icons'

import PageSection from '../common/PageSection'
import Page from '../common/Page'

import { Button } from 'semantic-ui-react'

const WalletTransaction : FunctionComponent<{
    transactionType: string;
    sideNav: React.ReactElement;
    onLogout: () => void;
    baseUrl: string;
    onSubmit: () => void;
}> = ({children, sideNav, onLogout, transactionType, baseUrl }) => {

    return (
        <Page
            sideNav={sideNav}
            activeMenuTitle={true}
            menuTitle={<><WalletIcon/>Wallet</>}
            onLogout={onLogout}
            >
            <PageSection border='blue' background='grey'>
                <div className='wallet-transaction'>
                    <h2>{transactionType} Funds</h2>
                    {children}
                    <Button className='ghost'>
                        Submit
                    </Button>
                </div>
            </PageSection>
        </Page>
    )
}

export default WalletTransaction;
