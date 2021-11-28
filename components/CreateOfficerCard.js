import { useRouter } from "next/router";
import { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

export default function CreateOfficerCard({ roleList }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [acm_email, setACM_Email] = useState("");
  const [role, setRole] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // api status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const CreateOfficer = async () => {
    setLoading(true);
    const result = await axios.post(
      router.basePath + "/api/admin/createOfficer",
      {
        name: name,
        email: email,
        acm_email: acm_email,
        role: role,
        linkedin: linkedin,
      }
    );
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
            Add new officer
          </Typography>

          <TextField
            style={{ margin: 24 }}
            id="standard-basic"
            label="Officer Name"
            variant="standard"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            style={{ margin: 24 }}
            id="standard-basic"
            label="Officer Linkedin"
            variant="standard"
            onChange={(e) => setLinkedin(e.target.value)}
            required
          />
          <TextField
            style={{ margin: 24 }}
            id="standard-basic"
            label="Personal Email"
            variant="standard"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            style={{ margin: 24 }}
            id="standard-basic"
            label="ACM Email"
            onChange={(e) => setACM_Email(e.target.value)}
            variant="standard"
            required
          />
          <Autocomplete
            disablePortal
            style={{ marginLeft: 90, marginRight: 90, marginTop: 24, marginBottom: 24 }}
            id="combo-box"
            options={roleList}
            renderInput={(params) => <TextField {...params} label="Role" />}
            onInputChange={(event, newValue) => {
              setRole(newValue);
            }}
          />
        </CardContent>

        <CardActions>
          <Button color="inherit" size="small" onClick={() => CreateOfficer()}>
            Submit
          </Button>
          { loading ? <LoopIcon /> : <div></div> }
          { success ? <CheckIcon /> : <div></div> }
        </CardActions>
      </Card>
    </Grid>
  );
}
