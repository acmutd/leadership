import Link from "next/link";
import { useUser } from "../context/userContext";
import { Fragment } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@material-ui/core";
import { getAllOfficers } from "../fetchData/getAllOfficers";
import { useTheme } from "next-themes";

export default function Home({ officerList }) {
  // Our custom hook to get context values // not used
  const { loadingUser, user } = useUser();
  const { theme, setTheme } = useTheme();

  officerList.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

  const Grids = officerList.map(({ id, name }, index) => {
    return (
      <Grid container item xs={12} md={6} lg={3} key={index}>
        <Card raised style={{ width: 300, marginTop: 12 }}>
          <CardContent>
            <h1>{name}</h1>
          </CardContent>
          <CardActions>
            <Link href={`/profile/${id}`} passHref>
              <Button color="inherit" variant="text" size="small">Learn More</Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>
    );
  });

  return (
    <Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <h1>ACM Leadership through the Ages</h1>
        {/* <div>
          The current theme is: {theme}
          <button onClick={() => setTheme("light")}>Light Mode</button>
          <button onClick={() => setTheme("dark")}>Dark Mode</button>
        </div> */}
        <Grid container>{Grids}</Grid>
      </Container>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const officerData = await getAllOfficers();
  if (!officerData) {
    return {
      notFound: true,
    };
  }
  return {
    props: { officerList: officerData }, // will be passed to the page component as props
  };
}
