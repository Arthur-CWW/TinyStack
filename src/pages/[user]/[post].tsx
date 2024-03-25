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
import { postOutput, Undefinable } from "~/utils/types";
import { User } from "@prisma/client";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import Dropcursor from "@tiptap/extension-dropcursor";
import FloatingMenu from "@tiptap/extension-floating-menu";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { content } from "tailwindcss/defaultTheme";
import { cn, timeAgo } from "~/lib/utils";
function RichTextArea({
  author,
  blogId,
  replyId,
  className,
}: {
  author: Undefinable<User>;
  blogId: number;
  replyId?: number;
  className: string;
}) {
  const { data, mutate: addComment } = api.post.addComment.useMutation();
  const bubbleMenuRef = useRef<HTMLDivElement>(null);
  const floatingMenuRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // options
      }),
      Link,
      BubbleMenu.configure({
        element: bubbleMenuRef.current,
      }),
      FloatingMenu.configure({
        element: floatingMenuRef.current,
      }),
      // Image,
      // Dropcursor,
      Placeholder.configure({
        placeholder: ({ node }) => {
          return "Share your thoughts here...";
        },
      }),
    ],
    onUpdate: (editor) => setContent(editor.editor.getHTML()),
    // content: `Share your thoughts here...`,
    editorProps: {
      attributes: {
        class: editorStyling,
        //                                    ^need to fix this class
      },
    },
  });

  const contentRef = useRef<HTMLDivElement | null>(null);
  return (
    <Card className={cn("my-3 mb-3 shadow-md", className)}>
      <CardHeader className="flex-row items-center capitalize">
        <ProfilePic author={author} className="h-10 w-10" />
        {author?.name}
      </CardHeader>

      <CardContent>
        <EditorContent editor={editor} placeholder="" />
      </CardContent>
      <CardFooter className="gap-3">
        <Button
          variant="ghost"
          className="font-serif text-2xl font-extrabold text-gray-400"
          onClick={() => {
            if (!editor) return;
            editor.commands.toggleBold();
          }}
        >
          B
        </Button>
        <Button
          variant="ghost"
          className="font-serif text-2xl font-extrabold text-gray-400"
          onClick={() => {
            if (!editor) return;
            editor.commands.toggleItalic();
          }}
        >
          i
        </Button>
        <Button variant="ghost">Cancel</Button>
        <Button
          variant="default"
          className="bg-green-400"
          onClick={() => {
            console.log(content);
            if (!author?.id) return;
            addComment({
              content,
              authorId: author?.id,
              postId: blogId,
              replyId,
            });
          }}
        >
          Respond
        </Button>
      </CardFooter>
    </Card>
  );
}
export default function Page() {
  // TODO layouts
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { data } = api.post.getPost.useQuery({
    id: parseInt(router.query.post as string),
  });

  const [replyToId, setReplyToId] = useState(-1);

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
            <DialogContent className="absolute  right-0 top-0 min-h-screen w-[446px] bg-white p-4 shadow-2xl">
              <DialogHeader className="flex flex-row justify-between">
                <DialogTitle className="text-3xl font-bold">
                  Responses
                </DialogTitle>
                <div className="flex text-gray-700">
                  <LuShieldCheck size={24} strokeWidth={1} />
                  <RxCross1 size={24} className="ml-2 " />
                </div>
              </DialogHeader>
              <RichTextArea author={sessionData?.user} blogId={data.id} />
              {data.Comment.map((comment) => (
                <div className="border-y border-border " key={comment.id}>
                  <CardHeader className="flex-row items-center capitalize">
                    <ProfilePic author={comment.author} className="h-10 w-10" />
                    <h3>{comment.author.name}</h3>
                    <span>{timeAgo(comment.createdAt)}</span>
                  </CardHeader>
                  <CardContent>
                    <div
                      key={comment.id}
                      className={editorStyling}
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                  </CardContent>
                  <CardFooter className="justify-between text-gray-300 ">
                    <Icons.clap />
                    <Button
                      variant="link"
                      onClick={() => {
                        setReplyToId(comment.id);
                      }}
                    >
                      Reply
                    </Button>
                  </CardFooter>

                  {replyToId !== -1 && replyToId === comment.id && (
                    <CardContent //className="border-l-2 border-border"
                    >
                      <RichTextArea
                        replyId={replyToId}
                        author={sessionData?.user}
                        blogId={data.id}
                      />
                    </CardContent>
                  )}
                </div>
              ))}
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
