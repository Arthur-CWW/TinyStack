import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Navbar } from "~/components/ui/Navbar";
import { ProfilePic } from "~/components/ui/profile-pic";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { editorStyling } from "~/components/ui/Editor";

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
  if (!data || !data.author) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <main className="container max-w-[80ch] py-8">
        <h1 className="py-4 text-5xl font-semibold capitalize">
          {data?.title}
        </h1>
        <div className="flex items-center justify-start py-4">
          <ProfilePic author={data?.author} className="h-10 w-10" />
          <div className="flex flex-col">
            <p className="text-lg ">{data?.author?.name}</p>
            <p className="text-md font-thin text-gray-600">
              {/* time to finish reading  round up to the nearest min*/}
              {Math.ceil(data.content.split(" ").length / 200)} min read {" · "}
              {data.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div
          className={editorStyling}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </main>
    </>
  );
}
