import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "~/lib/utils";

import * as React from "react";
import { IconKey, Icons } from "~/components/icons";
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
import { api } from "~/utils/api";

export default function AuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
  }
  const { data: providers } = api.user.getProviders.useQuery();
  const classOveride: Record<string, string> = {
    discord: "bg-[#5865F2] text-white",
  } as const;

  console.log(providers);
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
      {providers &&
        Object.values(providers).map((provider) => (
          <Button
            variant="outline"
            //if id in backgroundOveride then use it
            className={"justify-between " + classOveride[provider.id]}
            type="button"
            key={provider.name}
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            {/* <Icons className="mr-2 h-4 w-4" /> */}
            {/* {Icons[provider.id as IconKey]
              ? Icons[provider.id as IconKey]({ className: "mr-2 h-4 w-4" })
              : null} */}
            {
              <Image
                src={provider.logoUrl}
                alt={provider.name}
                width={24}
                height={24}
              />
            }
            Sign in with {provider.name}
            <span></span>
          </Button>
        ))}
    </div>
  );
}

// function Signup() {

//   return (
//     <>
//     </>
//   );
// }

AuthForm.Layout = function Layout({ children }: { children: React.ReactNode }) {
  // remove the layout
  return (
    <>
      <main>{children}</main>
    </>
  );
};
