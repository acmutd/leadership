import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { InferGetStaticPropsType, GetStaticProps } from 'next';
import { Session } from "next-auth";
import { useSession } from "next-auth/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import Credits from "../components/Credits";
import GridCard from "../components/GridCard";
import NavBar from "../components/NavBar";
import { getOfficers, officer } from "../fetchData/getOfficers";

interface PageProps {
  officerList: officer[];
  roleList: string[];
}


/**
 *
 * @param {officer[]} officerList list of officers from the database. All officers if no query is present, else subset
 * @param {string[]} roleList list of all roles, used for role query search bar auto-fill
 * @param {Session} session contains whether the user is signed in or not
 */
export default function LeadershipPage({ officerList, roleList }: InferGetStaticPropsType<typeof getStaticProps>) {

  // session
  const [session, loading] = useSession();

  // contains subset of officer objects based on name that is typed in the search bar
  const [filteredArray, setFilteredArray] = useState(officerList);

  // contains the list of all names only that is used to populate the search bar auto-fill
  const [officerNames, setOfficerNames] = useState<string[]>([]);

  // contains the list of all roles that is used to populate the role query bar auto-fill
  const [roleArray, setRoleArray] = useState(roleList);

  const router = useRouter();

  // Filters array based on search bar input
  const onchange = (event: string) => {
    const searchString = event.toLowerCase();
    setFilteredArray(
      officerList.filter((item) =>
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
    return router.query.q ? router.query.q : "";
  };

  useEffect(() => {

    // filters the list of officers displayed based on query
    if(router.query.q) {
      (async () => {
        const { officers } = await getOfficers(router.query.q as string);
        setFilteredArray(officers);
      })();
    }

    // Sorts the array in ascending order by first name
    setFilteredArray(
      officerList.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      )
    );

    // Trim displayed name to just first name if total length is >16 characters
    setOfficerNames(
      filteredArray.map(({ id, name }, index) =>
        name.length < 16 ? name : name.split(" ")[0]
      )
    );
  }, []);

  const Grids = filteredArray.map(({ id, name }, index) => {
    return <GridCard id={id} name={name} path="profile" key={index} />;
  });

  return (
    <Fragment>
      <Head>
        <title>
          Leadership{fetchQuery() === "" ? "" : `: ${fetchQuery()}`} | ACM
          Leadership
        </title>
        <meta
          property="og:title"
          content="Leadership | ACM Leadership"
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
          officerArray={officerNames}
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

// export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
//   const { officers, role_list } = await getOfficers(context.query.q as string);
//   const session = await getSession(context);

//   if (!officers || !role_list) {
//     return {
//       notFound: true,
//     };
//   }
//   return {
//     props: { officerList: officers, roleList: role_list, session }, // will be passed to the page component as props
//   };
// };

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const { officers, role_list } = await getOfficers();

  return {
    props: { officerList: officers, roleList: role_list },
  }
  // ...
}