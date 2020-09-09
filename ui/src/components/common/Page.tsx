import React from 'react'
import { Grid } from 'semantic-ui-react'

import SideMenu from './SideMenu'
import TopMenu from './TopMenu'

import './Page.css'

type Props = {
    menuTitle?: React.ReactElement;
    onLogout: () => void;
}

const Page: React.FC<Props> = ({ children, menuTitle, onLogout }) => {
    return (
        <Grid className="page-content">
            <SideMenu/>
            <Grid.Column className="page-body">
                <TopMenu onLogout={onLogout} title={menuTitle}/>
                { children }
            </Grid.Column>
        </Grid>
    )
}

export default Page
