import { Metadata } from "next";
import AuthForm from "~/components/ui/AuthForm";
function Page() {
  return <AuthForm mode="signin" />;
}
export default Page;

Page.Layout = function Layout({ children }: { children: React.ReactNode }) {
  // remove the layout
  return <>{children}</>;
};
