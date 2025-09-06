
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EggIcon } from "@/components/icons/EggIcon";
import { BirdIcon } from "@/components/icons/BirdIcon";
import { FeedIcon } from "@/components/icons/FeedIcon";
import { PlusCircle } from 'lucide-react';

interface WorkerDashboardProps {
  tasks: any[];
  users: any[];
}

export function WorkerDashboard({ tasks, users }: WorkerDashboardProps) {

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-card to-card/80">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Worker Dashboard</CardTitle>
          <CardDescription className="text-base">This is a placeholder for the worker view. Currently, only the manager role is active.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-2xl">
            <PlusCircle className="h-6 w-6 text-primary" /> Quick Actions
          </CardTitle>
          <CardDescription>Quickly log daily farm activities.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button asChild variant="outline" size="lg" className="h-24 flex flex-col items-center justify-center gap-2">
            <Link href="/egg-collection">
              <EggIcon className="h-8 w-8 text-accent" />
              <span className="text-base">Record Egg Collection</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-24 flex flex-col items-center justify-center gap-2">
            <Link href="/dead-birds">
              <BirdIcon className="h-8 w-8 text-destructive" />
              <span className="text-base">Log Dead Birds</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-24 flex flex-col items-center justify-center gap-2">
            <Link href="/inventory">
               <FeedIcon className="h-8 w-8 text-blue-500" />
              <span className="text-base">Allocate Feed</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
