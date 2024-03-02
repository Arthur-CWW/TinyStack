import { useSession } from "next-auth/react";
import Link from "next/link";
import { IoIosNotificationsOutline as BellClose } from "react-icons/io";
import { PiArticleThin as StoryIcon } from "react-icons/pi";
import {
  CiSearch as SearchIcon,
  CiBookmark as LibraryIcon,
} from "react-icons/ci";
import { PiNotePencilThin as WriteIcon } from "react-icons/pi";
import { RxPerson as ProfileIcon } from "react-icons/rx";
import { IoStatsChartOutline as StatsIcon } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Logo } from "./svgs/logo";

export function Navbar() {
  const { data: sessionData } = useSession();
  return (
    <nav
      className="flex w-full items-baseline justify-between p-4   text-slate-500
        "
    >
      <div className="flex  items-center gap-3">
        <Link href="" className="h-7  w-11 overflow-hidden rounded-full">
          <Logo />
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

      <div className="flex items-center gap-5 pt-1 text-lg">
        <Link href="write" className="flex items-center justify-center gap-1 ">
          <WriteIcon className="h-7 w-7" /> Write
        </Link>
        <Link href="me/notifications">
          <BellClose className="h-7 w-7" />
        </Link>
        {/* profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className=" h-8 w-8  gap-2 overflow-hidden rounded-full">
              {sessionData?.user?.image ? (
                <img src={sessionData.user?.image} className="w-full" />
              ) : (
                <div
                  className="text-xl font-bold text-white"
                  // random hue background
                  style={{
                    background: `hsl(${Math.floor(
                      Math.random() * 360,
                    )}, 100%, 50%)`,
                  }}
                >
                  {/*Placeholder same as youtube  */}
                  {sessionData?.user?.name?.[0] ?? ""}
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56  p-4 text-lg font-thin  text-gray-600 hover:text-gray-700">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ProfileIcon className="mr-3 h-5 w-5" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LibraryIcon className="mr-3 h-5 w-5" />
                <span>Library</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <StoryIcon className="mr-3 h-5 w-5" />
                <span>Story</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <StatsIcon className="mr-3 h-5 w-5" />
                <span>Stats</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
