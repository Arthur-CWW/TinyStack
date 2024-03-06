import { signOut } from "next-auth/react";
import { PiArticleThin as StoryIcon } from "react-icons/pi";
import { CiBookmark as LibraryIcon } from "react-icons/ci";
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
import { ProfilePic } from "~/components/ui/profile-pic";
import { User } from "next-auth";
import { Undefinable } from "~/utils/types";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";

export function ProfileDD({
  user,
  before,
}: {
  user: Undefinable<User>;
  before?: React.ReactNode;
}) {
  const menu = [
    {
      icons: ProfileIcon,
      text: "Profile",
    },

    {
      icons: LibraryIcon,
      text: "Library",
    },
    {
      icons: StoryIcon,
      text: "Story",
    },
    {
      icons: StatsIcon,
      text: "Stats",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className=" h-8 w-8  overflow-hidden rounded-full">
          <ProfilePic author={user} className="h-8 w-8" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56   text-lg font-thin  text-gray-600 hover:text-gray-700">
        <DropdownMenuGroup>
          {before && (
            <DropdownMenuLabel className="p-6">{before}</DropdownMenuLabel>
          )}
          {menu.map((item, index) => {
            return (
              <DropdownMenuItem key={index} className="px-6 py-2">
                <item.icons className=" mr-3 h-5 w-5" />
                <span>{item.text}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
