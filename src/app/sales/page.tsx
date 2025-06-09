
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, PlusCircle, Edit3, Trash2, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SaleRecord {
  id: string;
  date: string;
  itemSold: string; // e.g., "Table Eggs", "Broiler Chicken"
  quantity: number;
  unit: string; // e.g., "crates", "pieces", "kg"
  unitPrice: number;
  totalPrice: number;
  customerName?: string;
  recordedBy: string;
}

const initialSales: SaleRecord[] = [
  { id: 'sale1', date: '2024-07-22', itemSold: 'Table Eggs', quantity: 10, unit: 'crates', unitPrice: 30, totalPrice: 300, customerName: 'Local Shop A', recordedBy: 'Manager Alpha' },
  { id: 'sale2', date: '2024-07-21', itemSold: 'Broiler Chicken', quantity: 50, unit: 'pieces', unitPrice: 15, totalPrice: 750, customerName: 'Festival Catering', recordedBy: 'Manager Alpha' },
  { id: 'sale3', date: '2024-07-20', itemSold: 'Table Eggs', quantity: 5, unit: 'crates', unitPrice: 30, totalPrice: 150, recordedBy: 'Worker Bravo' },
];

// Mock items for sale
const saleableItems = [
  { id: 'eggs_crates', name: 'Table Eggs (Crates)', unit: 'crates' },
  { id: 'eggs_dozens', name: 'Table Eggs (Dozens)', unit: 'dozens' },
  { id: 'broiler_live', name: 'Broiler Chicken (Live)', unit: 'pieces' },
  { id: 'broiler_dressed', name: 'Broiler Chicken (Dressed)', unit: 'kg' },
  { id: 'spent_layers', name: 'Spent Layers', unit: 'pieces' },
];

// Mock users for recordedBy
const farmUsers = [
  { id: 'manager', name: 'Manager Alpha' },
  { id: 'worker1', name: 'Worker Bravo' },
  { id: 'worker2', name: 'Worker Charlie' },
];


export default function SalesPage() {
  const { toast } = useToast();
  const [sales, setSales] = useState<SaleRecord[]>(initialSales);
  const [currentDate, setCurrentDate] = useState('');
  
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);


  useEffect(() => {
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    setTotalPrice(quantity * unitPrice);
  }, [quantity, unitPrice]);


  const handleAddSale = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const selectedItemInfo = saleableItems.find(item => item.name === formData.get('itemSold'));

    const newSale: SaleRecord = {
      id: `sale${Date.now()}`,
      date: formData.get('saleDate') as string,
      itemSold: formData.get('itemSold') as string,
      quantity: Number(formData.get('quantity')),
      unit: selectedItemInfo?.unit || 'units',
      unitPrice: Number(formData.get('unitPrice')),
      totalPrice: Number(formData.get('quantity')) * Number(formData.get('unitPrice')),
      customerName: formData.get('customerName') as string || undefined,
      recordedBy: formData.get('recordedBy') as string,
    };
    setSales(prev => [newSale, ...prev]);
    toast({ title: "Sale Recorded", description: `Sale of ${newSale.quantity} ${newSale.unit} of ${newSale.itemSold} recorded.` });
    event.currentTarget.reset();
    setQuantity(0);
    setUnitPrice(0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" /> Record New Sale
          </CardTitle>
          <CardDescription>Log sales of farm produce and livestock.</CardDescription>
        </CardHeader>
        <form onSubmit={handleAddSale}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="saleDate">Date of Sale</Label>
              <Input id="saleDate" name="saleDate" type="date" defaultValue={currentDate} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="itemSold">Item Sold</Label>
              <Select name="itemSold" required>
                <SelectTrigger id="itemSold">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {saleableItems.map(item => (
                    <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" placeholder="e.g., 10" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="0" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="unitPrice">Unit Price (GHS)</Label>
              <Input id="unitPrice" name="unitPrice" type="number" placeholder="e.g., 30" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} min="0" step="0.01" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="totalPrice">Total Price (GHS)</Label>
              <Input id="totalPrice" name="totalPrice" type="number" value={totalPrice} readOnly className="bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <Input id="customerName" name="customerName" placeholder="e.g., Aunty Ama" />
            </div>
            <div className="space-y-1.5 lg:col-span-1">
              <Label htmlFor="recordedBy">Recorded By</Label>
               <Select name="recordedBy" defaultValue={farmUsers[0].name} required>
                <SelectTrigger id="recordedBy">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {farmUsers.map(user => (
                    <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Record Sale
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><DollarSign className="h-6 w-6 text-primary"/> Sales Log</CardTitle>
          <CardDescription>History of all recorded sales transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item Sold</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Recorded By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell className="font-medium">{sale.itemSold}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>{sale.unit}</TableCell>
                  <TableCell>{sale.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>{sale.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{sale.customerName || 'N/A'}</TableCell>
                  <TableCell>{sale.recordedBy}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="hover:text-accent"><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {sales.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">No sales records yet.</TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

