import React from 'react'
import { Grid, Menu } from 'semantic-ui-react'
import classNames from 'classnames'

import TopMenu, { ITopMenuButtonInfo } from './TopMenu'

type Props = {
    className?: string;
    menuTitle?: React.ReactElement;
    activeMenuTitle?: boolean;
    sideNav: React.ReactElement;
    notifications?: React.ReactElement[];
    onLogout: () => void;
    notificationOn?: () => void;
    topMenuButtons?: ITopMenuButtonInfo[];
    landingPage?: boolean;
}

const Page: React.FC<Props> = ({
    children,
    className,
    menuTitle,
    sideNav,
    notifications,
    onLogout,
    notificationOn,
    topMenuButtons,
    activeMenuTitle,
    landingPage
}) => {
    return (
        <Grid className={classNames('page-content', className)}>
            <Grid.Column className="page-sidemenu">
                <Menu secondary vertical>
                    { sideNav }
                </Menu>
            </Grid.Column>
            <Grid.Column className='page-body'>
                <TopMenu
                    onLogout={onLogout}
                    notificationOn={notificationOn}
                    title={menuTitle}
                    notifications={notifications}
                    topMenuButtons={topMenuButtons}
                    activeMenuTitle={activeMenuTitle}
                    landingPage={landingPage}/>
                { children }
            </Grid.Column>
        </Grid>
    )
}

export default Page
