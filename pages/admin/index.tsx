import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Session } from 'next-auth';
import { getSession } from "next-auth/client";
import Head from "next/head";
import { Fragment } from "react";
import AccessDenied from "../../components/AccessDenied";
import AddHistorianCard from "../../components/admin/AddHistorianCard";
import AddOfficerRoleCard from "../../components/admin/AddOfficerRoleCard";
import CreateOfficerCard from "../../components/admin/CreateOfficerCard";
import CreateRoleCard from "../../components/admin/CreateRoleCard";
import ExitOfficerCard from "../../components/admin/ExitOfficerCard";
import UpdateOfficerCard from "../../components/admin/UpdateOfficerCard";
import NavBar from "../../components/NavBar";
import { getOfficers, officer } from "../../fetchData/getOfficers";

interface PageProps {
  officerList: officer[];
  roleList: string[];
  historian: string[];
  session: Session;
}

export default function AdminPage({ officerList, roleList, historian, session }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // pretty simple check for historian permission, refer to issue #12345 for improvement scheme
  if (!session || !historian.includes(session.user.email)) {
    return <AccessDenied />;
  }

  return (
    <Fragment>
      <Head>
        <title>Admin | ACM Leadership</title>
        <meta property="og:title" content="Admin | ACM Leadership" key="title" />
      </Head>
      <Container maxWidth="lg">
        <NavBar session={session} />
        <Grid
          style={{ paddingTop: 90, paddingBottom: 24 }}
          container
          alignItems="center"
          justifyContent="center"
        >
          <CreateOfficerCard roleList={roleList} />
          <UpdateOfficerCard officerArray={officerList} />
          <CreateRoleCard />
          <ExitOfficerCard officerArray={officerList} />
          <AddOfficerRoleCard officerArray={officerList} roleList={roleList} />
          <AddHistorianCard officerArray={officerList} historian={historian} session={session}/>
          
        </Grid>
      </Container>
    </Fragment>
  );
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const { officers, role_list, historian } = await getOfficers(context.query.q as string);
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
