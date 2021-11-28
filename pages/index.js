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
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { getOfficers } from "../fetchData/getOfficers";
import NavBar from "../components/NavBar";

/**
 * 
 * @param {Object} officerList list of officers from the database. All officers if no query is present, else subset
 * @param {string[]} roleList list of all roles, used for role query search bar auto-fill
 * @param {Object} session contains whether the user is signed in or not
 */
export default function Home({ officerList, roleList, session }) {

  // contains subset of officer objects based on name that is typed in the search bar
  const [filteredArray, setFilteredArray] = useState(officerList);

  // contains the list of all names only that is used to populate the search bar auto-fill
  const [officerNames, setOfficerNames] = useState([]);

  // contains the list of all roles that is used to populate the role query bar auto-fill
  const [roleArray, setRoleArray] = useState(roleList);

  const router = useRouter();

  // Filters array based on search bar input
  const onchange = (event) => {
    const searchString = event.toLowerCase();
    setFilteredArray(
      officerList.filter((item) =>
        item.name.toLowerCase().includes(searchString)
      )
    );
  };

  const onrolechange = (role) => {
    router.replace(router.basePath + "?q=" + role);
    router.reload();
  };

  // Sorts the array in ascending order by first name
  useEffect(() => {
    setFilteredArray(
      officerList.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      )
    );
    setOfficerNames(
      filteredArray.map(({ id, name }, index) =>
        name.length < 16 ? name : name.split(" ")[0]
      )
    );
  }, []);

  const Grids = filteredArray.map(({ id, name }, index) => {
    return (
      <Grid container item xs={12} md={6} lg={3} key={index}>
        <Card raised style={{ width: 300, minWidth: 250, margin: 8 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {name.length < 20 ? name : name.split(" ")[0]}
            </Typography>
          </CardContent>
          <CardActions>
            <Link href={`/profile/${id}`} passHref>
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
          officerArray={officerNames}
          onSearchChange={onchange}
        />
        <Grid style={{ paddingTop: 90, paddingBottom: 24 }} container>
          {Grids}
        </Grid>
      </Container>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { officers, role_list } = await getOfficers(context.query.q);
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
