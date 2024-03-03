// import { MDXEditor, headingsPlugin } from "@mdxeditor/editor";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import dynamic from "next/dynamic";
import { ComponentType } from "react";

const Editor = dynamic(() => import("~/components/ui/Editor"), { ssr: false });

import { useRouter } from "next/router";
import { SearchIcon } from "lucide-react";
import { Logo } from "~/components/svgs/logo";
// import Header from "./write";
import Link from "next/link";
import { IoIosNotificationsOutline as BellClose } from "react-icons/io";
import { ProfileDD } from "~/components/ui/ProfileDD";
import { ProfilePic } from "~/components/ui/profile-pic";
import { IoIosNotificationsOutline } from "react-icons/io";
// import Editor from "~/components/ui/Editor";
// store.js
import create from "zustand";
import { useStore } from "zustand";

export default function Home() {
  // if not logged in, redirect to login
  const { data: sessionData } = useSession();
  const router = useRouter();

  const { bears, increase } = useStore(useBearStore);
  // const increase = useStore(useBearStore, (state) => state.increase);
  // if (!sessionData || !sessionData.user) {
  //   // TODO  check if this  works
  //   use(async () => signIn());
  // }
  // useEffect(() => {
  //   if (!sessionData || !sessionData.user) {
  //     signIn().catch(console.error);
  //     // router.push("/login").catch(console.error);
  //   }
  // }, [sessionData]);

  // redirect to login
  // useEffect(() => {
  //   if (!sessionData || !sessionData.user) {
  //     router.push("/login").catch(console.error);
  //   }
  // }, [sessionData]);

  return (
    <div>
      <Head>
        <title> Create an article</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>
      <button
        onClick={() => {
          if (increase) {
            console.log("bear", bears);
            increase(1);
          }
        }}
        className="rounded-full  bg-green-600 px-3 py-1 text-white transition-all duration-200 hover:bg-gray-600 hover:text-white"
      >
        increase
      </button>
      {bears}
      <Editor />
    </div>
  );
}

import { useBearStore } from "~/utils/stores";
function Header() {
  const { data: sessionData } = useSession();
  if (!sessionData) {
    return null;
  }

  return (
    <>
      <Head>
        <title> Create an article</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>
      <nav className="container flex w-full items-baseline justify-between p-4">
        <div className="flex  items-center gap-3">
          <Link href="/" className="h-7  w-11 overflow-hidden rounded-full">
            <Logo />
            {/* search input */}
          </Link>
          <h1 className=" ">Draft by {sessionData?.user?.name}</h1>
          {/* saved or not  */}
          <span className="text-xs text-gray-500">Saved</span>
        </div>

        <div className="flex items-center gap-5 pt-1 text-lg">
          <button
            onClick={() => console.log("publish  TODO")}
            className="rounded-full  bg-green-600 px-3 py-1 text-white transition-all duration-200 hover:bg-gray-600 hover:text-white"
          >
            Publish
          </button>

          <BellClose className="h-7 w-7" />
          <ProfileDD
            user={sessionData?.user}
            before={
              <div className=" w-45 flex h-12 items-center justify-center gap-2 ">
                <ProfilePic author={sessionData?.user} className="h-12 w-12" />
                <Link href="/profile" className="flex flex-col">
                  <span className=" ">{sessionData?.user?.name}</span>
                  <span className="hover:underlin text-gray-600">
                    @{sessionData?.user?.name}
                  </span>
                </Link>
              </div>
            }
          />
        </div>
      </nav>
    </>
  );
}

function Layout({ children }: { children: ComponentType }) {
  // I want to send the trpc from here
  return (
    <>
      <Header />
      {children}
    </>
  );
}

Home.Layout = Layout;
