import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Autocomplete from "@mui/material/Autocomplete";
import CheckIcon from '@mui/icons-material/Check';
import LoopIcon from '@mui/icons-material/Loop';
import axios from "axios";

export default function ExitOfficerCard({ officerArray }) {
  const router = useRouter();
  // contains the list of all names only that is used to populate the search bar auto-fill
  const [officerNames, setOfficerNames] = useState([]);

  const [name, setName] = useState("");

  // api status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // validation
  const [error, setError] = useState(false);

  const ExitOfficer = async () => {
    setError(false);
    if (name === "") {
      setError(true);
      return;
    }

    setLoading(true);
    const result = await axios.post(router.basePath + "/api/admin/exitOfficer", {
      name: name,
    });

    setLoading(false);
    if (result.data.message === "success") {
      setSuccess(true);
    }
  };

  // Sorts the array in ascending order by first name
  useEffect(() => {
    setOfficerNames(officerArray.map(({ id, name }, index) => name));
  }, []);

  return (
    <Grid item md={12} lg={6} align="center">
      <Card raised style={{ width: 300, minWidth: 600, margin: 8 }}>
        <CardContent>
          <Typography variant="h3" component="div">
            Exit Officer
          </Typography>

          <Autocomplete
            disablePortal
            style={{ marginLeft: 90, marginRight: 90, marginTop: 24, marginBottom: 24 }}
            id="combo-box"
            options={officerNames}
            renderInput={(params) => <TextField {...params} label="Search" />}
            onInputChange={(event, newValue) => {
              setName(newValue);
            }}
          />
        </CardContent>

        <CardActions>
          <Button color="inherit" size="small" onClick={() => ExitOfficer()}>
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
