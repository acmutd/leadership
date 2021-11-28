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
import CreateOfficerCard from "../../components/CreateOfficerCard";
import CreateRoleCard from "../../components/CreateRoleCard";
import UpdateOfficerCard from "../../components/UpdateOfficerCard";
import ExitOfficerCard from "../../components/ExitOfficerCard";
import AddOfficerRole from "../../components/AddOfficerRole";
import axios from "axios";

export default function Admin({ officerList, roleList, historian, session }) {
  const router = useRouter();

  // pretty simple check for historian permission, refer to issue #12345 for improvement scheme
  if (!session || !historian.includes(session.user.email)) {
    return <AccessDenied />;
  }

  return (
    <Fragment>
      <Container maxWidth="lg">
        <NavBar session={session} />
        <Grid style={{ paddingTop: 90, paddingBottom: 24 }} container justify="center">
          <CreateOfficerCard roleList={roleList}/>
          <UpdateOfficerCard officerArray={officerList}/>
          <CreateRoleCard />
          <ExitOfficerCard officerArray={officerList}/>
          <AddOfficerRole officerArray={officerList} roleList={roleList}/>
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
