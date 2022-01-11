import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import { getSession } from "next-auth/client";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { getParticipants } from "../../fetchData/getParticipants";
import NavBar from "../../components/NavBar";

/**
 * 
 * @param {Object} participantList list of officers from the database. All officers if no query is present, else subset
 * @param {string[]} roleList list of all roles, used for role query search bar auto-fill
 * @param {Object} session contains whether the user is signed in or not
 */
export default function Home({ participantList, roleList, session }) {

  // contains subset of officer objects based on name that is typed in the search bar
  const [filteredArray, setFilteredArray] = useState(participantList);

  // contains the list of all names only that is used to populate the search bar auto-fill
  const [participantNames, setParticipantNames] = useState([]);

  // contains the list of all roles that is used to populate the role query bar auto-fill
  const [roleArray, setRoleArray] = useState(roleList);

  const router = useRouter();

  // Filters array based on search bar input
  const onchange = (event) => {
    const searchString = event.toLowerCase();
    setFilteredArray(
        participantList.filter((item) =>
        item.name.toLowerCase().includes(searchString)
      )
    );
  };

  const onrolechange = (role) => {
    window.location.href = router.basePath + "?q=" + role;
    // commented section works locally but not on vercel
    // router.replace(router.basePath + "?q=" + role);
    // router.reload();
  };

  // Sorts the array in ascending order by first name
  useEffect(() => {
    setFilteredArray(
        participantList.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      )
    );
    setParticipantNames(
      filteredArray.map(({ id, name }, index) =>
        name.length < 16 ? name : name.split(" ")[0]
      )
    );
  }, []);

  const Grids = filteredArray.map(({ id, name }, index) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index} align="center" style={{ margin: 8 }}>
        <Card raised style={{ width: 300, minWidth: 250 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {name.length < 20 ? name : name.split(" ")[0]}
            </Typography>
          </CardContent>
          <CardActions>
            <Link href={`/participant/${id}`} passHref>
              <Button color="inherit" size="small">
                Learn More <ArrowForwardIcon />
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>
    );
  });

  return (
    <Fragment>
      <Container maxWidth="lg">
        <NavBar
          session={session}
          filter={true}
          roleArray={roleArray}
          onRoleChange={onrolechange}
          search={true}
          officerArray={participantNames}
          onSearchChange={onchange}
        />
        <Grid style={{ paddingTop: 90, paddingBottom: 24 }} container justify="center">
          {Grids}
        </Grid>
      </Container>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { participants, programs } = await getParticipants(context.query.q);
  const session = await getSession(context);

  if (!participants || !programs) {
    return {
      notFound: true,
    };
  }
  return {
    props: { participantList: participants, roleList: programs, session }, // will be passed to the page component as props
  };
}
