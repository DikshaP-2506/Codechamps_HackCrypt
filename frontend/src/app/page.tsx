import { redirect } from "next/navigation";

export default function Home() {
  // Landing page always redirects to sign-in
  redirect("/sign-in");
}
