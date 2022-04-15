import CheckIcon from "@mui/icons-material/Check";
import LoopIcon from "@mui/icons-material/Loop";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { officer } from "../../fetchData/getOfficers";

interface PageProps {
  officerArray: officer[];
  historian: string[];
  session: Session;
}

interface response {
  data: {
    message: string;
  };
}

export default function AddHistorianCard({
  officerArray,
  historian,
  session,
}: PageProps) {
  const router = useRouter();
  // contains the list of all names only that is used to populate the search bar auto-fill
  const [officerNames, setOfficerNames] = useState<string[]>([]);
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
    const result = await axios.post<any, response>(
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

  const RemoveHistorian = async (email: string) => {
    setLoading(true);
    const result = await axios.post<any, response>(
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
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="inherit">{historian}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Button
              size="small"
              onClick={() => {
                session.user.email === historian
                  ? alert("You can't revoke your own access :)")
                  : RemoveHistorian(historian);
              }}
            >
              {session.user.email === historian
                ? "👀 Revoke Access 👀"
                : "Revoke Access"}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  });

  return (
    <Grid item md={12} lg={6}>
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

          <Typography
            variant="inherit"
            component="div"
            style={{ marginBottom: 24 }}
          >
            Historians have access to the leadership site admin dashboard and
            can add, edit and modify content displayed. Grant acccess on
            request.
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
              variant="inherit"
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
