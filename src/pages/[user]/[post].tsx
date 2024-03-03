import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Navbar } from "~/components/layout";
import { ProfilePic } from "~/components/ui/profile-pic";
import { Separator } from "@radix-ui/react-dropdown-menu";

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
      <p>Post: {router.query.user}</p>
      <p>Post: {router.query.post}</p>
      <pre>{JSON.stringify(data, null, 4)}</pre>
      <Navbar />
      <main className="container max-w-[80ch] py-8">
        <h1 className="py-4 text-5xl font-semibold leading-5">{data?.title}</h1>
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
        <Separator className="h-1 bg-gray-400" />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laborum
        consectetur optio tenetur reprehenderit odit quas eius modi veniam
        assumenda? Molestias fugiat aut quae? Aperiam veniam, illo ab maiores
        iure commodi similique fugiat vero ullam corporis quae quisquam mollitia
        illum laudantium quibusdam harum nam sed odit! Et, eos laboriosam
        laborum vel unde dolorum pariatur id voluptates iure quo sunt
        reprehenderit. Quasi, delectus. Accusantium dicta necessitatibus
        asperiores alias temporibus adipisci commodi unde numquam dignissimos
        consectetur, id doloremque! Tenetur nihil repudiandae aut sed fugit
        tempora, tempore iure saepe velit enim, nostrum odit placeat alias
        similique quia possimus consequuntur vero quisquam, repellat temporibus
        iste earum. Quisquam, quos, placeat minima autem aspernatur laudantium
        sapiente incidunt unde pariatur, fugiat accusamus. Molestiae velit
        asperiores sit reiciendis explicabo illum, totam voluptatum atque
        corrupti cumque hic maxime cum rem alias? Possimus magni doloremque
        aliquid dolorem, numquam odio culpa est dolores et neque dolorum
        reiciendis? Eos hic a, fuga molestias velit est quisquam incidunt nihil
        ex repudiandae autem voluptatem doloribus ullam nesciunt numquam
        corrupti quod dolor error amet. Provident possimus exercitationem,
        cumque aperiam, inventore totam architecto et dicta impedit velit
        voluptates, molestiae a cum porro quo hic corrupti ipsa. Accusantium
        accusamus facere nisi asperiores nemo! Modi sint repellat ad?
      </main>
    </>
  );
}
