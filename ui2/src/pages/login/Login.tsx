import React, { useState } from "react";
import { Grid, CircularProgress, Typography, Button, TextField } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import useStyles from "./styles";
import loginLogo from "../../images/companyLogo.svg";
import { useUserDispatch, loginUser, loginDablUser } from "../../context/UserContext";
import { isLocalDev } from "../../config";

function Login(props : RouteComponentProps) {
  var classes = useStyles();

  var userDispatch = useUserDispatch();

  var [isLoading, setIsLoading] = useState(false);
  var [, setError] = useState(false);
  var [loginValue, setLoginValue] = useState("");

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} sm={12} md={6}>
        <div className={classes.logotypeContainer}>
          <img src={loginLogo} alt="logo" className={classes.logotypeImage} />
          <Typography className={classes.logotypeText}>MARKETPLACE</Typography>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <div className={classes.formContainer}>
          <div className={classes.form}>
              <>
                {!isLocalDev &&
                  <>
                    <Button className={classes.dablLoginButton} variant="contained" color="primary" size="large" onClick={loginDablUser}>Log in with DAML Hub</Button>
                    <Typography>OR</Typography>
                  </>}
                <TextField
                  InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                  value={loginValue}
                  onChange={e => setLoginValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      loginUser(
                        userDispatch,
                        loginValue,
                        props.history,
                        setIsLoading,
                        setError,
                      )
                    }
                  }}
                  margin="normal"
                  placeholder="Username"
                  fullWidth
                />
                <div className={classes.formButtons}>
                  {isLoading ?
                    <CircularProgress size={26} className={classes.loginLoader} />
                  : <Button
                      disabled={loginValue.length === 0}
                      onClick={() =>
                        loginUser(
                          userDispatch,
                          loginValue,
                          props.history,
                          setIsLoading,
                          setError,
                        )
                      }
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Login
                    </Button>}
                </div>
              </>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default withRouter(Login);
