
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { EggIcon } from "@/components/icons/EggIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

// Mock data for demonstration
const eggCollectionData = [
  { id: '1', date: '2024-07-21', shed: 'Shed A', totalEggs: 385, brokenEggs: 4, collectedBy: 'Worker 1' },
  { id: '2', date: '2024-07-21', shed: 'Shed B', totalEggs: 400, brokenEggs: 2, collectedBy: 'Worker 2' },
  { id: '3', date: '2024-07-20', shed: 'Shed A', totalEggs: 380, brokenEggs: 5, collectedBy: 'Worker 1' },
];

export default function EggProductionPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <EggIcon className="h-6 w-6 text-primary" /> Record Egg Collection
          </CardTitle>
          <CardDescription>Log daily egg collection data for each shed.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="collectionDate">Date</Label>
            <Input id="collectionDate" type="date" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="shed">Shed</Label>
            <Input id="shed" placeholder="e.g., Shed A" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="totalEggs">Total Eggs Collected</Label>
            <Input id="totalEggs" type="number" placeholder="e.g., 400" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="brokenEggs">Broken Eggs</Label>
            <Input id="brokenEggs" type="number" placeholder="e.g., 5" />
          </div>
           <div className="space-y-1.5 md:col-span-2 lg:col-span-4">
            <Label htmlFor="collectedBy">Collected By</Label>
            <Input id="collectedBy" placeholder="e.g., John Doe" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" /> Save Record
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Egg Collection Log</CardTitle>
          <CardDescription>Recent egg collection records.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Shed</TableHead>
                <TableHead>Total Eggs</TableHead>
                <TableHead>Broken Eggs</TableHead>
                <TableHead>Collected By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eggCollectionData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.shed}</TableCell>
                  <TableCell>{record.totalEggs}</TableCell>
                  <TableCell>{record.brokenEggs}</TableCell>
                  <TableCell>{record.collectedBy}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
              {eggCollectionData.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">No egg collection records yet.</TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
