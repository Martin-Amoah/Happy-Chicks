
"use client";

import React, { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Loader2, User, Calendar, Home } from "lucide-react";
import { recordFeedUsage, type FormState } from './actions';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface RecordFeedUsageFormProps {
  userName: string;
  assignedShed: string | null;
  feedTypes: { id: string; name: string }[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wrench className="mr-2 h-4 w-4" />}
      {pending ? "Recording..." : "Record Usage"}
    </Button>
  );
}

export function RecordFeedUsageForm({ userName, assignedShed, feedTypes }: RecordFeedUsageFormProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: FormState = { message: "", success: undefined };
  const [state, formAction] = useActionState(recordFeedUsage, initialState);

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

  const today = format(new Date(), 'PPP');

  return (
    <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Wrench className="h-6 w-6 text-primary" /> Record Daily Feed Usage</CardTitle>
          <CardDescription>Log the amount of feed consumed in your assigned shed. The date is set automatically.</CardDescription>
        </CardHeader>
        <form action={formAction} ref={formRef}>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label>Date</Label>
                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{today}</span>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="shed">Shed</Label>
                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                        <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{assignedShed || 'Not Assigned'}</span>
                    </div>
                    <input type="hidden" name="shed" value={assignedShed ?? ''} />
                    {state.errors?.shed && <p className="text-sm font-medium text-destructive">{state.errors.shed[0]}</p>}
                </div>
                 <div className="space-y-1.5">
                    <Label htmlFor="feedType">Feed Type</Label>
                    <Select name="feedType">
                        <SelectTrigger id="feedType"><SelectValue placeholder="Select a feed type" /></SelectTrigger>
                        <SelectContent>
                            {feedTypes.map((type) => (
                                <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {state.errors?.feedType && <p className="text-sm font-medium text-destructive">{state.errors.feedType[0]}</p>}
                </div>
                 <div className="space-y-1.5">
                    <Label htmlFor="quantityUsed">Quantity Used</Label>
                    <Input id="quantityUsed" name="quantityUsed" type="number" step="0.1" placeholder="e.g., 4.5" />
                    {state.errors?.quantityUsed && <p className="text-sm font-medium text-destructive">{state.errors.quantityUsed[0]}</p>}
                </div>
                 <div className="space-y-1.5">
                    <Label htmlFor="unit">Unit</Label>
                    <Select name="unit" defaultValue="bags">
                        <SelectTrigger id="unit"><SelectValue placeholder="Select unit" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bags">Bags</SelectItem>
                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        </SelectContent>
                    </Select>
                     {state.errors?.unit && <p className="text-sm font-medium text-destructive">{state.errors.unit[0]}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label>Recorded By</Label>
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
