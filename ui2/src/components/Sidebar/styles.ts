import { makeStyles, createStyles } from '@material-ui/styles';

const drawerWidth = 240;

export default makeStyles((theme: any) =>
  createStyles({
    menuButton: {
      marginLeft: 12,
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      // transition: theme.transitions.create("width", {
      //   easing: theme.transitions.easing.sharp,
      //   duration: theme.transitions.duration.enteringScreen,
      // }),
      backgroundColor: theme.palette.secondary.main,
    },
    drawerClose: {
      // transition: theme.transitions.create("width", {
      //   easing: theme.transitions.easing.sharp,
      //   duration: theme.transitions.duration.leavingScreen,
      // }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 40,
      [theme.breakpoints.down('sm')]: {
        width: drawerWidth,
      },
      backgroundColor: theme.palette.secondary.main,
    },
    toolbar: {
      ...theme.mixins.toolbar,
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    mobileBackButton: {
      marginTop: theme.spacing(0.5),
      marginLeft: theme.spacing(3) + 1,
      [theme.breakpoints.only('sm')]: {
        marginTop: 6, //theme.spacing(0.625),
      },
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    headerIcon: {
      fontSize: 28,
      color: theme.palette.text.primary,
    },
    headerIconCollapse: {
      color: theme.palette.text.primary,
    },
    headerMenuButton: {
      marginLeft: theme.spacing(2),
      padding: theme.spacing(0.5),
    },
    headerMenuButtonCollapse: {
      marginRight: theme.spacing(2),
    },
    headerMenuButtonSandwich: {
      marginLeft: 10,
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
      },
      padding: theme.spacing(0.5),
    },
    sidebarBox: {
      marginTop: 8,
      marginBottom: 8,
    },
  })
);
