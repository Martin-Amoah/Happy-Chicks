
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, UserPlus, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from 'date-fns';

export default async function UserManagementPage() {
  const supabase = createClient();
  const { data: users, error } = await supabase
    .from('user_details')
    .select('*')
    .order('email');

  if (error) {
    console.error("Error fetching users:", error.message);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Users</CardTitle>
          <CardDescription>Could not fetch user data. Please check the console or try again later.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive-foreground bg-destructive p-3 rounded-md">{error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" /> User Management
            </CardTitle>
            <CardDescription>Manage users, roles, and permissions within CluckTrack.</CardDescription>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" disabled>
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </CardHeader>
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
              {users && users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
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
                  <TableCell>{user.last_sign_in_at ? `${formatDistanceToNow(new Date(user.last_sign_in_at))} ago` : 'Never'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="hover:text-accent" disabled><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive" disabled><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!users || users.length === 0) && (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">No users found.</TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         <CardFooter className="text-sm text-muted-foreground">
            Total users: {users?.length ?? 0}
        </CardFooter>
      </Card>
    </div>
  );
}
