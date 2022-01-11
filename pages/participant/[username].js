import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState, useEffect } from "react";
import { getSession } from "next-auth/client";
import Container from "@material-ui/core/Container";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
} from "@material-ui/core";
import NavBar from "../../components/NavBar";
import axios from "axios";
import { getParticipantData } from "../../fetchData/getParticipantData";
import AccoladeCard from "../../components/AccoladeCard";

export default function SSRPage({ data, session }) {
  // if (!session) { return  <AccessDenied/> };
  const [accolade, setAccolade] = useState(
    "You're the best! Thanks for being awesome!"
  );

  const router = useRouter();

  const onChange = (event) => {
    setAccolade(event.target.value);
  };

  const getProgramParticipation = () => {
    return data.participation
      .filter((item, index) => {
        if (item !== "TIP" && item !== "Projects" && item !== "Research") {
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
      });
  };

  let CustomComponent;
  try {
    CustomComponent = dynamic(() =>
      import(`../../components/personalization/${data.name.replace(/\s/g, "")}`)
    );
  } catch (e) {
    CustomComponent = `div`;
  }

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

    await axios.post(router.basePath + "/api/email", payload, {});
    await axios.post(router.basePath + "/api/slack", payload, {});
    await axios.post(router.basePath + "/api/accolade", payload, {});
    router.reload();
  };

  return (
    <Fragment>
      <Container maxWidth="lg">
        <NavBar session={session} />
        <div style={{ paddingTop: 90 }}>
          <Typography style={{ margin: 12 }} variant="h3" component="div">
            {data.name}
          </Typography>
          <Typography variant="inherit" component="div">
            Debug: {data.classification} - {data.major} - {data.netid} -{" "}
            {data.id}
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
          {session ? (
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
          )}
          <Link href={`/participant`} passHref>
            <Button style={{ margin: 12 }} size="small">
              <ArrowBackIcon /> Return Home
            </Button>
          </Link>
        </div>
      </Container>
    </Fragment>
  );
}

export const getServerSideProps = async (context) => {
  const { username } = context.params;
  const session = await getSession(context);

  const profile = await getParticipantData(username);
  if (!profile) {
    return { notFound: true };
  }
  return { props: { data: profile, session } };
};
