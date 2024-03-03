import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import { ReactElement } from "react";
import { DefaultNavLayout, Navbar } from "~/components/layout";
// add Layout to the AppProps
// declare module "next/app" {

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session | null }> & {
  Component: {
    Layout?: ({ children }: { children: ReactElement }) => ReactElement;
  };
}) => {
  const Layout =
    Component.Layout ??
    (({ children }: { children: ReactElement }) => (
      <DefaultNavLayout>{children}</DefaultNavLayout>
    ));
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* TODO fix into react jsx component*/}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
