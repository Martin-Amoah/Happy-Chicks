import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignInClientPage } from "./client";


export const dynamic = "force-dynamic";


export default async function SignInPage() {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 mr-2">
            <path d="M12 2C8.686 2 6 6.477 6 11c0 4.97 2.539 8.261 6 9.5 3.461-1.239 6-4.53 6-9.5C18 6.477 15.314 2 12 2z" />
          </svg>
          Happy Chicks
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Welcome to Happy Chicks Farm Management System. Please sign in to access your dashboard.
            </p>
          </blockquote>
        </div>
      </div>
      <SignInClientPage />
    </div>
  );
}
