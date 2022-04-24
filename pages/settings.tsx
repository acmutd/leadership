import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import AccessDenied from "../components/AccessDenied";
import NavBar from "../components/NavBar";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";
import { Session } from "next-auth";

interface response {
  data: {
    token: string;
  };
}

interface PageProps {
  session: Session;
}

export default function SettingsPage({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!session) {
    return <AccessDenied />;
  }
  const router = useRouter();

  const [accessToken, setAccessToken] = useState("");

  const getAccessToken = async () => {
    const res = await axios.post<any, response>(
      router.basePath + "/api/auth/token",
      {},
      {}
    );
    setAccessToken(res.data.token);
  };

  return (
    <Fragment>
      <Head>
        <title>Settings | ACM Leadership</title>
        <meta
          property="og:title"
          content="Settings | ACM Leadership"
          key="title"
        />
      </Head>
      <Container maxWidth="lg">
        <NavBar session={session} />
        <div style={{ paddingTop: 90 }}>
          <Typography style={{ margin: 12 }} variant="h3" component="div">
            Settings
          </Typography>
          <Typography variant="inherit" component="div">
            Welcome {session.user.name}!
          </Typography>
          <hr />
          <Card
            raised
            style={{
              margin: 12,
              minWidth: 300,
              maxWidth: 400,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                Access Token
              </Typography>
              <hr style={{ maxWidth: 200 }} />

              <Typography
                variant="inherit"
                component="div"
                style={{ wordWrap: "break-word" }}
              >
                <code>{accessToken}</code>
              </Typography>
              <hr style={{ maxWidth: 200 }} />
              <Typography variant="inherit" component="div">
                <Button
                  onClick={() => {
                    getAccessToken();
                  }}
                  size="small"
                >
                  Generate New Access Token
                </Button>
              </Typography>
              <Typography
                variant="inherit"
                component="div"
                style={{ marginTop: 20 }}
              >
                Note: This access token expires in 24 hours. Add this token as
                your Authorization header in any api calls. Don't share this
                token with anyone.
              </Typography>
              <Typography
                variant="inherit"
                component="div"
                style={{ marginTop: 20 }}
              >
                <code>"Authorization": "Bearer ACCESS_TOKEN"</code>
              </Typography>
            </CardContent>
          </Card>
        </div>
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
