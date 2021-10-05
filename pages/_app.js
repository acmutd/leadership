import UserProvider from "../context/userContext";
import * as Sentry from '@sentry/nextjs';
import { ThemeProvider } from "next-themes";
import { Provider } from "next-auth/client";
import "../styles/global.css";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
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
