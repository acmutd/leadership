import { useRouter } from "next/router";
import { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CheckIcon from '@mui/icons-material/Check';
import LoopIcon from '@mui/icons-material/Loop';
import axios from "axios";

export default function CreateRoleCard() {
  const router = useRouter();
  const [role, setRole] = useState("");

  // api status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // validation
  const [error, setError] = useState(false);

  const CreateRole = async () => {
    setError(false);
    if (role === "") {
      setError(true);
      return;
    }

    setLoading(true);
    const result = await axios.post(router.basePath + "/api/admin/createRole", {
      role: role,
    });
    setLoading(false);
    if (result.data.message === "success") {
      setSuccess(true);
    }
  };

  return (
    <Grid item md={12} lg={6} align="center">
      <Card raised style={{ width: 300, minWidth: 600, margin: 8 }}>
        <CardContent>
          <Typography variant="h3" component="div">
            Create new role
          </Typography>

          <TextField
            style={{ margin: 24, width: 300 }}
            id="standard-basic"
            label="Role Title"
            variant="standard"
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </CardContent>

        <CardActions>
          <Button color="inherit" size="small" onClick={() => CreateRole()}>
            Submit
          </Button>
          { loading ? <LoopIcon /> : <div></div> }
          { success ? <CheckIcon /> : <div></div> }

          {error ? (
            <Typography
              variant="text"
              color="secondary"
              component="div"
              style={{ marginBottom: 4 }}
            >
              Required fields must be filled out
            </Typography>
          ) : (
            <div></div>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
}
