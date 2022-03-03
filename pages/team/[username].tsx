import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import axios from "axios";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import AccoladeCard from "../../components/AccoladeCard";
import NavBar from "../../components/NavBar";
import { getTeamData } from "../../fetchData/getTeamData";
import { team } from "../../fetchData/getTeams";

interface PageProps {
  data: team;
  session: Session;
}

export default function TeamPage({
  data,
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // if (!session) { return  <AccessDenied/> };
  const [accolade, setAccolade] = useState(
    "You're the best! Thanks for being awesome!"
  );

  const router = useRouter();

  let CustomComponent;
  try {
    CustomComponent = dynamic(
      () =>
        import(
          `../../components/personalization/${data.name.replace(/\s/g, "")}`
        )
    );
  } catch (e) {
    CustomComponent = `div`;
  }

  const getDivisionAndSemester = () => {
    return data.tags
      .filter((item, index) => {
        if (item.split(" ").length === 2) {
          return true;
        }
        return false;
      })
      .map((item, index) => {
        const division =
          item.split(" ")[0] === "TIP"
            ? "Technical Interview Prep"
            : item.split(" ")[0];
        return (
          division +
          " " +
          item.split(" ")[1].replace("F", "Fall ").replace("S", "Spring ")
        );
      })[0];
  };

  const sendAccolade = async () => {
    for (let i = 0; i < data.participants.length; i++) {
      const payload = {
        sender_name: session.user.name,
        sender_email: session.user.email,
        to: session.user.email, // TODO: need to query db for email here,
        receiver_name: data.participants[i].name,
        accolade: accolade,
        user_id: data.id,
        collection: "teams",
      };

      await Promise.all([
        axios.post(router.basePath + "/api/email", payload, {}),
        axios.post(router.basePath + "/api/slack", payload, {}),
        axios.post(router.basePath + "/api/accolade", payload, {}),
      ]);
    }

    router.reload();
  };

  return (
    <Fragment>
      <Head>
        <title>Programs: {data.name} | ACM Leadership</title>
        <meta
          property="og:title"
          content={`Programs: ${data.name} | ACM Leadership`}
          key="title"
        />
      </Head>
      <Container maxWidth="lg">
        <NavBar session={session} />
        <div style={{ paddingTop: 90 }}>
          <Typography style={{ margin: 12 }} variant="h3" component="div">
            {data.name}
          </Typography>
          <Typography variant="inherit" component="div">
            {getDivisionAndSemester()}
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
                Team Members
              </Typography>
              <hr style={{ maxWidth: 200 }} />
              {data.participants.map((participant, index) => {
                return (
                  <Link href={`/participant/${participant.id}`} passHref>
                    <a>
                      <Typography
                        variant="inherit"
                        component="div"
                        key={index}
                        style={{ marginTop: 8 }}
                      >
                        {index + 1}. {participant.name}
                      </Typography>
                    </a>
                  </Link>
                );
              })}
              <Typography
                variant="h5"
                component="div"
                style={{ marginTop: 20 }}
              >
                Officer
              </Typography>
              <hr style={{ maxWidth: 200 }} />
              <Link href={`/profile/${data.officer.id}`} passHref>
                <a>
                  <Typography
                    variant="inherit"
                    component="div"
                    style={{ marginTop: 8 }}
                  >
                    {data.officer.name}
                  </Typography>
                </a>
              </Link>
            </CardContent>
          </Card>
          {data.accolades.length > 0 ? (
            <AccoladeCard accolades={data.accolades as string[]} />
          ) : (
            <div></div>
          )}
          <CustomComponent />
          {/* {session ? (
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
                  Shoutout {data.name}!
                </Typography>
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
          ) : (
            <div></div>
          )} */}
          <Link href={`/team`} passHref>
            <Button style={{ margin: 12 }} size="small">
              <ArrowBackIcon /> Return Home
            </Button>
          </Link>
        </div>
      </Container>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context: GetServerSidePropsContext
) => {
  const { username } = context.params;
  const session = await getSession(context);

  const profile = await getTeamData(username as string);
  if (!profile) {
    return { notFound: true };
  }
  return { props: { data: profile, session } };
};
