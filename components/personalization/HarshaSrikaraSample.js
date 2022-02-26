import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function customComponent() {
  const classes = useStyles();

  return (
      <AppBar position="static" style={{marginBottom: 12}}>
        <Toolbar>
          <Typography variant="h6">
            Hi There
          </Typography>
          <Button href="https://harshasrikara.dev" color="inherit">Me</Button>
        </Toolbar>
      </AppBar>
  );
}
