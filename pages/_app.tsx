import { Provider } from "next-auth/client";
import { ThemeProvider } from "next-themes";
import { AppProps } from 'next/app';
import UserProvider from "../context/userContext";
import "../styles/global.css";

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Provider session={pageProps.session}>
        <ThemeProvider defaultTheme="system">
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </UserProvider>
  );
}
