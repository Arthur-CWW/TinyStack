import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Navbar } from "~/components/ui/Navbar";
import { ProfilePic } from "~/components/ui/profile-pic";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { editorStyling } from "~/components/ui/Editor";
import { twMerge } from "tailwind-merge";
import { Icons } from "~/components/icons";
import { Icon } from "@radix-ui/react-select";
import { Dialog, DialogHeader, DialogTrigger } from "~/components/ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { LuShieldCheck } from "react-icons/lu";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { Button } from "~/components/ui/button";
import { useRef, useState } from "react";
import { Undefinable } from "~/utils/types";
import { User } from "@prisma/client";
function RichTextArea({ author }: { author: Undefinable<User> }) {
  const [content, setContent] = useState("");
  const editorRef = useRef(null);

  const handleInput = (e) => {
    setContent(e.target.innerHTML);
  };

  const makeBold = () => {
    // document.execCommand("bold");
    // take selected text and wrap it in a bold tag
  };

  const makeItalic = () => {
    document.execCommand("italic");
  };
  const handleChange = () => {
    setContent(editorRef.current.innerHTML);
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex-row items-center capitalize">
          <ProfilePic author={author} className="h-10 w-10" />
          {author?.name}
        </CardHeader>

        <CardContent>
          <div
            contentEditable
            onInput={handleChange}
            dangerouslySetInnerHTML={{ __html: content }}
            ref={editorRef}
            className="h-32 w-full  p-2 outline-none"
            // placeholder="What are your thoughts?"
          />
        </CardContent>
        <CardFooter className="gap-3">
          <Button
            variant="ghost"
            className="font-serif text-2xl font-extrabold text-gray-400"
            onClick={makeBold}
          >
            B
          </Button>
          <Button
            variant="ghost"
            className="font-serif text-2xl font-extrabold text-gray-400"
            onClick={makeItalic}
          >
            i
          </Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="default" className="bg-green-400">
            Respond
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
export default function Page() {
  // TODO layouts
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { data } = api.post.getPost.useQuery({
    id: parseInt(router.query.post as string),
  });
  if (!data || !data.author) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <main className="container max-w-[80ch] ">
        <h1 className="py-4 text-5xl font-semibold capitalize">
          {data?.title}
        </h1>
        <section className="flex items-center justify-start py-4">
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
        </section>
        <section className="flex gap-3 border-y-1 border-border fill-gray-400  py-3">
          <Icons.clap className="fill-[rgb(117, 117, 117)]  stroke-0  " /> 3239
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex ">
                <Icons.comment className="stroke-gray-400" /> 11
              </button>
            </DialogTrigger>
            <DialogContent className="absolute right-0 top-0 h-screen w-[446px] bg-white p-4 shadow-2xl">
              <DialogHeader className="flex flex-row justify-between">
                <DialogTitle className="text-3xl font-bold">
                  Responses
                </DialogTitle>
                <div className="flex text-gray-700">
                  <LuShieldCheck size={24} strokeWidth={1} />
                  <RxCross1 size={24} className="ml-2 " />
                </div>
              </DialogHeader>
              <RichTextArea author={sessionData?.user} />
            </DialogContent>
          </Dialog>
        </section>

        <div
          className={twMerge(editorStyling, "break-words")}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </main>
    </>
  );
}
