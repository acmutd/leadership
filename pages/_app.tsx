import { Provider } from "next-auth/client";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import "../styles/global.css";

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
