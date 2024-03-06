import { Category, Post } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { IoMdNotifications as BellOpen } from "react-icons/io";

import { ReactElement, useEffect, useState } from "react";

import { api } from "~/utils/api";
// import { SplashBackground } from "../components/svgs/SplashBackground";
import { Icons } from "~/components/icons";
import { Navbar } from "~/components/ui/Navbar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ProfilePic } from "../components/ui/profile-pic";

import { twMerge } from "tailwind-merge";
import Image from "next/image";
export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Medium.com</title>
      </Head>

      {sessionData ? (
        <>
          <Navbar />
          <Main />
        </>
      ) : (
        <>
          <header className="flex w-full items-baseline justify-between bg-orange   p-4 ">
            <Link href="">
              <Icons.logo />
            </Link>
            <div className="flex items-baseline gap-4 pt-1 ">
              <div className=" hidden gap-4 mm:flex">
                <Link href="#">Our Story</Link>
                <Link onClick={() => signIn()} href="#">
                  Membership
                </Link>
                <Link href="/write">Write</Link>
              </div>
              <Link href="/auth/signin" className="hidden sm:flex">
                Sign in
              </Link>
              <button className="rounded-full bg-black p-2  text-white">
                <Link href="/auth/signin">Get started</Link>
              </button>
            </div>
          </header>
          <main className="  flex justify-between border-y-[1px]  border-black bg-orange px-3">
            <div className="container right-0 flex w-full flex-col items-start   justify-center   gap-8  py-24 mm:max-w-[550px]">
              <h1 className=" font-serif  text-8xl  tracking-tight  text-black mm:text-8xl">
                Stay curious
              </h1>
              {/* pill button sign up */}
              <h2 className="text-2xl   text-black">
                Discover stories, thinking, and expertise from writers on any
                topic.
              </h2>
              <button className="w-48 rounded-full bg-black p-3  text-xl  text-white">
                {/* todo signup flow */}
                <Link href="/auth/signin">Get started</Link>
              </button>
            </div>
            <div className="relative hidden w-[585px] overflow-hidden mm:block">
              <Icons.splash className=" absolute bottom-0  right-0 min-h-[440px]" />
            </div>
            {/* get new blogpost */}
            {/* <button onClick */}
          </main>
          <Main />
        </>
      )}
    </>
  );
}

function Main() {
  const blogs = api.post.prototype.useQuery();
  const [blogPost, setBlogPost] = useState<Post[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFilteredCategories([]);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const categories = Object.values(Category);
  return (
    <main className="container border-t-[1px] border-gray-200 ">
      <div className="grid min-h-screen lg:grid-cols-[1fr_368px]">
        <main className="px-14">
          {blogs.data
            ?.filter((post) => {
              if (filteredCategories.length === 0) {
                return true;
              }
              return filteredCategories.includes(post.category);
            })

            .map((post) => (
              <div
                key={post.id}
                className="   flex flex-col border-y-[1px] border-gray-100 pt-6"
              >
                <div className="flex items-center gap-2  ">
                  {/* profile pic */}

                  <Link
                    href={`/user/${post.author.name}`}
                    className="flex gap-1"
                  >
                    <ProfilePic author={post.author} className="h-6 w-6" />
                    <p className="">{post.author.name}</p>
                  </Link>
                  <span className="pb-2">.</span>
                  <span className="text-gray-500">
                    {post.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex h-[208px] justify-between ">
                  <Link
                    href={`/${post.author.name}/${post.id}`}
                    // TODO figure out whether I can use title and
                    // whether it will automatically be slugified
                    className=""
                  >
                    <h1 className="text-2xl font-semibold">{post.title}</h1>
                    <div className="line-clamp-4 ">{post.subtitle}</div>
                    <li className="flex items-center   gap-3 py-8 text-sm">
                      {/* this extra flex container needed otherwise it grows full width of the card */}
                      {
                        <CategoryFilterPill
                          setFilteredCategories={setFilteredCategories}
                          filteredCategories={filteredCategories}
                          category={post.category}
                          className=" items-centebg-gray-100r flex-shrink-0 justify-center rounded-full bg-gray-100 px-2 py-1 text-sm"
                        />
                      }

                      <div className="flex gap-2 text-gray-500">
                        <Link href={`/${post.author.name}/${post.id}`}>
                          {/* TODO figure out why this is wrong  */}
                          {Math.ceil(post?.nwords ?? 0 / 200)} min read
                        </Link>
                        ·
                        <Link href={`/${post.author.name}/${post.id}`}>
                          {Math.random() > 0.1 ? (
                            <span>Selected for you</span>
                          ) : null}
                        </Link>
                      </div>
                    </li>
                  </Link>
                  {/* lorem picsum  110*110*/}
                  <Image
                    src="https://picsum.photos/id/237/110/110"
                    alt=""
                    width={110}
                    height={110}
                    className="ml-16 h-28 w-28"
                  />
                </div>
              </div>
            ))}
        </main>
        <aside className="hidden border-l-[1px] border-gray-200 lg:flex">
          {/* map categories into pill buttons a tags */}
          <div className="flex flex-col gap-5 p-4">
            <h3 className="text-2xl font-semibold">Reccomended topics</h3>
            <ul className="flex  flex-wrap gap-6">
              {categories
                /*.splice(0, 10)*/
                .map((category) => (
                  <CategoryFilterPill
                    key={category}
                    setFilteredCategories={setFilteredCategories}
                    filteredCategories={filteredCategories}
                    category={category}
                  />
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

function CategoryFilterPill({
  setFilteredCategories,
  filteredCategories,
  category,
  className,
}: {
  setFilteredCategories: (categories: Category[]) => void;
  filteredCategories: Category[];
  category: Category;
} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={twMerge(
        ` flex-shrink-0 items-center justify-center rounded-full  px-2 py-1 text-sm ${
          filteredCategories.includes(category) ? "bg-gray-400" : "bg-gray-100"
        } `,
        className,
      )}
      onClick={() => {
        if (filteredCategories.includes(category)) {
          setFilteredCategories(
            filteredCategories.filter((c) => c !== category),
          );
          return;
        }

        setFilteredCategories([...filteredCategories, category]);
      }}
    >
      {category.replace(/([a-z])([A-Z])/g, "$1 $2")}
    </button>
  );
}

// import {Post} from "@prisma/client";
function TestPost() {
  const { data: sessionData } = useSession();
  const [blogPost, setBlogPost] = useState<Post>({} as Post);
  if (!sessionData || !sessionData?.user || !sessionData?.user?.name) {
    return undefined;
  }

  const { user } = sessionData;
  const { name, email, image, id } = user;
  if (!name || !email || !image || !id) {
    return undefined;
  }

  const userPosts = api.post.getUserPosts.useQuery({ author: name });
  const { data, mutate: createNewPost } = api.post.createPost.useMutation();
  console.log("user", user);
  console.log("userPosts", userPosts);
  console.log("data", data);
  return (
    <form
      className="container flex flex-col gap-3 p-3"
      onSubmit={async (e) => {
        e.preventDefault();
      }}
    >
      <button
        className="rounded-full  p-2 font-semibold"
        onClick={async () => {
          const newPost = createNewPost({
            title: "This week glob",
            category: "BusinessEntrepreneurship",
            content: "tesfjdksjfkldsajfklt",
            tags: ["test"],
            published: true,
          });
        }}
      >
        send post
      </button>
    </form>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.checkSecret.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-black">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}

const Layout = ({ children }: { children: ReactElement }) => {
  return <>{children}</>;
};
Home.Layout = Layout;
