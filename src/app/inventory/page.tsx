"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PackagePlus, Trash2, Edit3, CircleAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeedStockItem {
  id: string;
  date: string;
  feedType: string;
  quantity: number; // in bags or kg
  unit: 'bags' | 'kg';
  supplier?: string;
  cost?: number; // per unit
}

interface FeedAllocationItem {
  id: string;
  date: string;
  shed: string;
  feedType: string;
  quantityAllocated: number; // in bags or kg
  unit: 'bags' | 'kg';
  allocatedBy: string;
}

const initialFeedStock: FeedStockItem[] = [
  { id: '1', date: '2024-07-15', feedType: 'Layers Mash', quantity: 120, unit: 'bags', supplier: 'Agro Feeds Ltd', cost: 50 },
  { id: '2', date: '2024-07-10', feedType: 'Growers Mash', quantity: 75, unit: 'bags', supplier: 'FarmChoice', cost: 45 },
  { id: '3', date: '2024-07-20', feedType: 'Chick Mash', quantity: 200, unit: 'kg', supplier: 'Agro Feeds Ltd', cost: 2 },
];

const initialFeedAllocations: FeedAllocationItem[] = [
  { id: 'alloc1', date: '2024-07-20', shed: 'Shed A', feedType: 'Layers Mash', quantityAllocated: 5, unit: 'bags', allocatedBy: 'Worker 1' },
  { id: 'alloc2', date: '2024-07-20', shed: 'Shed B', feedType: 'Layers Mash', quantityAllocated: 6, unit: 'bags', allocatedBy: 'Worker 2' },
  { id: 'alloc3', date: '2024-07-19', shed: 'Shed C', feedType: 'Growers Mash', quantityAllocated: 3, unit: 'bags', allocatedBy: 'Worker 1' },
];


export default function InventoryPage() {
  const { toast } = useToast();
  const [feedStock, setFeedStock] = useState<FeedStockItem[]>(initialFeedStock);
  const [feedAllocations, setFeedAllocations] = useState<FeedAllocationItem[]>(initialFeedAllocations);

  // TODO: Form state and handlers for adding/editing stock and allocations

  const handleAddStock = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Basic form data retrieval, in a real app use react-hook-form
    const formData = new FormData(event.currentTarget);
    const newStockItem: FeedStockItem = {
      id: Date.now().toString(),
      date: formData.get('date') as string,
      feedType: formData.get('feedType') as string,
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit') as 'bags' | 'kg',
      supplier: formData.get('supplier') as string || undefined,
      cost: Number(formData.get('cost')) || undefined,
    };
    setFeedStock(prev => [...prev, newStockItem]);
    toast({ title: "Stock Added", description: `${newStockItem.quantity} ${newStockItem.unit} of ${newStockItem.feedType} added.`});
    event.currentTarget.reset();
  };
  
  const lowStockThreshold = 20; // Example: 20 bags/kg

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><PackagePlus className="h-6 w-6 text-primary" /> Add New Feed Stock</CardTitle>
          <CardDescription>Record new arrivals of feed to the inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddStock} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="feedType">Feed Type</Label>
              <Input id="feedType" name="feedType" placeholder="e.g., Layers Mash" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" placeholder="e.g., 50" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="unit">Unit</Label>
              <Select name="unit" defaultValue="bags">
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bags">Bags</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="supplier">Supplier (Optional)</Label>
              <Input id="supplier" name="supplier" placeholder="e.g., Agro Feeds Ltd" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cost">Cost per Unit (Optional)</Label>
              <Input id="cost" name="cost" type="number" placeholder="e.g., 50" />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-2">
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <PackagePlus className="mr-2 h-4 w-4" /> Add to Stock
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Current Feed Stock</CardTitle>
          <CardDescription>Overview of available feed inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Added</TableHead>
                <TableHead>Feed Type</TableHead>
                <TableHead>Current Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Cost/Unit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedStock.map((item) => (
                <TableRow key={item.id} className={item.quantity < lowStockThreshold ? 'bg-destructive/10 hover:bg-destructive/20' : ''}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="font-medium">{item.feedType}</TableCell>
                  <TableCell>
                    {item.quantity < lowStockThreshold && <CircleAlert className="h-4 w-4 inline mr-1 text-destructive" />}
                    {item.quantity}
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.supplier || 'N/A'}</TableCell>
                  <TableCell>{item.cost ? `$${item.cost.toFixed(2)}` : 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="hover:text-accent"><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
               {feedStock.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">No stock items found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Feed Allocation Log</CardTitle>
          <CardDescription>Record of feed allocated to different sheds.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: Add form for new allocation */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Allocated</TableHead>
                <TableHead>Shed</TableHead>
                <TableHead>Feed Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Allocated By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedAllocations.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.shed}</TableCell>
                  <TableCell className="font-medium">{item.feedType}</TableCell>
                  <TableCell>{item.quantityAllocated}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.allocatedBy}</TableCell>
                  <TableCell className="text-right space-x-1">
                     <Button variant="ghost" size="icon" className="hover:text-accent"><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {feedAllocations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">No allocation records found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         <CardFooter className="flex justify-end">
            <Button variant="outline">View Full Allocation History</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
