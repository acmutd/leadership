import { Fragment } from "react";
import { getSession } from "next-auth/client";
import NavBar from "../../components/NavBar";
import AccessDenied from "../../components/AccessDenied";
import { Grid } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { getOfficers } from "../../fetchData/getOfficers";
import CreateOfficerCard from "../../components/admin/CreateOfficerCard";
import CreateRoleCard from "../../components/admin/CreateRoleCard";
import UpdateOfficerCard from "../../components/admin/UpdateOfficerCard";
import ExitOfficerCard from "../../components/admin/ExitOfficerCard";
import AddOfficerRoleCard from "../../components/admin/AddOfficerRoleCard";
import AddHistorianCard from "../../components/admin/AddHistorianCard";

export default function Admin({ officerList, roleList, historian, session }) {
  // pretty simple check for historian permission, refer to issue #12345 for improvement scheme
  if (!session || !historian.includes(session.user.email)) {
    return <AccessDenied />;
  }

  return (
    <Fragment>
      <Container maxWidth="lg">
        <NavBar session={session} />
        <Grid
          style={{ paddingTop: 90, paddingBottom: 24 }}
          container
          justify="center"
        >
          <CreateOfficerCard roleList={roleList} />
          <UpdateOfficerCard officerArray={officerList} />
          <CreateRoleCard />
          <ExitOfficerCard officerArray={officerList} />
          <AddOfficerRoleCard officerArray={officerList} roleList={roleList} />
          <AddHistorianCard officerArray={officerList} historian={historian}/>
          
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
