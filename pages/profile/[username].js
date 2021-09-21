import Link from "next/link";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Button, Typography } from "@material-ui/core";

import { getProfileData } from "../../fetchData/getProfileData";

export default function SSRPage({ data }) {
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
      <Container maxWidth="lg">
        <Typography style={{ margin: 12 }} variant="h3" component="div">
          {data.name}
        </Typography>
        {data.end === "Sat Jun 19 2021" ? (
          <Typography variant="text" component="div">
            {data.start} to Present
          </Typography>
        ) : (
          <Typography variant="text" component="div">
            {data.start} to {data.end}
          </Typography>
        )}
        <Typography style={{ margin: 12 }} variant="h5" component="div">
          Roles
        </Typography>
        {data.roles.map((role, index) => {
          return (
            <Typography style={{ margin: 6 }} variant="text" component="div">
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

export const getServerSideProps = async ({ params }) => {
  const { username } = params;
  const profile = await getProfileData(username);
  if (!profile) {
    return { notFound: true };
  }
  return { props: { data: profile } };
};
