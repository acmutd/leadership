import Container from "@mui/material/Container";
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
import Timeline from "react-calendar-timeline";
import { getRoles, full_role } from "../fetchData/getRoles";

// make sure you include the timeline stylesheet or the timeline will not be styled
import "react-calendar-timeline/lib/Timeline.css";

interface PageProps {
  session: Session;
  roles: full_role[];
}

export default function Home({
  session,
  roles,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const unique = [...new Set(roles.map(item => item.name))];

  const nameToId = {};

  for (const name in unique) {
    nameToId[unique[name]] = name;
  }

  const g = unique.map((name, index) => {
    return {
      id: index,
      title: name,
    }
  });


  const i = roles.map((role, index) => {
    return { 
      id: index,
      group: nameToId[role.name],
      title: role.title,
      start_time: new Date(role.start as string),
      end_time: new Date(role.end as string),
    }
  })

  return (
    <Fragment>
      <Head>
        <title>Timeline | ACM Leadership</title>
        <meta
          property="og:title"
          content="Timeline | ACM Leadership"
          key="title"
        />
      </Head>
      <Container>
        <NavBar session={session} />
        <Timeline
          groups={g}
          items={i}
          defaultTimeStart={new Date("January 1, 2020")}
          defaultTimeEnd={new Date("May 1, 2022")}
          style={{ marginTop: 150 }}
        />
      </Container>
    </Fragment>
  );
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  const roles = await getRoles();
  return { props: { session, roles: roles } };
};
