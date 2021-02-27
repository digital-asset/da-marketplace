import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Card, CardActionArea, CardMedia, CardContent, Typography, Grid, Box } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import binaryOptionImage from "../../images/binary-option.png";
import convertibleNoteImage from "../../images/convertible-note.png";

const NewComponent = ({ history } : RouteComponentProps) => {
  const classes = useStyles();

  return (
    <>
      <Grid container direction="column">
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={4}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/registry/instruments/new/binaryoption")}>
                      <CardMedia className={classes.media} image={binaryOptionImage} title="Binary Option" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Binary Option</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Create a binary option instrument</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/registry/instruments/new/convertiblenote")}>
                      <CardMedia className={classes.media} image={convertibleNoteImage} title="Convertible Note" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Convertible Note</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Create a binary option instrument</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

const useStyles = makeStyles((theme : any) => createStyles({
  root: {
    minWidth: 350,
    maxWidth: 350,
    marginTop: 200,
    backgroundColor: theme.palette.primary.main, //"#00565f",
  },
  media: {
    height: 140,
    backgroundColor: "white",
  },
  cardText: {
    color: "white",
  },
}));

export const New = withRouter(NewComponent);