import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IoIosNotificationsOutline as BellClose } from "react-icons/io";
import { CiSearch as SearchIcon } from "react-icons/ci";
import { PiNotePencilThin as WriteIcon } from "react-icons/pi";
import { RxPerson as ProfileIcon } from "react-icons/rx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icons } from "../icons";
import { ProfileDD } from "./ProfileDD";
import { SignIn, SignUp } from "~/components/ui/AuthComp";
import { useState } from "react";
import { useRouter } from "next/router";
import React from "react";

export function Navbar() {
  // lift the state to the url
  const router = useRouter();
  const [search, setSearchQuery] = useState(router.query.search as string);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSearchChange = (searchQuery: string) => {
    // console.log("router", router);
    // console.log("nav searchQuery", searchQuery);
    if (!searchQuery) {
      console.log(router.query);
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...Object.fromEntries(
              Object.entries(router.query).filter(
                ([key, value]) => key !== "search",
              ),
            ),
          },
        },
        undefined,
        { shallow: true },
      );
      return;
    }
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, search: searchQuery },
      },
      undefined,
      { shallow: true },
    );
  };

  // React.useEffect(() => {
  //   if (search) {
  //     inputRef.current?.focus();
  //   }
  // }, [search]);

  return (
    <nav className="flex w-full items-baseline justify-between border-b-1   border-slate-100 p-4 text-slate-500">
      <div className="flex  items-center gap-3">
        <Link href="/" className="h-7  w-11 overflow-hidden rounded-full">
          <Icons.logo />
          {/* search input */}
        </Link>
        <form
          className="flex gap-2 rounded-full bg-gray-100 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchChange(search);
            // navigate to search page
          }}
        >
          <SearchIcon className="h-6 w-6" />
          <input
            value={search}
            ref={inputRef}
            onInput={(e) => {
              setSearchQuery(e.currentTarget.value);
              // Cannot focus input here need to do it in the useEffect
              // console.log("inputRef", inputRef.current);
              // inputRef.current?.focus();
              // e.currentTarget.focus();
            }}
            type="text"
            placeholder="Search"
            className="border-none bg-transparent placeholder-slate-500 outline-none"
          />
        </form>
      </div>

      <NavRGroup />
    </nav>
  );
}
function NavRGroup() {
  const { data: sessionData } = useSession();
  if (!sessionData) {
    return (
      <div className="flex items-center gap-5 pt-1 text-lg">
        <Link
          href="/auth/signin"
          className="flex items-center justify-center gap-1 "
        >
          <WriteIcon className="h-7 w-7" /> Write
        </Link>
        {/* pill button sign up and sign in*/}
        {/* TODO change this link when sign up is done */}
        <SignUp className="rounded-full  bg-gray-500 px-3 py-1 text-white transition-all duration-200 hover:bg-gray-600 hover:text-white">
          Sign up
        </SignUp>
        <SignIn />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className=" flex h-8  w-8 items-center justify-center overflow-hidden rounded-full border-2 border-gray-400 text-gray-400">
              <ProfileIcon className="h-8 w-8" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56  p-4 text-lg font-thin  text-gray-600 hover:text-gray-700">
            <DropdownMenuGroup className="text-center">
              {/* label */}
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem className="  rounded-full bg-gray-500 px-3 py-1 text-white transition-all duration-200 hover:bg-gray-600 hover:text-white">
                <SignUp />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SignIn />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-5 pt-1 text-lg">
      <Link href="/write" className="flex items-center justify-center gap-1 ">
        <WriteIcon className="h-7 w-7" /> Write
      </Link>
      <Link href="">
        <BellClose className="h-7 w-7" />
      </Link>
      {/* profile dropdown */}
      <ProfileDD user={sessionData.user} />
    </div>
  );
}
