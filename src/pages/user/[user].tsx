import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Main } from "~/components/layout";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { BsThreeDots as Dots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { before } from "node:test";
import { ProfilePic } from "~/components/ui/profile-pic";

export default function Page() {
  // TODO layouts
  const router = useRouter();
  // rout
  // k
  const userid = router.query.user as string;
  const { data } = api.post.getUserPosts.useQuery({
    id: userid,
  });
  console.log(userid);
  // const {posts?gh, name} = data;

  // const posts = data?.posts;
  // check if user is the one signed in
  // const { data: sessionData } = useSession();

  // const { user, error } = router.query;
  // console.log(sessionData);
  // console.log(router.query);

  const menu = [
    {
      text: "Copy link to profile",
    },

    {
      text: "Mute author",
    },
    {
      text: "Block this author",
    },
    {
      text: "Report this author",
    },
  ];
  return (
    <Main blogs={data?.posts ?? []} className="container max-w-[80ch] py-8">
      <header className="flex items-center justify-between  p-3">
        <h1 className="py-8 text-5xl font-semibold capitalize">
          {data?.user?.name ?? "Loading..."}
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              {/* this div is neccesary for some reason */}
              <Dots className="size-8" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="      font-thin text-gray-600  hover:text-gray-700">
            <DropdownMenuGroup className="*:px-6 *:py-2">
              <DropdownMenuItem className="">
                Copy link to profile
              </DropdownMenuItem>
              <DropdownMenuItem className="">Mute author</DropdownMenuItem>

              <DropdownMenuItem className="">
                Block this author
              </DropdownMenuItem>

              <DropdownMenuItem className="">
                Report this author
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </Main>
  );
}
