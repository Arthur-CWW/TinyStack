import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Main } from "~/components/layout";

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
      <h1 className="py-4 text-5xl font-semibold capitalize">
        {data?.user?.name ?? "Loading..."}
      </h1>
    </Main>
  );
}
