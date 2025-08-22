"use client";

import React, { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Loader2, Wheat } from "lucide-react";
import { addFeedType, deleteFeedType } from './actions';
import { useToast } from "@/hooks/use-toast";

interface ManageFeedTypesProps {
  feedTypes: { id: string; name: string }[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
      {pending ? "Adding..." : "Add"}
    </Button>
  );
}

function DeleteButton() {
    const { pending } = useFormStatus();
    return (
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" type="submit" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    )
}

export function ManageFeedTypes({ feedTypes }: ManageFeedTypesProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddAction = async (formData: FormData) => {
    const result = await addFeedType(formData);
    toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
    });
    if (result.success) {
      formRef.current?.reset();
    }
  };
  
  const handleDeleteAction = async (id: string) => {
    const result = await deleteFeedType(id);
    toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
    });
  };

  return (
    <Card className="lg:sticky lg:top-4">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Wheat className="h-6 w-6 text-primary" /> Manage Feed Types</CardTitle>
        <CardDescription>Add or remove feed types available for selection across the application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={handleAddAction} ref={formRef} className="flex items-end gap-2">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name" className="sr-only">New Feed Type</Label>
                <Input id="name" name="name" placeholder="e.g., Layer Mash" required/>
            </div>
            <SubmitButton />
        </form>

        <div className="space-y-2 pt-2">
            <h4 className="text-sm font-medium text-muted-foreground">Existing Feed Types</h4>
             {feedTypes.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">No feed types added yet.</p>}
            <div className="max-h-60 overflow-y-auto pr-2 space-y-1">
                {feedTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between rounded-md border p-2">
                        <span className="text-sm">{type.name}</span>
                        <form action={() => handleDeleteAction(type.id)}>
                            <DeleteButton />
                        </form>
                    </div>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
