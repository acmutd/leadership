import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { Fragment } from "react";
import NavBar from "../components/NavBar";
import HomeGrid from "../components/HomeGrid";

interface PageProps {
  session: Session;
}

export default function Home({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Fragment>
      <Head>
        <title>Home | ACM Leadership</title>
        <meta property="og:title" content="Home | ACM Leadership" key="title" />
      </Head>
      <Container maxWidth="lg">
        <NavBar session={session} />
        <Grid container alignItems="center" justifyContent="center" spacing={5}>
          <HomeGrid
            header="Leadership"
            text="View all ACM Officers!"
            path="/profile"
          />

          <HomeGrid
            header="Membership"
            text="View all ACM Members!"
            path="/participant"
          />
          <HomeGrid
            header="Programs"
            text="View all our programs!"
            path="/team"
          />
        </Grid>
      </Container>
    </Fragment>
  );
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  return { props: { session } };
};
