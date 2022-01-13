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
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ApiIcon from "@mui/icons-material/Api";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

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
          {/* <IconButton edge="start" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Link href={`/`} passHref>
            <Button size="small" style={{ marginRight: 24 }}>
              <StarIcon />
              <Typography variant="inherit" component="div">
                ACM Leadership
              </Typography>
            </Button>
          </Link>
          <Link href={`/participant`} passHref>
            <Button size="small" style={{ marginRight: 24 }}>
              <PersonIcon />
              <Typography variant="inherit" component="div">
                Membership
              </Typography>
            </Button>
          </Link>
          <Link href={`/team`} passHref>
            <Button size="small" style={{ marginRight: 24 }}>
              <GroupsIcon />
              <Typography variant="inherit" component="div">
                Programs
              </Typography>
            </Button>
          </Link>
          <Fragment>
            <Button onClick={() => setTheme("light")} size="small">
              <LightModeIcon />
              <Typography variant="inherit" component="div">
                {/* Light */}
              </Typography>
            </Button>
            <Button onClick={() => setTheme("dark")} size="small">
              <DarkModeIcon />
              <Typography variant="inherit" component="div">
                {/* Dark */}
              </Typography>
            </Button>
          </Fragment>
          {search ? (
            <Autocomplete
              disablePortal
              style={{ marginLeft: 60, marginTop: -12 }}
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
              style={{ marginLeft: 60, marginTop: -12 }}
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
              <LoginIcon />
              <Typography variant="inherit" component="div">
                Sign In
              </Typography>
            </Button>
          ) : (
            <Button onClick={() => signOut()} size="small">
              <LogoutIcon />
              <Typography variant="inherit" component="div">
                Sign Out
              </Typography>
            </Button>
          )}

          <Link href={`/admin`} passHref>
            <Button size="small" style={{ marginLeft: 8 }}>
              <AdminPanelSettingsIcon />
              <Typography variant="inherit" component="div">
                Admin
              </Typography>
            </Button>
          </Link>
          <Link href={`/api/graphql`} passHref>
            <Button size="small" style={{ marginLeft: 8 }}>
              <ApiIcon />
              <Typography variant="inherit" component="div">
                API
              </Typography>
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}
