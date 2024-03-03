import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import { ReactElement } from "react";
import { DefaultNavLayout, Navbar } from "~/components/layout";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session | null }> & {
  Component: { getLayout?: (page: ReactElement) => ReactElement };
}) => {
  const getLayout =
    Component.getLayout ??
    ((page) => <DefaultNavLayout>{page}</DefaultNavLayout>);
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* TODO fix into react jsx component*/}
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
