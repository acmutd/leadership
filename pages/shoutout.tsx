import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import AccessDenied from "../components/AccessDenied";
import NavBar from "../components/NavBar";
import { getOfficers, officer } from "../fetchData/getOfficers";

interface response {
  data: {
    profiles: officer[];
  }
}
interface PageProps {
  officerList: officer[];
  roleList: string[];
  session: Session;
}

export default function ProfilePage({ officerList, roleList, session }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!session) {
    return <AccessDenied />;
  }

  const [accolade, setAccolade] = useState(
    "You're the best! Thanks for being awesome!"
  );

  // contains the list of all names only that is used to populate the search bar auto-fill
  const [officerNames, setOfficerNames] = useState<string[]>([]);

  // selected names to send a shoutout to
  const [names, setNames] = useState<string[]>([]);

  // Sorts the array in ascending order by first name
  useEffect(() => {
    setOfficerNames(officerList.map(({ id, name }) => name));
  }, []);

  const router = useRouter();

  const sendAccolade = async () => {
    // fetch profiles
    const response = await axios.post<any, response>("/api/profile", { names: names }, {});

    // generate payloads for each shoutout
    const payloads = response.data.profiles.map((profile) => {
      return {
        sender_name: session.user.name,
        sender_email: session.user.email,
        to: profile.acm_email,
        receiver_name: profile.name,
        accolade: accolade,
        user_id: profile.id,
        collection: "officer",
      };
    });

    // send all shoutouts in parallel
    await Promise.all(
      payloads.map(async (payload, index) => {
        return Promise.all([
          axios.post(router.basePath + "/api/email", payload, {}),
          axios.post(router.basePath + "/api/slack", payload, {}),
          axios.post(router.basePath + "/api/accolade", payload, {}),
        ]);
      })
    );
    
    // reload page
    router.reload();
  };

  const selectedOfficers = names.map((name, index) => {
    return (
      <div key={index}>
        <Typography variant="inherit">{name}</Typography>
        <Button
          size="small"
          onClick={() => {
            setNames(names.filter((item) => item !== name));
          }}
        >
          Remove
        </Button>
      </div>
    );
  });

  return (
    <Fragment>
      <Head>
        <title>Shoutout | ACM Leadership</title>
        <meta
          property="og:title"
          content="Shoutout | ACM Leadership"
          key="title"
        />
      </Head>
      <Container maxWidth="lg">
        <NavBar session={session} />
        <div style={{ paddingTop: 90 }}>
          <Typography style={{ margin: 12 }} variant="h3" component="div">
            Shoutout!
          </Typography>
          <Typography variant="inherit" component="div">
            Send a shoutout to one or more people at once!
          </Typography>
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
                Give an accolade to:
              </Typography>
              <hr style={{ maxWidth: 200 }} />
              {selectedOfficers}
              <Autocomplete
                disablePortal
                style={{
                  marginLeft: 90,
                  marginRight: 90,
                  marginTop: 24,
                  marginBottom: 24,
                }}
                id="combo-box"
                options={officerNames}
                renderInput={(params) => (
                  <TextField {...params} label="Search" />
                )}
                onChange={(event, newValue) => {
                  if (newValue === "" || newValue === null || newValue === undefined) {
                    return;
                  }
                  setNames([...names, newValue]);
                }}
              />
              <hr style={{ maxWidth: 200 }} />
              <TextField
                multiline
                minRows={8}
                maxRows={12}
                onChange={(event) => {
                  setAccolade(event.target.value);
                }}
                variant="filled"
                style={{ minWidth: "360px", marginTop: 12 }}
              />
              <Typography variant="inherit" component="div">
                <Button onClick={sendAccolade} size="small">
                  Send Accolade
                </Button>
              </Typography>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const { officers, role_list } = await getOfficers(context.query.q as string);
  const session = await getSession(context);

  if (!officers || !role_list) {
    return {
      notFound: true,
    };
  }

  return {
    props: { officerList: officers, roleList: role_list, session }, // will be passed to the page component as props
  };
}
