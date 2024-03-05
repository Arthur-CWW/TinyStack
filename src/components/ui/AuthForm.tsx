import Image from "next/image";
import Link from "next/link";
import { cn } from "~/lib/utils";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";
import { api } from "~/utils/api";

export default function AuthForm({
  mode,
  className,
  ...props
}: {
  mode: "signin" | "signup";
} & React.HTMLAttributes<HTMLDivElement>) {
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
  }
  const { data: providers } = api.user.getProviders.useQuery();
  const classOveride: Record<string, string> = {
    discord: "bg-[#5865F2] text-white",
  } as const;

  console.log(providers);
  return (
    <main className="flex h-screen w-screen items-center justify-center ">
      <div
        className={cn(
          "container flex w-full max-w-xl flex-col items-center justify-center gap-6 p-16  text-center shadow-sm ",
          className,
        )}
        {...props}
      >
        <h1 className=" font-serif text-3xl">Welcome Back. </h1>
        {providers &&
          Object.values(providers).map((provider) => (
            <Button
              variant="outline"
              //if id in backgroundOveride then use it
              className={"w-80 justify-between " + classOveride[provider.id]}
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
              {mode == "signin" ? "Sign in" : "Sign up"} with {provider.name}
              <span></span>
            </Button>
          ))}
        {/* no account create one */}
        <span>
          No account yet?{" "}
          <Link
            href={`/auth/${mode === "signin" ? "signup" : "signin"}`}
            className=" font-semibold text-green-700"
          >
            Create One
          </Link>
        </span>
      </div>
    </main>
  );
}
