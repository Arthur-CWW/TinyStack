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
  return (
    <Main blogs={data?.posts ?? []} className="container max-w-[80ch] py-8">
      <header className="flex justify-between p-3 ">
        <h1 className="py-8 text-5xl font-semibold capitalize">
          {data?.user?.name ?? "Loading..."}
        </h1>
      </header>

      <Popover>
        <PopoverTrigger>
          <Dots className="size-8" />
        </PopoverTrigger>
        <PopoverContent>Place content for the popover here.</PopoverContent>
      </Popover>
    </Main>
  );
}
