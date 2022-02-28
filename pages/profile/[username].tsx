import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { GetServerSideProps } from 'next';
import { getSession } from "next-auth/client";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import AccoladeCard from "../../components/AccoladeCard";
import NavBar from "../../components/NavBar";
import fetchProfileImage from "../../fetchData/fetchProfileImage";
import { getProfileData } from "../../fetchData/getProfileData";

export default function ProfilePage({ data, session }) {
  // if (!session) { return  <AccessDenied/> };
  const [accolade, setAccolade] = useState(
    "You're the best! Thanks for being awesome!"
  );
  const [isCurrentOfficer, setIsCurrentOfficer] = useState(
    data.end === "Sat Jun 19 2021" ? true : false
  );
  const [imageLink, setImageLink] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const router = useRouter();

  const onChange = (event) => {
    setAccolade(event.target.value);
  };

  let CustomComponent;
  try {
    CustomComponent = dynamic(() =>
      import(`../../components/personalization/${data.name.replace(/\s/g, "")}`)
    );
  } catch (e) {
    CustomComponent = `div`;
  }

  useEffect(() => {
    (async () => {
      setImageLink(await fetchProfileImage(data.id));
      setImageLoaded(true);
    })();
  });

  const sendAccolade = async () => {
    const payload = {
      sender_name: session.user.name,
      sender_email: session.user.email,
      to: data.acm_email,
      receiver_name: data.name,
      accolade: accolade,
      user_id: data.id,
      collection: "officer",
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
        <title>Leadership: {data.name} | ACM Leadership</title>
        <meta
          property="og:title"
          content={`Leadership: ${data.name} | ACM Leadership`}
          key="title"
        />
      </Head>
      <Container maxWidth="lg">
        <NavBar session={session} />
        <div style={{ paddingTop: 90 }}>
          <Typography style={{ margin: 12 }} variant="h3" component="div">
            {data.name}
          </Typography>
          {isCurrentOfficer ? (
            <Typography variant="inherit" component="div">
              {data.start} to Present
            </Typography>
          ) : (
            <Typography variant="inherit" component="div">
              {data.start} to {data.end}
            </Typography>
          )}
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
                alt={`${data.name}'s profile picture`}
                style={{ marginBottom: 16 }}
              />
              <Typography variant="h5" component="div">
                Roles
              </Typography>
              <hr style={{ maxWidth: 200 }} />
              {data.roles.map((role, index) => {
                return (
                  <Typography
                    variant="inherit"
                    component="div"
                    key={index}
                    style={{ marginTop: 8 }}
                  >
                    {index + 1}. {role}
                  </Typography>
                );
              })}
            </CardContent>
          </Card>
          {data.accolades.length > 0 ? (
            <AccoladeCard accolades={data.accolades} />
          ) : (
            <div></div>
          )}
          <CustomComponent />
          {session && isCurrentOfficer ? (
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
                  onChange={onChange}
                  variant="filled"
                  style={{ minWidth: "360px", marginTop: 12, marginBottom: 12 }}
                />
                <Typography variant="inherit" component="div">
                  <Button onClick={sendAccolade} size="small">
                    Send Accolade
                  </Button>
                </Typography>
                <hr style={{ maxWidth: 200 }} />
                <Link href={`/shoutout`} passHref>
                  <Button size="small">
                    Shoutout {data.name.split(" ")[0]} and others!
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div></div>
          )}
          <Link href={`/`} passHref>
            <Button style={{ margin: 12 }} size="small">
              <ArrowBackIcon /> Return Home
            </Button>
          </Link>
        </div>
      </Container>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.params;
  const session = await getSession(context);

  const profile = await getProfileData(username);
  if (!profile) {
    return { notFound: true };
  }
  return { props: { data: profile, session } };
};