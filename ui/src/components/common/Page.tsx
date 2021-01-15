import React from 'react'
import { Grid } from 'semantic-ui-react'

import SideMenu from './SideMenu'
import TopMenu, { ITopMenuButtonInfo } from './TopMenu'

import './Page.scss'

type Props = {
    className?: string;
    menuTitle?: React.ReactElement;
    activeMenuTitle?: boolean;
    sideNav: React.ReactElement;
    notifications?: React.ReactElement[];
    onLogout: () => void;
    isLandingPage?: boolean;
    topMenuButtons?: ITopMenuButtonInfo[];
}

const Page: React.FC<Props> = ({
    children,
    className,
    menuTitle,
    sideNav,
    notifications,
    onLogout,
    isLandingPage,
    topMenuButtons,
    activeMenuTitle
}) => {
    return (
        <Grid className={'page-content ' + className}>
            <SideMenu>{ sideNav }</SideMenu>
            <Grid.Column className='page-body'>
                <TopMenu
                    onLogout={onLogout}
                    title={menuTitle}
                    notifications={notifications}
                    isLandingPage={isLandingPage}
                    topMenuButtons={topMenuButtons}
                    activeMenuTitle={activeMenuTitle}/>
                { children }
            </Grid.Column>
        </Grid>
    )
}

export default Page
