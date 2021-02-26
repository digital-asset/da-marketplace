import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Card, CardActionArea, CardMedia, CardContent, Typography, Grid, Box } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import networkImage from "./images/network.jpg";
import custodyImage from "./images/custody.jpg";
import registryImage from "./images/registry.png";
import issuanceImage from "./images/issuance.jpg";
import distributionImage from "./images/distribution.png";
import listingImage from "./images/listing.jpg";
import tradingImage from "./images/trading.jpg";
import Header from "./components/Header/Header";

export default function Apps({ history } : RouteComponentProps) {
  const classes = useStyles();

  return (
    <>
      <Header app="Portal" />
      <Grid container direction="column">
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={3}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/network/custody")}>
                      <CardMedia className={classes.media} image={networkImage} title="Network" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Network</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Manage your network and relationships</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/custody/accounts")}>
                      <CardMedia className={classes.media} image={custodyImage} title="Custody" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Custody</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Manage your custodial services</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/registry/instruments")}>
                      <CardMedia className={classes.media} image={registryImage} title="Registry" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Registry</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Register new instruments</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/issuance/issuances")}>
                      <CardMedia className={classes.media} image={issuanceImage} title="Issuance" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Issuance</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Manage your asset issuance</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/distribution/auctions")}>
                      <CardMedia className={classes.media} image={distributionImage} title="Distribution" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Distribution</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Manage your primary distributions</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/listing/listings")}>
                      <CardMedia className={classes.media} image={listingImage} title="Listing" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Listing</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Manage your exchange listings</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/trading/markets")}>
                      <CardMedia className={classes.media} image={tradingImage} title="Trading" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Trading</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Manage your trading activities</Typography>
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
