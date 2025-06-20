import React from "react";
import { Card } from "@/components/ui/card";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="w-full max-w-[400px] p-4 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-primary">Happy Chicks</h1>
          <p className="text-sm text-muted-foreground">Poultry Farm Management</p>
        </div>
        <Card className="p-6">{children}</Card>
      </div>
    </div>
  );
}
