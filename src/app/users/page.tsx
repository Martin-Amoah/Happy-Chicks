import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, UserPlus, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const userData = [
  { id: '1', name: 'Manager Alpha', email: 'manager@happychicks.com', role: 'Manager', status: 'Active', lastLogin: '2024-07-21 10:00 AM' },
  { id: '2', name: 'Worker Bravo', email: 'worker1@happychicks.com', role: 'Worker', status: 'Active', lastLogin: '2024-07-21 08:30 AM' },
  { id: '3', name: 'Worker Charlie', email: 'worker2@happychicks.com', role: 'Worker', status: 'Inactive', lastLogin: '2024-07-15 09:00 AM' },
];

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" /> User Management
            </CardTitle>
            <CardDescription>Manage users, roles, and permissions within Happy Chicks.</CardDescription>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </CardHeader>
        <CardContent>
          {/* Form for adding new user can be a Dialog or inline here */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">User List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                     <Badge variant={user.role === 'Manager' ? 'default' : 'secondary'}>
                        {user.role}
                     </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'outline' : 'destructive'} className={user.status === 'Active' ? 'border-green-500 text-green-600' : ''}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="hover:text-accent"><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {userData.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">No users found.</TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         <CardFooter className="text-sm text-muted-foreground">
            Total users: {userData.length}
        </CardFooter>
      </Card>
    </div>
  );
}
