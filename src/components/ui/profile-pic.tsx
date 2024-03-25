import { User } from "next-auth";
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

  return (
    <div
      style={{
        // actually can't be random need a deterministic way to generate colors from the name
        background: `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`,
      }}
      className={twMerge(
        " mr-2 h-6 w-6  overflow-hidden rounded-full text-center font-bold text-white ",
        className,
      )}
    >
      {/*Placeholder same as youtube  */}
      {author.image ? (
        <Image
          src={author.image} //?? "https://via.placeholder.com/150"}
          alt="profile picture"
          // layout="fill"
          // objectFit="cover"
          width={24}
          height={24}
          className={twMerge(className)}
        />
      ) : (
        // get first alphabetcal letter
        author.name?.split("").find((char) => char?.match(/[a-zA-Z]/)) ?? ""
      )}
    </div>
  );
}
