import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { Box, Divider, Theme } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { useTheme } from '@material-ui/styles';
import { toggleSidebar, useLayoutDispatch, useLayoutState } from '../../context/LayoutContext';
import { SidebarEntry } from './SidebarEntry';
import useStyles from './styles';
import headerLogo from '../../images/companyLogo.svg';
import SidebarLink from './components/SidebarLink/SidebarLink';

type SidebarProps = {
  entries: SidebarEntry[];
};

function Sidebar({ entries, location }: RouteComponentProps & SidebarProps) {
  const classes = useStyles();
  const theme = useTheme() as Theme;

  const { isSidebarOpened } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();
  const [isPermanent, setPermanent] = useState(true);

  useEffect(function () {
    window.addEventListener('resize', handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener('resize', handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? 'permanent' : 'temporary'}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      {!isPermanent && (
        <Box display="flex" flexDirection="row" className={classes.sidebarBox}>
          <div className={classes.mobileBackButton}>
            <IconButton
              onClick={() => toggleSidebar(layoutDispatch)}
              className={classNames(
                classes.headerMenuButtonSandwich,
                classes.headerMenuButtonCollapse
              )}
            >
              <ArrowBack
                classes={{ root: classNames(classes.headerIcon, classes.headerIconCollapse) }}
              />
            </IconButton>
          </div>
          <img alt="headerLogo" src={headerLogo} height="48px" />
        </Box>
      )}
      <List>
        {entries.map(e => (
          <>
            <SidebarLink key={e.label} level={0} location={location} {...e} />
            {!!e.divider && <Divider />}
          </>
        ))}
      </List>
    </Drawer>
  );

  function handleWindowWidthChange() {
    const windowWidth = window.innerWidth;
    const breakpointWidth = theme.breakpoints.values.md;
    const isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
      // toggleSidebar(layoutDispatch);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
