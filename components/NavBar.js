import React, { Fragment } from "react";
import Link from "next/link";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useTheme } from "next-themes";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { signIn, signOut } from "next-auth/client";

export default function NavBar({
  session,
  filter = false,
  roleArray,
  onRoleChange,
  search = false,
  officerArray,
  onSearchChange,
}) {
  const { theme, setTheme } = useTheme();

  return (
    <Fragment>
      <AppBar style={{ marginBottom: 12 }}>
        <Toolbar>
          <IconButton edge="start" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Link href={`/`} passHref>
            <Button size="small" style={{ marginRight: 24 }}>
              <Typography variant="inherit" component="div">
                ACM Leadership
              </Typography>
            </Button>
          </Link>
          <Link href={`/participant`} passHref>
            <Button size="small" style={{ marginRight: 24 }}>
              <Typography variant="inherit" component="div">
                Membership
              </Typography>
            </Button>
          </Link>
          <Fragment>
            <Button onClick={() => setTheme("light")} size="small">
              <Typography variant="inherit" component="div">
                Light Mode
              </Typography>
            </Button>
            <Button onClick={() => setTheme("dark")} size="small">
              <Typography variant="inherit" component="div">
                Dark Mode
              </Typography>
            </Button>
          </Fragment>
          {search ? (
            <Autocomplete
              disablePortal
              style={{ marginLeft: 60 }}
              id="combo-box"
              options={officerArray}
              sx={{ width: 200 }}
              renderInput={(params) => <TextField {...params} label="Search" />}
              onInputChange={(event, newValue) => {
                onSearchChange(newValue);
              }}
            />
          ) : (
            <div></div>
          )}
          {filter ? (
            <Autocomplete
              disablePortal
              style={{ marginLeft: 60 }}
              id="combo-box"
              options={roleArray}
              sx={{ width: 400 }}
              renderInput={(params) => <TextField {...params} label="Role" />}
              onChange={(event, newValue) => {
                onRoleChange(newValue);
              }}
            />
          ) : (
            <div></div>
          )}
          {!session ? (
            <Button onClick={() => signIn("google")} size="small">
              <Typography variant="inherit" component="div">
                Sign In
              </Typography>
            </Button>
          ) : (
            <Button onClick={() => signOut()} size="small">
              <Typography variant="inherit" component="div">
                Sign Out
              </Typography>
            </Button>
          )}
          <Link href={`/admin`} passHref>
            <Button size="small">
              <Typography variant="inherit" component="div">
                Admin
              </Typography>
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}
