
"use client";

import React, { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EggIcon } from "@/components/icons/EggIcon";
import { PlusCircle, Loader2 } from "lucide-react";
import { addEggCollection, type FormState } from './actions';
import { useToast } from "@/hooks/use-toast";

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

export function AddEggRecordForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: FormState = { message: "", success: undefined };
  const [state, formAction] = useActionState(addEggCollection, initialState);

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
      }
  }, [state, toast]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <form action={formAction} ref={formRef}>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <EggIcon className="h-6 w-6 text-primary" /> Record Egg Collection
          </CardTitle>
          <CardDescription>Log daily egg collection data for each shed.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="collectionDate">Date</Label>
            <Input id="collectionDate" name="collectionDate" type="date" defaultValue={today} />
            {state.errors?.date && <p className="text-sm font-medium text-destructive">{state.errors.date[0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="shed">Shed</Label>
            <Input id="shed" name="shed" placeholder="e.g., Shed A" />
            {state.errors?.shed && <p className="text-sm font-medium text-destructive">{state.errors.shed[0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="totalEggs">Total Eggs Collected</Label>
            <Input id="totalEggs" name="totalEggs" type="number" placeholder="e.g., 400" />
            {state.errors?.total_eggs && <p className="text-sm font-medium text-destructive">{state.errors.total_eggs[0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="brokenEggs">Broken Eggs</Label>
            <Input id="brokenEggs" name="brokenEggs" type="number" placeholder="e.g., 5" />
            {state.errors?.broken_eggs && <p className="text-sm font-medium text-destructive">{state.errors.broken_eggs[0]}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2 lg:col-span-4">
            <Label htmlFor="collectedBy">Collected By</Label>
            <Input id="collectedBy" name="collectedBy" placeholder="e.g., John Doe" />
            {state.errors?.collected_by && <p className="text-sm font-medium text-destructive">{state.errors.collected_by[0]}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
