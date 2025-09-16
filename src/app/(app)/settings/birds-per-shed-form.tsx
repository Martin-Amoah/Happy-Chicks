
"use client";

import React, { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BirdIcon } from "@/components/icons/BirdIcon";
import { Loader2, Save } from "lucide-react";
import { updateBirdsPerShed, type BirdsFormState } from './actions';
import { useToast } from "@/hooks/use-toast";

type BirdShedData = {
    shed: string;
    count: number | null;
};

interface BirdsPerShedFormProps {
    initialData: BirdShedData[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
       {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Bird Counts</>}
    </Button>
  );
}

const SHEDS = ["Shed A", "Shed B", "Shed C", "Shed D", "Shed E"];

export function BirdsPerShedForm({ initialData }: BirdsPerShedFormProps) {
    const { toast } = useToast();
    const initialState: BirdsFormState = { message: "", success: undefined };
    const [state, formAction] = useActionState(updateBirdsPerShed, initialState);

    const [shedData, setShedData] = useState<BirdShedData[]>(() => {
        return SHEDS.map(shedName => {
            const existing = initialData.find(d => d.shed === shedName);
            return { shed: shedName, count: existing?.count ?? 0 };
        });
    });

    const handleCountChange = (shed: string, value: string) => {
        const newCount = value === '' ? null : Number(value);
        setShedData(prevData =>
            prevData.map(d => (d.shed === shed ? { ...d, count: newCount } : d))
        );
    };

    useEffect(() => {
        if (state.message) {
            toast({
                title: state.success ? "Success" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
        }
    }, [state, toast]);
    
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center gap-2"><BirdIcon className="h-5 w-5 text-accent" /> Birds per Shed</CardTitle>
        <CardDescription>Set the initial or current bird population for each shed. This is used to calculate live birds per shed. (Only managers can edit)</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shedData.map(({ shed, count }) => (
                <div key={shed} className="space-y-1.5">
                    <Label htmlFor={`shed_${shed}`}>{shed}</Label>
                    <Input 
                        id={`shed_${shed}`} 
                        name={shed}
                        type="number"
                        placeholder="e.g., 5000"
                        value={count ?? ''}
                        onChange={(e) => handleCountChange(shed, e.target.value)}
                    />
                </div>
            ))}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
