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
    topMenuButtons?: ITopMenuButtonInfo[];
}

const Page: React.FC<Props> = ({
    children,
    className,
    menuTitle,
    sideNav,
    notifications,
    onLogout,
    topMenuButtons,
    activeMenuTitle
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
                    title={menuTitle}
                    notifications={notifications}
                    topMenuButtons={topMenuButtons}
                    activeMenuTitle={activeMenuTitle}/>
                { children }
            </Grid.Column>
        </Grid>
    )
}

export default Page
