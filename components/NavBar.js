import React, { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useTheme } from "next-themes";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@material-ui/core/TextField";

export default function NavBar({
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
          <Typography onClick={() => {window.location.href = "http://localhost:3000"}} style={{ marginRight: 24 }} variant="h6">
            ACM Leadership
          </Typography>
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
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}
