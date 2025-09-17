
"use client";

import React, { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PackagePlus, Loader2, Calendar } from "lucide-react";
import { addFeedStock, type FormState } from './actions';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface AddFeedStockFormProps {
    feedTypes: { id: string; name: string }[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackagePlus className="mr-2 h-4 w-4" />}
      {pending ? "Adding..." : "Add to Stock"}
    </Button>
  );
}

export function AddFeedStockForm({ feedTypes }: AddFeedStockFormProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: FormState = { message: "", success: undefined };
  const [state, formAction] = useActionState(addFeedStock, initialState);

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
        <CardTitle className="font-headline flex items-center gap-2"><PackagePlus className="h-6 w-6 text-primary" /> Add New Feed Stock</CardTitle>
        <CardDescription>Record new arrivals of feed to the inventory. The date is automatically set to today.</CardDescription>
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
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" name="quantity" type="number" placeholder="e.g., 50" />
            {state.errors?.quantity && <p className="text-sm font-medium text-destructive">{state.errors.quantity[0]}</p>}
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
            <Label htmlFor="supplier">Supplier (Optional)</Label>
            <Input id="supplier" name="supplier" placeholder="e.g., Agro Feeds Ltd" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cost">Cost per Unit (Optional)</Label>
            <Input id="cost" name="cost" type="number" step="0.01" placeholder="e.g., 50.00" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-2">
            <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
