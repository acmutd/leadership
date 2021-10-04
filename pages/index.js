import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../context/userContext";
import { Fragment, useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { getOfficers } from "../fetchData/getOfficers";
import { useTheme } from "next-themes";
import NavBar from "../components/NavBar";

export default function Home({ officerList, roleList }) {
  const { theme, setTheme } = useTheme();
  const [filteredArray, setFilteredArray] = useState(officerList);
  const [officerNames, setOfficerNames] = useState([]);
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

  // Sorts the array in ascending order by first time
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
        <Card raised style={{ width: 300, marginTop: 12 }}>
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
          filter={true}
          roleArray={roleArray}
          onRoleChange={onrolechange}
          search={true}
          officerArray={officerNames}
          onSearchChange={onchange}
        />
        <Grid style={{ paddingTop: 60 }} container>
          {Grids}
        </Grid>
      </Container>
    </Fragment>
  );
}

export async function getServerSideProps({ query }) {
  const { officers, role_list } = await getOfficers(query.q);
  if (!officers || !role_list) {
    return {
      notFound: true,
    };
  }
  return {
    props: { officerList: officers, roleList: role_list }, // will be passed to the page component as props
  };
}
