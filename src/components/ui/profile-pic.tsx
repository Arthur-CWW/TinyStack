import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Undefinable } from "~/utils/types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

export function ProfilePic({
  author,
  className, // for tailwind classes but mainly for h and w
}: { author: Undefinable<User> } & ComponentProps<"img">) {
  if (!author) {
    return null;
  }
  const test = true;
  // console.log(author);
  //
  return (
    <div
      // actually can't be random need a deterministic way to generate colors from the name
      //TODO This might be expensive might want to cache the result onto the object later
      style={{
        background: `hsl(${(author.name?.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0) ?? 0) % 360}, 100%, 50%)`,
      }}
      className={twMerge(
        " mr-2 h-6 w-6  overflow-hidden rounded-full text-center font-bold text-white ",
        className,
      )}
    >
      {author.image && test ? (
        <Image
          src={author.image}
          alt="profile picture"
          // layout="fill"
          // objectFit="cover"
          width={24}
          height={24}
          className={twMerge(className)}
        />
      ) : (
        author.name?.split("").find((char) => char?.match(/[a-zA-Z]/)) ?? ""
      )}
    </div>
  );
}

export function ProfileHover({
  author,
  children,
}: {
  author: Undefinable<User>;
  children: React.ReactNode;
}) {
  if (!author) return children;
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@{author.name}</h4>
            <p className="text-sm">
              {/* {author.name} is a software engineer at Google. He is a */}
              {author.bio ?? "No bio provided"}
            </p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                Joined {new Date(author.createdAt).toDateString()}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
