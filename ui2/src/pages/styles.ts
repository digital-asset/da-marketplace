import { makeStyles, createStyles } from "@material-ui/styles";

export default makeStyles((theme : any) => createStyles({
  tableCell: {
    verticalAlign: "center",
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: "0.75rem"
  },
  tableCellSmall: {
    verticalAlign: "center",
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: "0.7rem"
  },
  tableCellMini: {
    verticalAlign: "center",
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 6,
    fontSize: "0.6rem"
  },
  tableCellButton: {
    verticalAlign: "center",
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: "0.75rem"
  },
  tableRow: {
    height: "auto"
  },
  heading: {
    padding: "10px",
    textAlign: "center"
    // fontSize: theme.typography.pxToRem(15),
    // fontWeight: theme.typography.fontWeightRegular,
  },
  buttonLifecycle: {
    width: "90%",
    paddingTop: 2,
    paddingBottom: 2,
  },
  choiceButton: {
    paddingTop: 0,
    paddingBottom: 0,
    marginRight: 5,
    color: "white"
  },
  newButton: {
    marginTop: 50,
  },
  inputField: {
    marginTop: 10
  },
  width90: {
    width: "90%"
  },
  width50: {
    width: "50%"
  },
  marginLeft10: {
    marginLeft: 10
  },
  default: {
    fill: "#fff",
  },
  green: {
    fill: "#009900",
  },
  yellow: {
    fill: "#999900"
  },
  red: {
    fill: "#990000"
  },
  chipYellow: {
    color: "white",
    backgroundColor: "#999900",
    verticalAlign: "top",
  },
  chipGreen: {
    color: "white",
    backgroundColor: "#009900",
    verticalAlign: "top",
  },
  paper: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: theme.palette.background.paper
  },
  paperHeading: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  actionButton: {
    margin: 20
  },
  dot: {
    padding: 0,
    borderColor: "#009900",
    backgroundColor: "white",
  },
  mobileScreen: {
    height: `calc(100vh - 144px)`
  },
  fullWidth: {
    width: "100%"
  },
  buttonMargin: {
    marginTop: "20px",
  },
  buttonGreen: {
    root: {
      '&$selected': {
        backgroundColor: "green",
        '& + &': {
          backgroundColor: "green",
          borderLeft: 0,
          marginLeft: 0,
        },
      }
    }
  }
}));
