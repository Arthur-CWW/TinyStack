import { Category, Post } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { IoMdNotifications as BellOpen } from "react-icons/io";

import { ReactElement, useState } from "react";

import { api } from "~/utils/api";
// import { SplashBackground } from "../components/svgs/SplashBackground";
import { Icons } from "~/components/icons";
import { Navbar } from "~/components/ui/Navbar";
import { Separator } from "@radix-ui/react-dropdown-menu";

import { twMerge } from "tailwind-merge";
import { Button } from "~/components/ui/button";
import { Main } from "~/components/layout";
export default function Home() {
  const { data: sessionData } = useSession();

  const { data: blogs } = api.post.prototype.useQuery();
  return (
    <>
      <Head>
        <title>Medium.com</title>
      </Head>

      {sessionData ? (
        <>
          <Navbar />
          {blogs && <Main blogs={blogs} />}
        </>
      ) : (
        <>
          <header className="flex w-full items-baseline justify-between bg-orange   p-4 ">
            <Link href="">
              <Icons.logo />
            </Link>
            <div className="flex items-baseline gap-4 pt-1 ">
              <div className=" hidden gap-4 mm:flex">
                <Link href="#">Our Story</Link>
                <Link onClick={() => signIn()} href="#">
                  Membership
                </Link>
                <Link href="/auth/signin">Write</Link>
              </div>
              <Link href="/auth/signin" className="hidden sm:flex">
                Sign in
              </Link>
              <button className="rounded-full bg-black p-2  text-white">
                <Link href="/auth/signin">Get started</Link>
              </button>
            </div>
          </header>
          <main className="  flex justify-between border-y-[1px]  border-black bg-orange px-3">
            <div className="container right-0 flex w-full flex-col items-start   justify-center   gap-8  py-24 mm:max-w-[550px]">
              <h1 className=" font-serif  text-8xl  tracking-tight  text-black mm:text-8xl">
                Stay curious
              </h1>
              {/* pill button sign up */}
              <h2 className="text-2xl   text-black">
                Discover stories, thinking, and expertise from writers on any
                topic.
              </h2>
              <button className="w-48 rounded-full bg-black p-3  text-xl  text-white">
                {/* todo signup flow */}
                <Link href="/auth/signin">Get started</Link>
              </button>
            </div>
            <div className="relative hidden w-[585px] overflow-hidden mm:block">
              <Icons.splash className=" absolute bottom-0  right-0 min-h-[440px]" />
            </div>
            {/* get new blogpost */}
            {/* <button onClick */}
          </main>
          {blogs && <Main blogs={blogs} />}
        </>
      )}
    </>
  );
}

export function CategoryFilterPill({
  setFilteredCategories,
  filteredCategories,
  category,
  className,
}: {
  setFilteredCategories: (categories: Category[]) => void;
  filteredCategories: Category[];
  category: Category;
} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={twMerge(
        ` flex-shrink-0 items-center justify-center rounded-full  border-none px-2 py-1 text-sm ${
          filteredCategories.includes(category)
            ? "bg-gray-400 text-white"
            : "bg-gray-100"
        } `,
        className,
      )}
      onClick={() => {
        if (filteredCategories.includes(category)) {
          setFilteredCategories(
            filteredCategories.filter((c) => c !== category),
          );
          return;
        }

        setFilteredCategories([...filteredCategories, category]);
      }}
    >
      {category.replace(/([a-z])([A-Z])/g, "$1 $2")}
    </button>
  );
}

// import {Post} from "@prisma/client";
function TestPost() {
  const { data: sessionData } = useSession();
  const [blogPost, setBlogPost] = useState<Post>({} as Post);
  if (!sessionData || !sessionData?.user || !sessionData?.user?.name) {
    return undefined;
  }

  const { user } = sessionData;
  const { name, email, image, id } = user;
  if (!name || !email || !image || !id) {
    return undefined;
  }

  // const userPosts = api.post.getUserPosts.useQuery({ id: name });
  const { data, mutate: createNewPost } = api.post.createPost.useMutation();
  console.log("user", user);
  // console.log("userPosts", userPosts);
  console.log("data", data);
  return (
    <form
      className="container flex flex-col gap-3 p-3"
      onSubmit={async (e) => {
        e.preventDefault();
      }}
    >
      <button
        className="rounded-full  p-2 font-semibold"
        onClick={async () => {
          const newPost = createNewPost({
            title: "This week glob",
            category: "BusinessEntrepreneurship",
            content: "tesfjdksjfkldsajfklt",
            tags: ["test"],
            published: true,
          });
        }}
      >
        send post
      </button>
    </form>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.checkSecret.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-black">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}

const Layout = ({ children }: { children: ReactElement }) => {
  return <>{children}</>;
};
Home.Layout = Layout;
