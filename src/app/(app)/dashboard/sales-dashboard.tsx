
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CircleDollarSign, Package, PlusCircle, ArrowRight } from "lucide-react";
import { format } from 'date-fns';

interface SalesDashboardProps {
  kpis: {
    totalRevenue: string | number;
    totalSales: number;
  };
  recentSales: any[];
}

export function SalesDashboard({ kpis, recentSales }: SalesDashboardProps) {
  return (
    <div className="space-y-6">
       <Card className="bg-gradient-to-r from-card to-card/80">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Sales Representative Dashboard</CardTitle>
          <CardDescription className="text-base">Your hub for managing sales and tracking performance.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <KpiCard
          title="Total Revenue Today"
          value={kpis.totalRevenue}
          icon={<CircleDollarSign className="h-6 w-6 text-accent" />}
          description="Total value of all sales recorded today."
        />
        <KpiCard
          title="Total Sales Today"
          value={kpis.totalSales}
          icon={<Package className="h-6 w-6 text-accent" />}
          description="Total number of individual sales transactions."
        />
      </div>

       <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Recent Sales</CardTitle>
                    <CardDescription>A log of the most recent sales transactions.</CardDescription>
                </div>
                 <Button asChild variant="outline">
                    <Link href="/sales">
                        View All Sales <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Item Sold</TableHead>
                            <TableHead>Total Price (GH₵)</TableHead>
                            <TableHead>Customer</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentSales.map((sale) => (
                            <TableRow key={sale.id}>
                                <TableCell>{format(new Date(sale.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                                <TableCell className="font-medium">{sale.item_sold}</TableCell>
                                <TableCell>{Number(sale.total_price).toFixed(2)}</TableCell>
                                <TableCell>{sale.customer_name || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                         {recentSales.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">No sales recorded today.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

       <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <PlusCircle className="h-6 w-6 text-primary" /> Quick Action
                </CardTitle>
                <CardDescription>Quickly log a new sale.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/sales">Record a New Sale</Link>
                </Button>
            </CardContent>
       </Card>

    </div>
  );
}
