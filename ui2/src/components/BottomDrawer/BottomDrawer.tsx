import React from "react";
import Drawer from "@material-ui/core/Drawer";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { useLayoutState } from "../../context/LayoutContext";
import useStyles from "../../pages/styles";
import { useStreamQueries } from "@daml/react";
import { getName } from "../../config";
import { AssetDeposit } from "@daml.js/da-marketplace/lib/DA/Finance/Asset";

export const BottomDrawer = () => {
  const classes = useStyles();
  // const theme = useTheme() as Theme;

  // const [ open, setOpen ] = useState(true);
  const { isSidebarOpened } = useLayoutState();
  // const layoutDispatch = useLayoutDispatch();
  // const [isPermanent, setPermanent] = useState(true);

  const assets = useStreamQueries(AssetDeposit).contracts;
  console.log(assets);
  return (
    <Drawer anchor="bottom" open={isSidebarOpened} variant="persistent">
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}><b>Account</b></TableCell>
            <TableCell key={1} className={classes.tableCell}><b>Provider</b></TableCell>
            <TableCell key={2} className={classes.tableCell}><b>Quantity</b></TableCell>
            <TableCell key={3} className={classes.tableCell}><b>Asset</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((c, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{c.payload.account.id.label}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{getName(c.payload.account.provider)}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{c.payload.asset.quantity}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{c.payload.asset.id.label}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Drawer>
  );
}
