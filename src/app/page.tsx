<<<<<<< HEAD

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg">Redirecting to login...</p>
    </div>
  );
=======
import { redirect } from "next/navigation";

export default function HomePage() {
  // TODO: Check authentication status
  const isAuthenticated = false;

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  redirect("/auth/signin");
>>>>>>> 7375cd47df2a9aece47966c907a348fcbb856bc3
}
