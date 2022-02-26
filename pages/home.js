import Link from "next/link";
import Head from "next/head";
import { Fragment } from "react";
import { getSession } from "next-auth/client";
import Container from "@material-ui/core/Container";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import BottomNavigation from '@mui/material/BottomNavigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavBar from "../components/NavBar";

export default function Home({ session }) {
  return (
    <Fragment>
      <Head>
        <title>Home | ACM Leadership</title>
        <meta property="og:title" content="Home | ACM Leadership" key="title" />
      </Head>
      <Container maxWidth="lg">
        <NavBar session={session} />
        <Grid
          style={{ paddingTop: 90, paddingBottom: 24 }}
          container
          justify="center"
        >
          {/* Leadership */}
          <Grid item xs={12} lg={4} align="center" style={{ padding: 50 }}>
            <Card raised style={{ width: 400, minWidth: 250, height: 400 }}>
              <CardContent>
                <Typography variant="h5" component="div" style={{ marginBottom: 24}}>
                  Leadership
                </Typography>
                <Typography variant="body2" component="div" style={{ width: 300 }}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </Typography>
              </CardContent>
              <CardActions>
                <Link href={`/profile`} passHref>
                  <Button color="inherit" size="small">
                    View <ArrowForwardIcon />
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>

          {/* Members */}
          <Grid item xs={12} lg={4} align="center" style={{ padding: 50 }}>
            <Card raised style={{ width: 400, minWidth: 250, height: 400 }}>
              <CardContent>
                <Typography variant="h5" component="div" style={{ marginBottom: 24}}>
                  Membership
                </Typography>
                <Typography variant="body2" component="div" style={{ width: 300 }}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </Typography>
              </CardContent>
              <CardActions>
                <Link href={`/participant`} passHref>
                  <Button color="inherit" size="small">
                    View <ArrowForwardIcon />
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>

          {/* Teams */}
          <Grid item xs={12} lg={4} align="center" style={{ padding: 50 }}>
            <Card raised style={{ width: 400, minWidth: 250, height: 400 }}>
              <CardContent>
                <Typography variant="h5" component="div" style={{ marginBottom: 24}}>
                  Programs
                </Typography>
                <Typography variant="body2" component="div" style={{ width: 300 }}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </Typography>
              </CardContent>
              <CardActions>
                <Link href={`/team`} passHref>
                  <Button color="inherit" size="small">
                    View <ArrowForwardIcon />
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  return { props: { session } };
};
