import CheckIcon from "@mui/icons-material/Check";
import LoopIcon from "@mui/icons-material/Loop";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { uploadProfileImage } from "../../fetchData/fetchProfileImage";

export default function CreateOfficerCard({ roleList }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [acm_email, setACM_Email] = useState("");
  const [role, setRole] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [file, setFile] = useState(null);

  // api status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // validation
  const [error, setError] = useState(false);

  const CreateOfficer = async () => {
    setError(false);
    if (
      name === "" ||
      email === "" ||
      acm_email === "" ||
      role === "" ||
      linkedin === ""
    ) {
      setError(true);
      return;
    }
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
    if (file !== null) {
      await uploadProfileImage(result.data.id, file);
    }
    setLoading(false);
    if (result.data.message === "success") {
      setSuccess(true);
    }
  };

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const fileAsURL = () => {
    if (file === null) {
      return null;
    }
    return URL.createObjectURL(file);
  };

  return (
    <Grid item md={12} lg={6} align="center">
      <Card raised style={{ width: 300, minWidth: 500, margin: 8 }}>
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
            style={{
              marginLeft: 90,
              marginRight: 90,
              marginTop: 24,
              marginBottom: 24,
            }}
            id="combo-box"
            options={roleList}
            renderInput={(params) => <TextField {...params} label="Role" />}
            onInputChange={(event, newValue) => {
              setRole(newValue);
            }}
          />
          {file !== null && (
            <CardMedia
              component="img"
              height="365"
              image={fileAsURL()}
              alt={`${name}'s profile picture`}
              style={{ marginBottom: 8 }}
            />
          )}
          <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Button
                    color="inherit"
                    size="small"
                    style={{ textTransform: "none" }}
                  >
                    <Typography variant="h6" component="div">
                      Add profile picture
                    </Typography>
                  </Button>
                </div>
              </section>
            )}
          </Dropzone>
        </CardContent>

        <CardActions>
          <Button color="inherit" size="small" onClick={() => CreateOfficer()}>
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
