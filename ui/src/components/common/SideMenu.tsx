import React from 'react'
import { Grid, Menu } from 'semantic-ui-react'

import './SideMenu.scss'

const SideMenu: React.FC = ({ children }) => (
    <Grid.Column className="page-sidemenu">
        <Menu secondary vertical>
            { children }
        </Menu>
    </Grid.Column>
)

export default SideMenu;
