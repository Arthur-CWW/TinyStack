import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Navbar } from "~/components/layout";

export default function Page() {
  // TODO layouts
  const router = useRouter();
  // check if user is the one signed in
  const { data: sessionData } = useSession();
  // if (!sessionData) {
  //   signIn();
  // }
  // const { user, error } = router.query;
  console.log(sessionData);
  console.log(router.query);
  const { data } = api.post.getPost.useQuery({
    id: parseInt(router.query.post as string),
  });

  return (
    <>
      <p>Post: {router.query.user}</p>
      <p>Post: {router.query.post}</p>
      <pre>{JSON.stringify(data, null, 4)}</pre>
      <Navbar />
      <main>
        <h1>{data?.title}</h1>
      </main>
    </>
  );
}
