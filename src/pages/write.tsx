// import { MDXEditor, headingsPlugin } from "~mdxeditor/editor";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { CategorySchema } from "~/utils/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { useEditorStore, useProfileStore } from "~/utils/stores";

const Editor = dynamic(() => import("~/components/ui/Editor"), { ssr: false });

import { useRouter } from "next/router";
import { Logo } from "~/components/svgs/logo";
// import Header from "./write";
import Link from "next/link";
import { IoIosNotificationsOutline as BellClose } from "react-icons/io";
import { ProfileDD } from "~/components/ui/ProfileDD";
import { ProfilePic } from "~/components/ui/profile-pic";
// import Editor from "~/components/ui/Editor";
// store.js
import { Session } from "next-auth";
import { useStore } from "zustand";
import { api } from "~/utils/api";
import { Undefinable } from "~/utils/types";

export default function Home() {
  // if not logged in, redirect to login
  const { data: sessionData } = useSession();
  const router = useRouter();

  // const increase = useStore(useBearStore, (state) => state.increase);
  // if (!sessionData || !sessionData.user) {
  //   // TODO  check if this  works
  //   use(async () => signIn());
  // }
  // useEffect(() => {
  //   if (!sessionData || !sessionData.user) {
  //     signIn().catch(console.error);
  //     // router.push("/login").catch(console.error);
  //   }
  // }, [sessionData]);

  // redirect to login
  // useEffect(() => {
  //   if (!sessionData || !sessionData.user) {
  //     router.push("/login").catch(console.error);
  //   }
  // }, [sessionData]);

  return (
    <div>
      <Head>
        <title> Create an article</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>

      <Editor />
    </div>
  );
}
function Header() {
  const { data: sessionData } = useSession();

  const { updating } = useStore(useProfileStore);

  // send html and content to trpc backend on publish button

  if (!sessionData || !sessionData.user) {
    return null;
  }

  return (
    <>
      <Head>
        <title> Create an article</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>
      <nav className="container flex w-full items-baseline justify-between p-4">
        <div className="flex  items-center gap-3">
          <Link href="/" className="h-7  w-11 overflow-hidden rounded-full">
            <Logo />
            {/* search input */}
          </Link>
          <h1 className=" ">Draft by {sessionData?.user?.name}</h1>
          {/* saved or not  */}

          {updating ? (
            <span className="text-xs text-gray-500">Saving...</span>
          ) : (
            <span className="text-xs text-gray-500">Saved</span>
          )}
        </div>

        <div className="flex items-center gap-5 pt-1 text-lg">
          <Dialog>
            <DialogTrigger asChild>
              <button className="rounded-full  bg-green-600 px-3 py-1 text-white transition-all duration-200 hover:bg-gray-600 hover:text-white">
                Publish
              </button>
            </DialogTrigger>

            <DialogContent className="h-screen w-screen p-12 ">
              <UploadPage user={sessionData?.user} />
            </DialogContent>
          </Dialog>

          <BellClose className="h-7 w-7" />
          <ProfileDD
            user={sessionData?.user}
            before={
              <div className=" w-45 flex h-12 items-center justify-center gap-2 ">
                <ProfilePic author={sessionData?.user} className="h-12 w-12" />
                <Link href="/profile" className="flex flex-col">
                  <span className=" ">{sessionData?.user?.name}</span>
                  <span className="hover:underlin text-gray-600">
                    ~{sessionData?.user?.name}
                  </span>
                </Link>
              </div>
            }
          />
        </div>
      </nav>
    </>
  );
}

function Layout({ children }: { children: ComponentType }) {
  // I want to send the trpc from here
  return (
    <>
      <Header />
      {children}
    </>
  );
}

Home.Layout = Layout;

function UploadPage({ user }: { user: Undefinable<Session["user"]> }) {
  const { html } = useStore(useEditorStore);

  const { data, mutate: createNewPost } = api.post.createPost.useMutation();
  // const user = sessionData.user;
  // console.log("user", user);
  // console.log("userPosts", userPosts);
  // console.log("data", data);
  // console.log("html", html);
  const formSchema = z.object({
    title: z.string().min(6),
    subtitle: z.optional(z.string()),
    category: z.optional(CategorySchema),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log("sent", values);

    const dom = new DOMParser().parseFromString(html, "text/html");
    const title = dom.querySelector("h1")?.textContent;
    // remove h1 from the dom
    dom.querySelector("h1")?.remove();

    if (!title) {
      console.error("no title");
      return;
    }
    const newPost = createNewPost({
      title: values.title,
      category: values.category ?? "None",
      content: dom.body.innerHTML,
      tags: [],
      published: true,
    });

    console.log("sent", title);
    console.log("submitted kjfldsjlkfasjkdl", values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container flex justify-center gap-10"
      >
        {/* placeholder image drag and drop*/}

        <DialogHeader className="max-w-md">
          <DialogTitle>Story Preview</DialogTitle>

          <img
            src="https://picsum.photos/200/300"
            alt="fjdsklfjak"
            className="aspect-video w-full"
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={`Write a preview ${field.name}...`}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={`Write a preview ${field.name}...`}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Note: Changes here will affect how your story appears in
                  public places like Medium’s homepage and in subscribers’
                  inboxes — not the contents of the story itself.
                </FormDescription>
              </FormItem>
            )}
          />
        </DialogHeader>

        <DialogHeader className="max-w-md">
          <DialogTitle>Publishing to {user?.name}</DialogTitle>

          <FormField
            control={form.control}
            rules={{ required: false }}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Add or change topics (up to 5) so readers know what your story
                  is about
                </FormLabel>
                {/* make this optional */}
                <FormControl>
                  <Input placeholder={`Add a topic...`} {...field} />
                </FormControl>
                <FormDescription>
                  Learn more about what happens to your post when you publish.
                </FormDescription>
              </FormItem>
            )}
          />
          <DialogFooter className=" gap-3 sm:justify-start">
            <Button type="submit">Publish Now</Button>
            <DialogTrigger>
              <button className="text-gray-500" type="reset">
                {/* TODO figure which type to use */}
                Save Changes
              </button>
            </DialogTrigger>
          </DialogFooter>
        </DialogHeader>
      </form>
    </Form>
  );
}

// export function DialogDemo() {
//   return (

//   );
// }
