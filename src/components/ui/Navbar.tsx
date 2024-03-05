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

export function Navbar() {
  return (
    <nav className="flex w-full items-baseline justify-between border-b-1   border-slate-100 p-4 text-slate-500">
      <div className="flex  items-center gap-3">
        <Link href="/" className="h-7  w-11 overflow-hidden rounded-full">
          <Icons.logo />
          {/* search input */}
        </Link>
        <form className="flex gap-2 rounded-full bg-gray-100 p-3">
          <SearchIcon className="h-6 w-6" />
          <input
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
          href="/auth"
          className="flex items-center justify-center gap-1 "
        >
          <WriteIcon className="h-7 w-7" /> Write
        </Link>
        {/* pill button sign up and sign in*/}
        {/* TODO change this link when sign up is done */}
        <button
          onClick={() => console.log("sign up TODO")}
          className="rounded-full  bg-gray-500 px-3 py-1 text-white transition-all duration-200 hover:bg-gray-600 hover:text-white"
        >
          Sign up
        </button>
        <button onClick={() => signIn()} className="">
          Sign in
        </button>

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
                <Link href="/auth">Sign up</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signIn()}>
                Sign in
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
      <Link href="/me/notifications">
        <BellClose className="h-7 w-7" />
      </Link>
      {/* profile dropdown */}
      <ProfileDD user={sessionData.user} />
    </div>
  );
}
