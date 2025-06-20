import { redirect } from "next/navigation";

export default function HomePage() {
  // TODO: Check authentication status
  const isAuthenticated = false;

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  redirect("/auth/signin");
}
