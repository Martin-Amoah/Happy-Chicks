
"use client";

import React, { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2, User, Calendar } from "lucide-react";
import { updateFeedStock, updateFeedAllocation, type FormState } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';

type FeedStockRecord = {
  id: string;
  date: string;
  feed_type: string;
  quantity: number;
  unit: string;
  supplier: string | null;
  cost: number | null;
};

type FeedAllocationRecord = {
  id: string;
  date: string;
  shed: string;
  feed_type: string;
  quantity_allocated: number;
  unit: string;
  allocated_by: string;
}

interface EditFeedButtonsProps {
    feedTypes: { id: string; name: string }[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving Changes...
        </>
      ) : (
        <>
          <Edit className="mr-2 h-4 w-4" /> Save Changes
        </>
      )}
    </Button>
  );
}

export function EditFeedStockButton({ record, feedTypes }: { record: FeedStockRecord } & EditFeedButtonsProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const initialState: FormState = { message: "", success: undefined };
  const [state, formAction] = useActionState(updateFeedStock, initialState);

  useEffect(() => {
      if (state.message) {
          toast({
              title: state.success ? "Success" : "Error",
              description: state.message,
              variant: state.success ? "default" : "destructive",
          });
      }
      if (state.success) {
          setOpen(false);
      }
  }, [state, toast]);
  
  const today = format(new Date(), 'PPP');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:text-accent">
                <Edit className="h-4 w-4" />
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>Edit Feed Stock Record</DialogTitle>
                <DialogDescription>Update the details for this stock item. The date will be set to today.</DialogDescription>
            </DialogHeader>
            <form action={formAction}>
                <input type="hidden" name="id" value={record.id} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                     <div className="space-y-1.5">
                        <Label>Date</Label>
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                           <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                           <span>{today} (updates on save)</span>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="feedType-edit">Feed Type</Label>
                        <Select name="feedType" defaultValue={record.feed_type}>
                            <SelectTrigger id="feedType-edit"><SelectValue placeholder="Select feed type" /></SelectTrigger>
                            <SelectContent>
                                {feedTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {state.errors?.feedType && <p className="text-sm font-medium text-destructive">{state.errors.feedType[0]}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="quantity-edit">Quantity</Label>
                        <Input id="quantity-edit" name="quantity" type="number" defaultValue={record.quantity} />
                        {state.errors?.quantity && <p className="text-sm font-medium text-destructive">{state.errors.quantity[0]}</p>}
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="unit-edit">Unit</Label>
                        <Select name="unit" defaultValue={record.unit}>
                            <SelectTrigger id="unit-edit"><SelectValue placeholder="Select unit" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bags">Bags</SelectItem>
                                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            </SelectContent>
                        </Select>
                        {state.errors?.unit && <p className="text-sm font-medium text-destructive">{state.errors.unit[0]}</p>}
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="supplier-edit">Supplier (Optional)</Label>
                        <Input id="supplier-edit" name="supplier" defaultValue={record.supplier ?? ''} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="cost-edit">Cost per Unit (Optional)</Label>
                        <Input id="cost-edit" name="cost" type="number" step="0.01" defaultValue={record.cost ?? ''} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <SubmitButton />
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
}

export function EditFeedAllocationButton({ record, userName, feedTypes }: { record: FeedAllocationRecord, userName: string } & EditFeedButtonsProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const initialState: FormState = { message: "", success: undefined };
  const [state, formAction] = useActionState(updateFeedAllocation, initialState);
  const sheds = ["Shed A", "Shed B", "Shed C", "Shed D", "Shed E"];

  useEffect(() => {
      if (state.message) {
          toast({
              title: state.success ? "Success" : "Error",
              description: state.message,
              variant: state.success ? "default" : "destructive",
          });
      }
      if (state.success) {
          setOpen(false);
      }
  }, [state, toast]);
  
  const today = format(new Date(), 'PPP');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:text-accent">
                <Edit className="h-4 w-4" />
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>Edit Feed Allocation</DialogTitle>
                <DialogDescription>Update the details for this allocation record. The date will be set to today.</DialogDescription>
            </DialogHeader>
            <form action={formAction}>
                <input type="hidden" name="id" value={record.id} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                    <div className="space-y-1.5">
                        <Label>Allocation Date</Label>
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                           <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                           <span>{today} (updates on save)</span>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="shed-alloc-edit">Shed</Label>
                         <Select name="shed" defaultValue={record.shed}>
                          <SelectTrigger id="shed-alloc-edit">
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
                        <Label htmlFor="feedType-alloc-edit">Feed Type</Label>
                         <Select name="feedType" defaultValue={record.feed_type}>
                            <SelectTrigger id="feedType-alloc-edit"><SelectValue placeholder="Select feed type" /></SelectTrigger>
                            <SelectContent>
                                {feedTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {state.errors?.feedType && <p className="text-sm font-medium text-destructive">{state.errors.feedType[0]}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="quantityAllocated-edit">Quantity Allocated</Label>
                        <Input id="quantityAllocated-edit" name="quantityAllocated" type="number" defaultValue={record.quantity_allocated} />
                        {state.errors?.quantityAllocated && <p className="text-sm font-medium text-destructive">{state.errors.quantityAllocated[0]}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="unit-alloc-edit">Unit</Label>
                        <Select name="unit" defaultValue={record.unit}>
                            <SelectTrigger id="unit-alloc-edit"><SelectValue placeholder="Select unit" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bags">Bags</SelectItem>
                                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            </SelectContent>
                        </Select>
                        {state.errors?.unit && <p className="text-sm font-medium text-destructive">{state.errors.unit[0]}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label>Allocated By</Label>
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                           <User className="mr-2 h-4 w-4 text-muted-foreground" />
                           <span>{userName} (Current User)</span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <SubmitButton />
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
}
