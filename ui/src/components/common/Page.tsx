import React from 'react'
import { Grid } from 'semantic-ui-react'

import SideMenu from './SideMenu'
import TopMenu from './TopMenu'
import { Mode } from '../MainScreen'

import './Page.css'

type Props = {
    view: Mode;
    menuTitle?: React.ReactElement;
    setView: (view: Mode) => void;
    onLogout: () => void;
}

const Page: React.FC<Props> = ({ children, view, menuTitle, setView, onLogout }) => {
    return (
        <Grid className="page-content">
            <SideMenu view={view} setView={setView}/>
            <Grid.Column className="page-body">
                <TopMenu onLogout={onLogout} title={menuTitle}/>
                { children }
            </Grid.Column>
        </Grid>
    )
}

export default Page
