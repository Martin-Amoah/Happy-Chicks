
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EggIcon } from "@/components/icons/EggIcon";
import { BirdIcon } from "@/components/icons/BirdIcon";
import { FeedIcon } from "@/components/icons/FeedIcon";
import { ClipboardCheck, PlusCircle, TrendingUp } from 'lucide-react';

interface WorkerDashboardProps {
  kpis: {
    totalEggs: number;
    cratesAndPieces: string;
    eggCollectionEntries: number;
    mortalityEntries: number;
    feedAllocationEntries: number;
    liveBirdsInShed: string;
  }
}

function ProgressCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
      {icon}
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold font-headline text-primary">{value}</p>
      </div>
    </div>
  )
}

export function WorkerDashboard({ kpis }: WorkerDashboardProps) {

  return (
    <div className="flex flex-col space-y-6 h-full">
      <Card className="bg-gradient-to-r from-card to-card/80 flex-shrink-0">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Worker Dashboard</CardTitle>
          <CardDescription className="text-base">Your daily hub for farm activities and progress tracking.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                <PlusCircle className="h-6 w-6 text-primary" /> Quick Actions
              </CardTitle>
              <CardDescription>Quickly log daily farm activities.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow content-center">
              <Button asChild variant="outline" size="lg" className="h-24 flex flex-col items-center justify-center gap-2 text-center">
                <Link href="/egg-collection">
                  <EggIcon className="h-8 w-8 text-accent" />
                  <span className="text-sm">Record Egg Collection</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-24 flex flex-col items-center justify-center gap-2 text-center">
                <Link href="/dead-birds">
                  <BirdIcon className="h-8 w-8 text-destructive" />
                  <span className="text-sm">Log Dead Birds</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-24 flex flex-col items-center justify-center gap-2 text-center">
                <Link href="/inventory">
                   <FeedIcon className="h-8 w-8 text-blue-500" />
                  <span className="text-sm">Allocate Feed</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                    <TrendingUp className="h-6 w-6 text-primary" /> Today's Progress
                </CardTitle>
                <CardDescription>Your activity logged for today.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow content-center">
                  <ProgressCard 
                    title="Live Birds in Your Shed"
                    value={kpis?.liveBirdsInShed ?? 'N/A'}
                    icon={<BirdIcon className="h-8 w-8 text-accent" />}
                  />
                  <ProgressCard 
                    title="Eggs You Collected"
                    value={kpis?.totalEggs ?? 0}
                    icon={<EggIcon className="h-8 w-8 text-accent" />}
                  />
                  <ProgressCard 
                    title="Crates & Pieces"
                    value={kpis?.cratesAndPieces ?? "0 Crates, 0 Pieces"}
                    icon={<EggIcon className="h-8 w-8 text-accent" />}
                  />
                   <ProgressCard 
                    title="Collection Records"
                    value={kpis?.eggCollectionEntries ?? 0}
                    icon={<ClipboardCheck className="h-8 w-8 text-accent" />}
                  />
                   <ProgressCard 
                    title="Dead Birds Logs"
                    value={kpis?.mortalityEntries ?? 0}
                    icon={<ClipboardCheck className="h-8 w-8 text-destructive" />}
                  />
                   <ProgressCard 
                    title="Feed Allocations"
                    value={kpis?.feedAllocationEntries ?? 0}
                    icon={<ClipboardCheck className="h-8 w-8 text-blue-500" />}
                  />
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
