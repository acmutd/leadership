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
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import AccoladeCard from "../../components/AccoladeCard";
import NavBar from "../../components/NavBar";
import { getParticipantData } from "../../fetchData/getParticipantData";
import { participant } from "../../fetchData/getParticipants";

interface PageProps {
  data: participant;
  session: Session;
}

/**
 *
 * @param {participant} data profile information for the participant
 * @param {Session} session next-auth session information
 */
export default function MemberPage({
  data,
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // if (!session) { return  <AccessDenied/> };
  const [accolade, setAccolade] = useState(
    "You're the best! Thanks for being awesome!"
  );

  const router = useRouter();

  const getProgramParticipation = () => {
    return data.participation
      .filter((item: string) => {
        if (item !== "TIP" && item !== "Projects" && item !== "Research") {
          return true;
        }
        return false;
      })
      .map((item: string) => {
        const division =
          item.split(" ")[0] === "TIP"
            ? "Technical Interview Prep"
            : item.split(" ")[0];
        return (
          division +
          " " +
          item.split(" ")[1].replace("F", "Fall ").replace("S", "Spring ")
        );
      });
  };

  const sendAccolade = async () => {
    const payload = {
      sender_name: session.user.name,
      sender_email: session.user.email,
      to: session.user.email, // data.email[0]
      receiver_name: data.name,
      accolade: accolade,
      user_id: data.id,
      collection: "participants",
    };

    await Promise.all([
      axios.post(router.basePath + "/api/email", payload, {}),
      axios.post(router.basePath + "/api/slack", payload, {}),
      axios.post(router.basePath + "/api/accolade", payload, {}),
    ]);
    router.reload();
  };

  return (
    <Fragment>
      <Head>
        <title>Membership: {data.name} | ACM Leadership</title>
        <meta
          property="og:title"
          content={`Membership: ${data.name} | ACM Leadership`}
          key="title"
        />
      </Head>
      <Container maxWidth="lg">
        <NavBar session={session} />
        <Typography style={{ margin: 12 }} variant="h3" component="div">
          {data.name}
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
              Participation
            </Typography>
            <hr style={{ maxWidth: 200 }} />
            {getProgramParticipation().map((role, index) => {
              return (
                <Typography
                  variant="inherit"
                  component="div"
                  key={index}
                  style={{ marginTop: 8 }}
                >
                  {" "}
                  {index + 1}. {role}
                </Typography>
              );
            })}
          </CardContent>
          {data.teams && (
            <CardContent>
              <Typography variant="h5" component="div">
                Teams
              </Typography>
              <hr style={{ maxWidth: 200 }} />
              {data.teams.map((team, index) => {
                return (
                  <Link href={`/team/${team.id}`} passHref>
                    <a>
                      <Typography
                        variant="inherit"
                        component="div"
                        key={index}
                        style={{ marginTop: 8 }}
                      >
                        {" "}
                        {index + 1}. {team.name}
                      </Typography>
                    </a>
                  </Link>
                );
              })}
            </CardContent>
          )}
        </Card>
        {data.accolades.length > 0 ? (
          <AccoladeCard accolades={data.accolades as string[]} />
        ) : (
          <div></div>
        )}
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
        <Link href={`/participant`} passHref>
          <Button style={{ margin: 12 }} size="small">
            <ArrowBackIcon /> Return Home
          </Button>
        </Link>
      </Container>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context: GetServerSidePropsContext
) => {
  const { username } = context.params;
  const session = await getSession(context);

  const profile = await getParticipantData(username as string);
  if (!profile) {
    return { notFound: true };
  }
  return { props: { data: profile, session } };
};
