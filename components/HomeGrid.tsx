import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";

interface PageProps {
  header: string;
  text: string;
  path: string;
}

export default function HomeGrid({ header, text, path }: PageProps) {
  return (
    <Grid item xs={11} lg={4} style={{margin: "auto"}}>
      <Card raised>
        <CardContent>
          <Typography variant="h5" component="div" style={{ marginBottom: 24 }}>
            {header}
          </Typography>
          <Typography variant="body2" component="div" style={{ width: 300 }}>
            {text}
          </Typography>
        </CardContent>
        <CardActions>
          <Link href={path} passHref>
            <Button color="inherit" size="small">
              View <ArrowForwardIcon />
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Grid>
  );
}
