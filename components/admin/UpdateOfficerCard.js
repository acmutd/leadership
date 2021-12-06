import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
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
import CheckIcon from "@mui/icons-material/Check";
import LoopIcon from "@mui/icons-material/Loop";
import axios from "axios";
import { updateProfileImage } from "../../fetchData/fetchProfileImage";

export default function UpdateOfficerCard({ officerArray }) {
  const router = useRouter();
  // contains the list of all names only that is used to populate the search bar auto-fill
  const [officerNames, setOfficerNames] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [acm_email, setACM_Email] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [file, setFile] = useState(null);

  // api status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // validation
  const [error, setError] = useState(false);

  const UpdateOfficer = async () => {
    setError(false);
    if (name === "" || email === "" || acm_email === "" || linkedin === "") {
      setError(true);
      return;
    }

    setLoading(true);
    const result = await axios.post(
      router.basePath + "/api/admin/updateOfficer",
      {
        name: name,
        email: email,
        acm_email: acm_email,
        linkedin: linkedin,
      }
    );

    if (file !== null) {
      await updateProfileImage(result.data.id, file);
    }

    setLoading(false);
    if (result.data.message === "success") {
      setSuccess(true);
    }
  };

  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
    setFile(acceptedFiles[0]);
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
            Update existing officer
          </Typography>

          <Autocomplete
            disablePortal
            style={{
              marginLeft: 90,
              marginRight: 90,
              marginTop: 24,
              marginBottom: 24,
            }}
            // sx={{ width: 300 }}
            id="combo-box"
            options={officerNames}
            renderInput={(params) => <TextField {...params} label="Search" />}
            onInputChange={(event, newValue) => {
              setName(newValue);
            }}
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

          <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Typography variant="h6" component="div">
                    Update Image (Optional)
                  </Typography>
                </div>
              </section>
            )}
          </Dropzone>
        </CardContent>

        <CardActions>
          <Button color="inherit" size="small" onClick={() => UpdateOfficer()}>
            Submit
          </Button>
          {loading ? <LoopIcon /> : <div></div>}
          {success ? <CheckIcon /> : <div></div>}

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