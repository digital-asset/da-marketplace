import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useStreamQuery } from '@daml/react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'

import { WalletIcon } from '../../icons/Icons'
import InvestorWallet from './InvestorWallet'
import InvestorSideNav from './InvestorSideNav'
import InvestorTrade from './InvestorTrade'

export type ContractInfo = {
    contractId: string;
    contractData: AssetDeposit;
}

type Props = {
    onLogout: () => void;
}

const Investor: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const allDeposits: ContractInfo[] = useStreamQuery(AssetDeposit).contracts
        .map(deposit => ({contractId: deposit.contractId, contractData: deposit.payload}));

    const sideNav = <InvestorSideNav url={url}/>;

    return <Switch>
        <Route exact path={`${path}`}>
            <Page sideNav={sideNav} onLogout={onLogout}>
                <WelcomeHeader/>
            </Page>
        </Route>

        <Route path={`${path}/wallet`}>
            <Page
                sideNav={sideNav}
                menuTitle={<><WalletIcon/>Wallet</>}
                onLogout={onLogout}
            >
                <InvestorWallet deposits={allDeposits}/>
            </Page>
        </Route>

        <Route path={`${path}/trade/:base-:quote`}>
            <InvestorTrade
                sideNav={sideNav}
                onLogout={onLogout}
                deposits={allDeposits}/>
        </Route>
    </Switch>
}

export default Investor;
