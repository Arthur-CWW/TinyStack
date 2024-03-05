import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Undefinable } from "~/utils/types";
export function ProfilePic({
  author,
  className, // for tailwind classes but mainly for h and w
}: { author: Undefinable<User> } & ComponentProps<"img">) {
  return author.image ? (
    <Image
      src={author.image} //?? "https://via.placeholder.com/150"}
      alt="profile picture"
      className={twMerge("mr-2  overflow-hidden rounded-full", className)}
    />
  ) : (
    <div
      className={twMerge("text-xl font-bold text-white", className)}
      // random hue background
      // todo change this to image element
      style={{
        background: `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`,
      }}
    >
      {/*Placeholder same as youtube  */}
      {author?.name?.[0] ?? ""}
    </div>
  );
}
