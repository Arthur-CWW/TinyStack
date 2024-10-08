import { Navbar } from "./ui/Navbar";
// import { Category, Post } from "@prisma/client";
// import Image from "next/image";
import Link from "next/link";
import { Category, Post } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CategoryFilterPill } from "~/pages";
import { postOutput } from "~/utils/types";
import { ProfilePic } from "./ui/profile-pic";
import { useRouter } from "next/router";
import { ProfileDots } from "~/components/ui/ProfileDropDown";
import { Icons } from "~/components/icons";

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
  const router = useRouter();
  const searchQuery = router.query.search;
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredBlogs(blogs);
      return;
    }
    setFilteredBlogs(
      blogs.filter((post) => {
        return (
          post.title.toLowerCase().includes(searchQuery as string) ||
          post.subtitle?.toLowerCase().includes(searchQuery as string) ||
          post.author?.name?.toLowerCase().includes(searchQuery as string)
        );
      }),
    );
  }, [searchQuery]);
  const categories = Object.values(Category);
  return (
    <main className="container border-t-[1px] border-gray-200 ">
      <div className="grid min-h-screen lg:grid-cols-[1fr_368px]">
        <main className="*:px-6">
          {children}

          {filteredBlogs
            ?.filter((post) => {
              if (filteredCategories.length === 0) {
                return true;
              }
              return filteredCategories.includes(post.category);
            })

            .map((post) => (
              <div
                key={post.id}
                className="   flex flex-col border-b-[1px] border-gray-100 "
              >
                <div className="flex items-center gap-2  ">
                  {/* profile pic */}
                  <Link href={`/user/${post.author.id}`} className="flex gap-1">
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

                <Link
                  href={`/${post.author.name}/${post.id}`}
                  className="flex h-[208px] justify-between "
                >
                  <div
                    // TODO figure out whether I can use title and
                    // whether it will automatically be slugified
                    className="flex h-full w-full flex-col"
                  >
                    <h2 className="pb-2 text-2xl font-semibold capitalize ">
                      {post.title}
                    </h2>
                    <div className="line-clamp-4 flex-1">{post.subtitle}</div>
                    <li className="flex flex-1 items-center justify-between">
                      {/* this extra flex container needed otherwise it grows full width of the card */}
                      <div className="flex  items-center  gap-3 py-8 text-sm">
                        <button className=" flex   justify-center rounded-full  bg-gray-100 px-2 py-1 ">
                          {post.category.replace(/([a-z])([A-Z])/g, "$1 $2")}
                        </button>
                        <span className="flex justify-between gap-2 text-xs text-gray-400 ">
                          {/* TODO figure out why this is wrong  */}
                          {Math.ceil(post?.nwords ?? 0 / 200)} min read
                          {/* {Math.random() > 0.1 ? (
                            <span>· Selected for you</span>
                          ) : null} */}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <Icons.bookmark className="fill-gray-400  stroke-0 " />
                        <ProfileDots className="size-5 text-gray-400" />
                      </div>
                    </li>
                  </div>
                  <Image
                    src="https://picsum.photos/id/237/110/110"
                    alt=""
                    width={110}
                    height={110}
                    className="ml-16 h-28 w-28"
                  />
                </Link>
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
