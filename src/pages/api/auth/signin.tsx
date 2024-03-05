import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "~/lib/utils";

import * as React from "react";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions, getServerAuthSession } from "~/server/auth";

function AuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
  }

  return (
    <div className={cn("container grid max-w-md gap-6", className)} {...props}>
      {/* <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form> */}
      <h1 className="text-center font-serif text-3xl">Welcome Back </h1>
      <Button variant="outline" className="justify-between" type="button">
        <Icons.gitHub className="mr-2 h-4 w-4" />
        Sign in with GitHub
        <span></span>
      </Button>
    </div>
  );
}

// export default function Home() {
//   return (
//     <div className="flex h-screen w-screen items-center justify-center">
//       {/* <h1>Home</h1> */}
//       <AuthForm />
//     </div>
//   );
// }

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(providers);
  return (
    <>
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const session = await getServerSession(context.req, context.res, authOptions);
  const session = await getServerAuthSession(context);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  console.log("session", session);
  const providers = await getProviders();
  console.log("providers", providers);

  return {
    props: { providers: providers ?? [] },
  };
}

SignIn.Layout = function Layout({ children }: { children: React.ReactNode }) {
  // remove the layout
  return (
    <>
      <main>{children}</main>
    </>
  );
};
