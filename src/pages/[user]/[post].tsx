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
import { User } from "next-auth";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import Dropcursor from "@tiptap/extension-dropcursor";
import FloatingMenu from "@tiptap/extension-floating-menu";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link as TLink } from "@tiptap/extension-link";
import { content } from "tailwindcss/defaultTheme";
import { cn, timeAgo } from "~/lib/utils";
import { ProfileDots } from "~/components/ui/ProfileDropDown";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

function RichTextArea({
  author,
  blogId,
  replyId,
  className,
  close,
}: {
  author: Undefinable<User>;
  blogId: number;
  replyId?: number;
  className?: string;
  close: () => void;
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
      TLink,
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
      <CardFooter className="">
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
        <Button
          variant="ghost"
          onClick={() => {
            close();
            console.log("close");
          }}
        >
          Cancel
        </Button>
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
            close();
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
  const [replyPost, setReplyPost] = useState(() => true);

  if (!data || !data.author) {
    return <div>Loading...</div>;
  }

  // console.log(data.comments.map((comment) => comment));
  console.log(data.comments.map((comment) => comment._count));
  // console.log(replyPost);
  return (
    <>
      <main className="container max-w-[80ch] ">
        {/* TODO cover image {data.} */}
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
        <section className="mb-2 flex gap-3 border-y-1 border-border  fill-gray-400 py-3 text-gray-700">
          <Icons.clap className="fill-[rgb(117, 117, 117)]  stroke-0  " /> 3239
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex ">
                <Icons.comment className="" /> 11
              </button>
            </SheetTrigger>
            <SheetContent className="fixed right-0 top-0 min-h-screen w-[446px] overflow-y-auto bg-white p-4 shadow-2xl">
              <SheetHeader className="flex flex-row items-center justify-between">
                <SheetTitle className="text-3xl font-bold">
                  Responses
                </SheetTitle>
                <div className="flex text-gray-700">
                  <LuShieldCheck size={24} strokeWidth={1} />
                  <SheetTrigger>
                    <RxCross1 size={24} className="ml-2 " />
                  </SheetTrigger>
                </div>
              </SheetHeader>
              {replyPost ? (
                <RichTextArea
                  author={sessionData?.user}
                  blogId={data.id}
                  // TODO
                  close={() => {
                    setReplyPost(false);
                  }}
                />
              ) : (
                <Button
                  // TODO fix this styling
                  variant="link"
                  className="p-3 "
                  onClick={() => {
                    setReplyPost(true);
                  }}
                >
                  Share your thoughts here...
                </Button>
              )}
              {data.comments.map((comment) => (
                <div className="border-y border-border " key={comment.id}>
                  <CardHeader className="flex-row items-center justify-between capitalize">
                    <Link
                      className="flex gap-3 "
                      href={`/user/${comment.authorId}`}
                    >
                      <ProfilePic
                        author={comment.author}
                        className="h-10 w-10"
                      />
                      <div className="text-gray-600">
                        <h3 className=" text-black">{comment.author.name}</h3>
                        <span>{timeAgo(comment.createdAt)}</span>
                      </div>
                    </Link>
                    <ProfileDots className="size-6" />
                  </CardHeader>
                  <CardContent>
                    <div
                      key={comment.id}
                      className={editorStyling}
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                  </CardContent>
                  <CardFooter className="justify-between text-gray-300">
                    <Icons.clap />
                    <Button
                      variant="link"
                      onClick={() => {
                        setReplyToId(comment.id);
                      }}
                    >
                      Reply
                    </Button>
                    {/* {JSON.stringify(comment.replies)} */}
                  </CardFooter>

                  {replyToId !== -1 && replyToId === comment.id && (
                    <CardContent //className="border-l-2 border-border"
                    >
                      <RichTextArea
                        replyId={replyToId}
                        // TODO fix types here
                        author={sessionData?.user}
                        blogId={data.id}
                        close={() => {
                          setResorplyToId(-1);
                        }}
                      />
                    </CardContent>
                  )}
                </div>
              ))}
            </SheetContent>
          </Sheet>
        </section>

        <div
          className={twMerge(editorStyling, "break-words")}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </main>
    </>
  );
}
