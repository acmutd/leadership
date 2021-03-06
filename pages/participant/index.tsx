import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { GetServerSideProps, InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import Credits from "../../components/Credits";
import GridCard from "../../components/GridCard";
import NavBar from "../../components/NavBar";
import { getParticipants, participant } from "../../fetchData/getParticipants";

interface PageProps {
  participantList: participant[];
  roleList: string[];
  session: Session;
}

/**
 *
 * @param {participant[]} participantList list of members from the database. All members if no query is present, else subset
 * @param {string[]} roleList list of all roles, used for role query search bar auto-fill
 * @param {Session} session contains whether the user is signed in or not
 */
export default function MembershipPage({ participantList, roleList, session }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // contains subset of member objects based on name that is typed in the search bar
  const [filteredArray, setFilteredArray] = useState(participantList);

  // contains the list of all names only that is used to populate the search bar auto-fill
  const [participantNames, setParticipantNames] = useState<string[]>([]);

  // contains the list of all roles that is used to populate the role query bar auto-fill
  const [roleArray, setRoleArray] = useState(roleList);

  const router = useRouter();

  // Filters array based on search bar input
  const onchange = (event: string) => {
    const searchString = event.toLowerCase();
    setFilteredArray(
      participantList.filter((item) =>
        item.name.toLowerCase().includes(searchString)
      )
    );
  };

  const onrolechange = (role: string) => {
    window.location.href = router.basePath + "?q=" + role;
    // commented section works locally but not on vercel
    // router.replace(router.basePath + "?q=" + role);
    // router.reload();
  };

  const fetchQuery = () => {
    return router.query.q ? router.query.q as string : "";
  };

  // Sorts the array in ascending order by first name
  useEffect(() => {
    setFilteredArray(
      participantList.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      )
    );
    setParticipantNames(
      filteredArray.map(({ id, name }, index) =>
        name.length < 16 ? name : name.split(" ")[0]
      )
    );
  }, []);

  const Grids = filteredArray.map(({ id, name }, index) => {
    return (
      <GridCard id={id} name={name} path="participant" key={index}/>
    );
  });

  return (
    <Fragment>
      <Head>
        <title>
          Membership{fetchQuery() === "" ? "" : `: ${fetchQuery()}`} | ACM
          Leadership
        </title>
        <meta
          property="og:title"
          content="Membership | ACM Leadership"
          key="title"
        />
      </Head>
      <Container maxWidth="lg">
        <NavBar
          session={session}
          filter={true}
          roleArray={roleArray}
          onRoleChange={onrolechange}
          search={true}
          officerArray={participantNames}
          onSearchChange={onchange}
        />
        <Grid
          style={{ paddingTop: 90, paddingBottom: 24 }}
          container
          alignItems="center"
          justifyContent="center"
        >
          {Grids}
        </Grid>
        <Credits />
      </Container>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const { participants, programs } = await getParticipants(context.query.q as string);
  const session = await getSession(context);

  if (!participants || !programs) {
    return {
      notFound: true,
    };
  }
  return {
    props: { participantList: participants, roleList: programs, session }, // will be passed to the page component as props
  };
}
