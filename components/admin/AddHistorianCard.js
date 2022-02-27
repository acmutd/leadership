import CheckIcon from "@mui/icons-material/Check";
import LoopIcon from "@mui/icons-material/Loop";
import Autocomplete from "@mui/material/Autocomplete";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AddHistorianCard({ officerArray, historian }) {
  const router = useRouter();
  // contains the list of all names only that is used to populate the search bar auto-fill
  const [officerNames, setOfficerNames] = useState([]);
  const [viewHistorian, setViewHistorian] = useState(false);

  const [name, setName] = useState("");

  // api status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // validation
  const [error, setError] = useState(false);

  const AddHistorian = async () => {
    setError(false);
    if (name === "") {
      setError(true);
      return;
    }
    
    setLoading(true);
    const result = await axios.post(
      router.basePath + "/api/admin/addHistorian",
      {
        name: name,
      }
    );

    setLoading(false);
    if (result.data.message === "success") {
      setSuccess(true);
    }
  };

  const RemoveHistorian = async (email) => {
    setLoading(true);
    const result = await axios.post(
      router.basePath + "/api/admin/removeHistorian",
      {
        email: email,
      }
    );

    setLoading(false);
    if (result.data.message === "success") {
      setSuccess(true);
    }
  };

  const ToggleHistorianView = () => {
    setViewHistorian(!viewHistorian);
  };

  // Sorts the array in ascending order by first name
  useEffect(() => {
    setOfficerNames(officerArray.map(({ id, name }, index) => name));
  }, []);

  const HistorianList = historian.map((historian, index) => {
    return (
      <div key={index}>
        <Typography variant="h6">{historian}</Typography>
        <Button
          size="small"
          onClick={() => {
            RemoveHistorian(historian);
          }}
        >
          Revoke Access
        </Button>
      </div>
    );
  });

  return (
    <Grid item md={12} lg={6} align="center">
      <Card raised style={{ width: 300, minWidth: 500, margin: 8 }}>
        <CardContent>
          <Typography variant="h3" component="div">
            Add Historian
          </Typography>

          <Autocomplete
            disablePortal
            style={{
              marginLeft: 90,
              marginRight: 90,
              marginTop: 24,
              marginBottom: 24,
            }}
            id="combo-box"
            options={officerNames}
            renderInput={(params) => <TextField {...params} label="Search" />}
            onInputChange={(event, newValue) => {
              setName(newValue);
            }}
          />

          <Typography variant="inherit" component="div">
            Historians have access to the leadership site admin dashboard and can add, edit and modify content displayed. Grant acccess on request.
          </Typography>

          {viewHistorian ? HistorianList : <div></div>}
        </CardContent>

        <CardActions>
          <Button color="inherit" size="small" onClick={() => AddHistorian()}>
            Submit
          </Button>
          {loading ? <LoopIcon /> : <div></div>}
          {success ? <CheckIcon /> : <div></div>}
          <Button
            color="inherit"
            size="small"
            onClick={() => ToggleHistorianView()}
          >
            {viewHistorian ? "Hide Historians" : "View Historians"}
          </Button>
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
