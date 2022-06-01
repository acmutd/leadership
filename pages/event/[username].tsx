import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
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
import { Fragment, useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { getEventData } from "../../fetchData/getEventData";
import fetchImage from "../../fetchData/fetchProfileImage";
import { event } from "../../fetchData/getEvents";

interface PageProps {
  data: event;
  session: Session;
}

export default function EventPage({
  data,
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // if (!session) { return  <AccessDenied/> };
  const [accolade, setAccolade] = useState(
    "You're the best! Thanks for being awesome!"
  );

  const [imageLink, setImageLink] = useState("");

  const router = useRouter();

  useEffect(() => {
    (async () => {
      setImageLink(await fetchImage("event", data.id));
    })();
  });

  return (
    <Fragment>
      <Head>
        <title>Event: {data.name} | ACM Leadership</title>
        <meta
          property="og:title"
          content={`Event: ${data.name} | ACM Leadership`}
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
            {data.date_start === data.date_end ? data.date_start : `${data.date_start} to ${data.date_end}`}
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
            <CardMedia
                component="img"
                height="365"
                image={imageLink}
                alt={`${data.name}'s team picture`}
                style={{ marginBottom: 16 }}
              />
              <Typography variant="h5" component="div">
                Team
              </Typography>
              <hr style={{ maxWidth: 200 }} />
              {data.team.map((organizer, index) => {
                return (
                  <Link href={`/profile/${organizer.id}`} passHref key={index}>
                    <a>
                      <Typography
                        variant="inherit"
                        component="div"
                        key={index}
                        style={{ marginTop: 8 }}
                      >
                        {index + 1}. {organizer.name}
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
                Director
              </Typography>
              <hr style={{ maxWidth: 200 }} />
              <Link href={`/profile/${data.director.id}`} passHref>
                <a>
                  <Typography
                    variant="inherit"
                    component="div"
                    style={{ marginTop: 8 }}
                  >
                    {data.director.name}
                  </Typography>
                </a>
              </Link>
            </CardContent>
          </Card>
          <Link href={`/event`} passHref>
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

  const profile = await getEventData(username as string);
  if (!profile) {
    return { notFound: true };
  }
  return { props: { data: profile, session } };
};
