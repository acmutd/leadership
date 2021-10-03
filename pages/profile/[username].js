import Link from "next/link";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import { getSession } from 'next-auth/client'
import AccessDenied from '../../components/AccessDenied';
import Container from "@material-ui/core/Container";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Button, Typography } from "@material-ui/core";
import NavBar from '../../components/NavBar';

import { getProfileData } from "../../fetchData/getProfileData";

export default function SSRPage({ data, session }) {
  if (!session) { return  <AccessDenied/> };

  let CustomComponent;
  try {
    CustomComponent = dynamic(() =>
      import(`../../components/${data.name.replace(/\s/g, "")}`)
    );
  } catch (e) {
    CustomComponent = `div`;
  }
  return (
    <Fragment>
      <NavBar />
      <Container maxWidth="lg">
      <NavBar />
      {/* <Typography style={{ margin: 12 }} variant="inherit" component="div">
          {session.user.name} {session.user.email} {session.user.image}
        </Typography> */}
        <Typography style={{ margin: 12 }} variant="h3" component="div">
          {data.name}
        </Typography>
        {data.end === "Sat Jun 19 2021" ? (
          <Typography variant="inherit" component="div">
            {data.start} to Present
          </Typography>
        ) : (
          <Typography variant="inherit" component="div">
            {data.start} to {data.end}
          </Typography>
        )}
        <Typography style={{ margin: 12 }} variant="h5" component="div">
          Roles
        </Typography>
        {data.roles.map((role, index) => {
          return (
            <Typography style={{ margin: 6 }} variant="inherit" component="div" key={index}>
              {index + 1}. {role}
            </Typography>
          );
        })}
        <CustomComponent />
        <Link href={`/`} passHref>
          <Button style={{ margin: 12 }} size="small">
            <ArrowBackIcon /> Return Home
          </Button>
        </Link>
      </Container>
    </Fragment>
  );
}

export const getServerSideProps = async (context) => {
  const { username } = context.params;
  const session = await getSession(context)

  const profile = await getProfileData(username);
  if (!profile) {
    return { notFound: true };
  }
  return { props: { data: profile, session } };
};
