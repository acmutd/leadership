import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { getSession } from "next-auth/client";
import Container from "@material-ui/core/Container";
import AccessDenied from "../components/AccessDenied";
import {
  Button,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function SSRPage({ session }) {
  if (!session) {
    return <AccessDenied />;
  }
  const router = useRouter();

  const [accessToken, setAccessToken] = useState("");

  const getAccessToken = async () => {
    const res = await axios.post(router.basePath + "/api/auth/token", {}, {});
    setAccessToken(res.data.token);
  };

  return (
    <Fragment>
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

              <Typography variant="inherit" component="div">
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

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  return { props: { session } };
};
