import { useRouter } from "next/router";
import { Fragment, useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import { getSession } from "next-auth/client";
import AccessDenied from "../../components/AccessDenied";
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
import { getOfficers } from "../../fetchData/getOfficers";
import NavBar from "../../components/NavBar";
import axios from "axios";

export default function Admin({ officerList, roleList, historian, session }) {
  const router = useRouter();

  // pretty simple check for historian permission, refer to issue #12345 for improvement scheme
  if (!session || !historian.includes(session.user.email)) {
    return <AccessDenied />;
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [acm_email, setACM_Email] = useState("");
  const [role, setRole] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const CreateOfficer = async () => {
    console.log({ name, email, acm_email, role, linkedin });
    await axios.post(router.basePath + "/api/admin/createOfficer", {
      name: name,
      email: email,
      acm_email: acm_email,
      role: role,
      linkedin: linkedin,
    });
  };

  return (
    <Fragment>
      <Container maxWidth="lg">
        <NavBar session={session} />
        <Grid style={{ paddingTop: 90, paddingBottom: 24 }} container>
          <Grid container item xs={12} md={6} lg={3}>
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
                  style={{ padding: 24 }}
                  id="combo-box"
                  options={roleList}
                  renderInput={(params) => (
                    <TextField {...params} label="Role" />
                  )}
                  onInputChange={(event, newValue) => {
                    setRole(newValue);
                  }}
                />
              </CardContent>

              <CardActions>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => CreateOfficer()}
                >
                  Submit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { officers, role_list, historian } = await getOfficers(context.query.q);
  const session = await getSession(context);

  if (!officers || !role_list || !historian) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      officerList: officers,
      roleList: role_list,
      historian: historian,
      session,
    }, // will be passed to the page component as props
  };
}
