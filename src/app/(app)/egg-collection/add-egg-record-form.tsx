
"use client";

import React, { useActionState, useEffect, useRef, useState, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EggIcon } from "@/components/icons/EggIcon";
import { PlusCircle, Loader2, User } from "lucide-react";
import { addEggCollection, type FormState } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" /> Save Record
        </>
      )}
    </Button>
  );
}

export function AddEggRecordForm({ userName }: { userName: string }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: FormState = { message: "", success: undefined };
  const [state, formAction] = useActionState(addEggCollection, initialState);
  const [totalEggs, setTotalEggs] = useState(0);

  const { crates, pieces } = useMemo(() => {
    if (isNaN(totalEggs) || totalEggs < 0) return { crates: 0, pieces: 0 };
    const cratesCalc = Math.floor(totalEggs / 30);
    const piecesCalc = totalEggs % 30;
    return { crates: cratesCalc, pieces: piecesCalc };
  }, [totalEggs]);


  useEffect(() => {
      if (state.message) {
          toast({
              title: state.success ? "Success" : "Error",
              description: state.message,
              variant: state.success ? "default" : "destructive",
          });
      }
      if (state.success) {
          formRef.current?.reset();
          setTotalEggs(0);
      }
  }, [state, toast]);

  const today = new Date().toISOString().split('T')[0];
  const sheds = ["Shed A", "Shed B", "Shed C", "Shed D", "Shed E"];
  const collectionTimes = ["Morning (6:30 AM)", "Mid-day (11:00 AM)", "Afternoon (3:00 PM)", "Evening (5:30 PM)"];

  return (
    <Card>
      <form action={formAction} ref={formRef}>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <EggIcon className="h-6 w-6 text-primary" /> Record Egg Collection
          </CardTitle>
          <CardDescription>Log daily egg collection data for each shed and collection time.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="collectionDate">Date</Label>
            <Input id="collectionDate" name="collectionDate" type="date" defaultValue={today} />
            {state.errors?.date && <p className="text-sm font-medium text-destructive">{state.errors.date[0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="shed">Shed</Label>
            <Select name="shed">
              <SelectTrigger id="shed">
                <SelectValue placeholder="Select a shed" />
              </SelectTrigger>
              <SelectContent>
                {sheds.map((shed) => (
                  <SelectItem key={shed} value={shed}>{shed}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.shed && <p className="text-sm font-medium text-destructive">{state.errors.shed[0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="collection_time">Collection Time</Label>
            <Select name="collection_time">
              <SelectTrigger id="collection_time">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {collectionTimes.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.collection_time && <p className="text-sm font-medium text-destructive">{state.errors.collection_time[0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="totalEggs">Total Eggs Collected</Label>
            <Input 
                id="totalEggs" 
                name="totalEggs" 
                type="number" 
                placeholder="e.g., 400"
                value={totalEggs}
                onChange={(e) => setTotalEggs(Number(e.target.value))}
            />
            {state.errors?.total_eggs && <p className="text-sm font-medium text-destructive">{state.errors.total_eggs[0]}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <Label>Crates (auto)</Label>
                 <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                   {crates}
                 </div>
              </div>
               <div className="space-y-1.5">
                <Label>Pieces (auto)</Label>
                 <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                   {pieces}
                 </div>
              </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="brokenEggs">Broken Eggs</Label>
            <Input id="brokenEggs" name="brokenEggs" type="number" placeholder="e.g., 5" defaultValue={0} />
            {state.errors?.broken_eggs && <p className="text-sm font-medium text-destructive">{state.errors.broken_eggs[0]}</p>}
          </div>
           <div className="space-y-1.5">
            <Label>Collected By</Label>
            <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{userName}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
