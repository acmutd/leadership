import { Provider } from "next-auth/client";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import "../styles/global.css";

// add import
import nProgress from "nprogress";
import { Router } from "next/router";
import "../styles/nprogress.css"

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);
// end

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <ThemeProvider defaultTheme="system">
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
