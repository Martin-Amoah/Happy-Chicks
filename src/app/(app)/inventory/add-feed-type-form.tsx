
"use client";

import React, { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wheat, Loader2, Plus } from "lucide-react";
import { addFeedType, type FormState } from './actions';
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
      {pending ? "Adding..." : "Add Feed Type"}
    </Button>
  );
}

export function AddFeedTypeForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: FormState = { message: "", success: undefined };
  const [state, formAction] = useActionState(addFeedType, initialState);

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


  return (
    <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Wheat className="h-6 w-6 text-primary" /> Manage Feed Types</CardTitle>
          <CardDescription>Add new feed types to be used in inventory tracking. (Manager Only)</CardDescription>
        </CardHeader>
        <form action={formAction} ref={formRef}>
            <CardContent className="flex flex-col md:flex-row gap-4 items-end">
                <div className="space-y-1.5 flex-grow">
                    <Label htmlFor="name">New Feed Type Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Broiler Starter Crumble" />
                    {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
                </div>
                <SubmitButton />
            </CardContent>
        </form>
    </Card>
  );
}
