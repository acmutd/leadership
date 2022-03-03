import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "next/link";

interface PageProps {
  name: string;
  id: string;
  path: string;
}

export default function GridCard({ name, id, path }: PageProps) {
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      style={{ margin: 16 }}
    >
      <Card raised style={{ width: 300, minWidth: 250 }}>
        <CardContent>
          <Tooltip title={name.length < 20 ? "" : name} placement="top">
            <Typography variant="h5" component="div">
              {name.length < 20 ? name : name.split(" ")[0]}
            </Typography>
          </Tooltip>
        </CardContent>
        <CardActions>
          <Link href={`/${path}/${id}`} passHref>
            <Button color="inherit" size="small">
              <Typography variant="inherit" component="div">
                Learn More
              </Typography>
              <ArrowForwardIcon />
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Grid>
  );
}
