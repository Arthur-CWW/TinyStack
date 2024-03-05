import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "~/lib/utils";

import * as React from "react";
import { Button } from "~/components/ui/button";

import { signIn } from "next-auth/react";
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

AuthForm.Layout = function Layout({ children }: { children: React.ReactNode }) {
  // remove the layout
  return (
    <>
      <main>{children}</main>
    </>
  );
};
