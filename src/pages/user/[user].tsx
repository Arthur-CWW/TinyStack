import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Page() {
  // TODO layouts
  const router = useRouter();
  // check if user is the one signed in
  const { data: sessionData } = useSession();
  // if (!sessionData) {
  //   signIn();
  // }
  const { user, error } = router.query;
  console.log(sessionData);
  console.log(router.query);
  return <p>Post: {router.query.user}</p>;
}
