import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';

export default function customComponent() {

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
