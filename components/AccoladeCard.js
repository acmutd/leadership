import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function AccessDenied({ accolades }) {
  return (
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
        <Typography style={{ margin: 12 }} variant="h5" component="div">
          Accolades
        </Typography>
        <hr style={{ maxWidth: 200 }} />
        {accolades.map((accolade, index) => {
          return (
            <Typography
              style={{
                marginTop: 8,
                maxWidth: 300,
                marginLeft: "auto",
                marginRight: "auto",
              }}
              variant="inherit"
              component="div"
              key={index}
            >
              {index + 1}. {accolade}
            </Typography>
          );
        })}
      </CardContent>
    </Card>
  );
}
