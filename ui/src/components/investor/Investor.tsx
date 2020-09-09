import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'

import { WalletIcon } from '../../icons/Icons'
import InvestorWallet from './InvestorWallet'
import InvestorSideNav from './InvestorSideNav'

type Props = {
    onLogout: () => void;
}

const Investor: React.FC<Props> = ({ onLogout }) => (
    <Switch>
        <Route path='/'>
            <Page sideNav={<InvestorSideNav/>} onLogout={onLogout}>
                <WelcomeHeader/>
            </Page>
        </Route>

        <Route path='/wallet'>
            <Page
                sideNav={<InvestorSideNav/>}
                menuTitle={<><WalletIcon/>Wallet</>}
                onLogout={onLogout}
            >
                <InvestorWallet/>
            </Page>
        </Route>
    </Switch>
)

export default Investor;
