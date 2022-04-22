import BottomNavigation from "@mui/material/BottomNavigation";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function Credits() {
  return (
    <BottomNavigation style={{backgroundColor: "rgba(0,0,0,0)"}}>
      <Typography variant="inherit" component="div">
        Designed by{" "}
        <Link href="https://harshasrikara.dev" passHref>
          Harsha Srikara
        </Link>
        .
      </Typography>
    </BottomNavigation>
  );
}
