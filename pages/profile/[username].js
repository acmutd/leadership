import Link from "next/link";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Button } from '@material-ui/core';

import { getProfileData } from "../../fetchData/getProfileData";

export default function SSRPage({ data }) {

  let CustomComponent
  try {
    CustomComponent = dynamic(() => import(`../../components/${data.name.replace(/\s/g, '')}`))
  } catch (e) {
    CustomComponent = `div`
  }
  return (
    <Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <h1>{data.name}</h1>
        {data.end === "Sat Jun 19 2021" ? <h5>{data.start} to Present</h5> : <h5>{data.start} to {data.end}</h5>}
        <h3>Roles</h3>
        {data.roles.map((role, index) => { return <p>{index+1}. {role}</p>})}
        <CustomComponent />
        {/* <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p> */}
        <Link href={`/`} passHref>
              <Button size="small"><ArrowBackIcon /> Return Home</Button>
            </Link>
      </Container>
    </Fragment>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { username } = params;
  const profile = await getProfileData(username);
  if (!profile) {
    return { notFound: true };
  }
  return { props: { data: profile } };
};
