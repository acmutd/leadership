import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ApiIcon from "@mui/icons-material/Api";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import AppBar from "@mui/material/AppBar";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/client";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { Fragment } from "react";

interface PageProps {
  session: Session;
  filter?: boolean;
  roleArray?: string[];
  onRoleChange?: (role: string) => void;
  search?: boolean;
  officerArray?: string[];
  onSearchChange?: (event: string) => void;
}

export default function NavBar({
  session,
  filter = false,
  roleArray = [],
  onRoleChange = (role) => {},
  search = false,
  officerArray = [],
  onSearchChange = (event) => {},
}: PageProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Fragment>
      <AppBar style={{ marginBottom: 12 }}>
        <Toolbar>
          <Link href={`/`} passHref>
            <Button size="small">
              <StarIcon />
              <Typography variant="inherit" component="div">
                Home
              </Typography>
            </Button>
          </Link>
          <Fragment>
            <Button onClick={() => setTheme("light")} size="small">
              <LightModeIcon />
            </Button>
            <Button onClick={() => setTheme("dark")} size="small">
              <DarkModeIcon />
            </Button>
          </Fragment>
          {search && (
            <Autocomplete
              disablePortal
              style={{ marginLeft: 30, marginTop: -15 }}
              id="combo-box"
              options={officerArray}
              sx={{ width: 150 }}
              renderInput={(params) => (
                <TextField {...params} label="Search" variant="standard" />
              )}
              onInputChange={(event, newValue) => {
                onSearchChange(newValue);
              }}
            />
          )}
          {filter && (
            <Autocomplete
              disablePortal
              style={{ marginLeft: 30, marginTop: -15, marginRight: 30 }}
              id="combo-box"
              options={roleArray}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Role" variant="standard" />
              )}
              onChange={(event, newValue) => {
                onRoleChange(newValue);
              }}
            />
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

          {session && (
            <Fragment>
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
              <Link href={`/settings`} passHref>
                <Button size="small" style={{ marginLeft: 8 }}>
                  <SettingsIcon />
                  <Typography variant="inherit" component="div">
                    Settings
                  </Typography>
                </Button>
              </Link>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}
