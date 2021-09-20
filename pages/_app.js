import UserProvider from "../context/userContext";
import { ThemeProvider } from "next-themes";
import "../styles/global.css";

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <ThemeProvider defaultTheme="system">
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  );
}
