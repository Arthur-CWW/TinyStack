import { Navbar } from "./ui/Navbar";
// import { Category, Post } from "@prisma/client";
// import Image from "next/image";
import Link from "next/link";
import { Category, Post } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CategoryFilterPill } from "~/pages";
import { postOutput } from "~/utils/types";
import { ProfilePic } from "../components/ui/profile-pic";

export const DefaultNavLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
export function Main({
  blogs,
  className,
  children, // children act as header
}: { blogs: postOutput["prototype"] } & React.PropsWithoutRef<
  JSX.IntrinsicElements["main"]
>) {
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

  if (!blogs) {
    return null;
  }
  const categories = Object.values(Category);
  return (
    <main className="container border-t-[1px] border-gray-200 ">
      <div className="grid min-h-screen lg:grid-cols-[1fr_368px]">
        <main className="px-14">
          {blogs
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
                  {" "}
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
                        <Link href={`/${post.author.name}/${post.id}`}>
                          {Math.random() > 0.1 ? (
                            <span>· Selected for you</span>
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
