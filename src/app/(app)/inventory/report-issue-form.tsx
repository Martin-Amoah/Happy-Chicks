
"use client";

import React, { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquareWarning, Loader2, User } from "lucide-react";
import { reportIssue, type FormState } from './actions';
import { useToast } from "@/hooks/use-toast";

interface ReportIssueFormProps {
  userName: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant="destructive">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquareWarning className="mr-2 h-4 w-4" />}
      {pending ? "Submitting..." : "Submit Report"}
    </Button>
  );
}

export function ReportIssueForm({ userName }: ReportIssueFormProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: FormState = { message: "", success: undefined };
  const [state, formAction] = useActionState(reportIssue, initialState);

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

  const issueCategories = ["Low Feed Stock", "Feed Spoilage", "Bird Sickness", "Equipment Malfunction", "Other"];

  return (
    <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><MessageSquareWarning className="h-6 w-6 text-destructive" /> Report an Issue</CardTitle>
          <CardDescription>Alert management about any issues you encounter.</CardDescription>
        </CardHeader>
        <form action={formAction} ref={formRef}>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label>Reported By</Label>
                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{userName}</span>
                    </div>
                </div>
                 <div className="space-y-1.5">
                    <Label htmlFor="category">Issue Category</Label>
                    <Select name="category">
                        <SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger>
                        <SelectContent>
                            {issueCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {state.errors?.category && <p className="text-sm font-medium text-destructive">{state.errors.category[0]}</p>}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="description">Description of Issue</Label>
                    <Textarea id="description" name="description" placeholder="Provide a detailed description of the problem..." />
                    {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <SubmitButton />
            </CardFooter>
        </form>
    </Card>
  );
}
