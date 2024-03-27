import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Main } from "~/components/layout";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { before } from "node:test";
import { ProfilePic } from "~/components/ui/profile-pic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ProfileDots } from "~/components/ui/ProfileDropDown";
import { useUpload } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export default function Page() {
  // TODO layouts
  const router = useRouter();
  const { uploadImage, signImage, disabled } = useUpload();
  // rout
  // user undefined
  // why is user undefiend
  // TODO figure out why user is undefined sometimes
  const userid = router.query.user as string;
  const { data } = api.post.getUserPosts.useQuery({
    id: userid,
  });
  if (!data) return null;

  return (
    <Main blogs={data?.posts ?? []} className="container max-w-[80ch] py-8">
      <header className="flex items-center justify-between  p-3">
        <h1 className="py-8 text-5xl font-semibold capitalize">
          {data?.user?.name ?? "Loading..."}
        </h1>
        <ProfileDots />
      </header>
      <nav>
        <Tabs defaultValue="account" className="relative w-full  ">
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="lists">lists</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <div className=" absolute bottom-1 w-full border-b-1 " />
        </Tabs>
      </nav>
      <form
        action=""
        onSubmit={async (e) => {
          e.preventDefault();
          const url = await uploadImage();
        }}
      >
        <input
          id="file"
          type="file"
          onChange={(e) => {
            signImage(e?.target?.files?.item(0));
          }}
          accept="image/png, image/jpeg"
        />
        <Button variant="link" disabled={disabled}>
          Submit
        </Button>
      </form>
    </Main>
  );
}
