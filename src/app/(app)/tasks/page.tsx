
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ListChecks, PlusCircle, Edit3, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TaskItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
  createdAt: string;
  notes?: string;
}

const initialTasks: TaskItem[] = [
  { id: 'task1', description: 'Clean Shed A ventilation system', assignedTo: 'Worker Bravo', dueDate: '2024-07-25', status: 'Pending', createdAt: '2024-07-22', notes: 'Focus on exhaust fans.' },
  { id: 'task2', description: 'Repair fence in Paddock 3', assignedTo: 'Worker Charlie', dueDate: '2024-07-24', status: 'In Progress', createdAt: '2024-07-22' },
  { id: 'task3', description: 'Order new batch of Chick Mash', assignedTo: 'Manager Alpha', status: 'Completed', createdAt: '2024-07-20' },
];

// Mock users for assignee select
const farmUsers = [
  { id: 'manager', name: 'Manager Alpha' },
  { id: 'worker1', name: 'Worker Bravo' },
  { id: 'worker2', name: 'Worker Charlie' },
];

export default function TasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask: TaskItem = {
      id: `task${Date.now()}`,
      description: formData.get('taskDescription') as string,
      assignedTo: formData.get('assignedTo') as string,
      dueDate: formData.get('dueDate') as string || undefined,
      status: formData.get('status') as TaskItem['status'],
      createdAt: currentDate,
      notes: formData.get('notes') as string || undefined,
    };
    setTasks(prev => [newTask, ...prev]);
    toast({ title: "Task Added", description: `Task "${newTask.description}" created.` });
    event.currentTarget.reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" /> Create New Task
          </CardTitle>
          <CardDescription>Assign and manage farm tasks and activities.</CardDescription>
        </CardHeader>
        <form onSubmit={handleAddTask}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="taskDescription">Task Description</Label>
              <Textarea id="taskDescription" name="taskDescription" placeholder="e.g., Inspect water system in Shed B" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select name="assignedTo" defaultValue={farmUsers[0].name}>
                <SelectTrigger id="assignedTo">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {farmUsers.map(user => (
                    <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input id="dueDate" name="dueDate" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="Pending">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" name="notes" placeholder="Any additional details or comments" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Task List</CardTitle>
          <CardDescription>Overview of current and past tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium max-w-xs truncate">{task.description}</TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>{task.dueDate || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={
                      task.status === 'Completed' ? 'default' :
                      task.status === 'Pending' ? 'secondary' :
                      task.status === 'In Progress' ? 'outline' : 
                      'destructive' 
                    }
                    className={task.status === 'Completed' ? 'bg-green-600 text-white' : task.status === 'In Progress' ? 'border-blue-500 text-blue-600' : ''}
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.createdAt}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="hover:text-accent"><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {tasks.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">No tasks found.</TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
