
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BirdIcon } from "@/components/icons/BirdIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit3, Trash2 } from "lucide-react";

// Mock data for demonstration
const mortalityData = [
  { id: '1', date: '2024-07-21', shed: 'Shed C', count: 1, cause: 'Natural causes', recordedBy: 'Worker 1' },
  { id: '2', date: '2024-07-20', shed: 'Shed A', count: 2, cause: 'Suspected disease, vet notified', recordedBy: 'Manager' },
];

export default function MortalityPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <BirdIcon className="h-6 w-6 text-destructive" /> Record Bird Mortality
          </CardTitle>
          <CardDescription>Log instances of bird mortality and adjust shed populations.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="mortalityDate">Date</Label>
            <Input id="mortalityDate" type="date" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="shed">Shed</Label>
            <Input id="shed" placeholder="e.g., Shed B" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mortalityCount">Number of Birds</Label>
            <Input id="mortalityCount" type="number" placeholder="e.g., 2" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="recordedBy">Recorded By</Label>
            <Input id="recordedBy" placeholder="Your Name" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="cause">Suspected Cause / Notes</Label>
            <Textarea id="cause" placeholder="e.g., Natural, disease, injury..." />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            <PlusCircle className="mr-2 h-4 w-4" /> Log Mortality
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Mortality Log</CardTitle>
          <CardDescription>Recent mortality records.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Shed</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Cause/Notes</TableHead>
                <TableHead>Recorded By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mortalityData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.shed}</TableCell>
                  <TableCell>{record.count}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.cause}</TableCell>
                  <TableCell>{record.recordedBy}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="hover:text-accent"><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {mortalityData.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">No mortality records yet.</TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
