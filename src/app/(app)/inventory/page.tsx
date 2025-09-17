
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CircleAlert, PackagePlus, Send, MessageSquareWarning, Wrench } from "lucide-react";
import { AddFeedStockForm } from "./add-feed-stock-form";
import { AddFeedAllocationForm } from "./add-feed-allocation-form";
import { DeleteFeedStockButton, DeleteFeedAllocationButton } from "./delete-buttons";
import { EditFeedStockButton, EditFeedAllocationButton } from "./edit-buttons";
import { format } from "date-fns";
import { ManageFeedTypes } from "./manage-feed-types";
import { RecordFeedUsageForm } from "./record-feed-usage-form";
import { ReportIssueForm } from "./report-issue-form";

export default async function InventoryPage() {
  const supabase = createClient();
  
  let user: any = null;
  if (supabase.auth && typeof supabase.auth.getUser === "function") {
    const userRes = await supabase.auth.getUser();
    user = userRes?.data?.user ?? null;
  }
  
  const [stockResponse, allocationResponse, profileResponse, feedTypesResponse, feedUsageResponse, issuesResponse] = await Promise.all([
    supabase.from('feed_stock').select('*').order('date', { ascending: false }),
    supabase.from('feed_allocations').select('*').order('date', { ascending: false }),
    user ? supabase.from('profiles').select('*').eq('id', user.id).single() : Promise.resolve({ data: null }),
    supabase.from('feed_types').select('*').order('name'),
    supabase.from('feed_usage').select('*').order('created_at', { ascending: false }),
    supabase.from('issues').select('*').order('created_at', { ascending: false }),
  ]);

  const { data: feedStock, error: stockError } = stockResponse;
  const { data: feedAllocations, error: allocationError } = allocationResponse;
  const { data: feedTypes, error: feedTypesError } = feedTypesResponse;
  const { data: feedUsage, error: feedUsageError } = feedUsageResponse;
  const { data: issues, error: issuesError } = issuesResponse;
  
  const profile = profileResponse.data;
  const userName = profile?.full_name ?? user?.email ?? "Current User";
  const isManager = profile?.role === 'Manager';
  const assignedShed = profile?.assigned_shed;

  if (stockError || allocationError || feedTypesError || feedUsageError || issuesError) {
    console.error("Inventory page fetch error:", stockError?.message || allocationError?.message || feedTypesError?.message || feedUsageError?.message || issuesError?.message);
  }
  
  const lowStockThreshold = 20;

  // Filter allocations for the worker's assigned shed
  const workerAllocations = isManager ? feedAllocations : (feedAllocations || []).filter(a => a.shed === assignedShed);

  if (!isManager) {
    // Worker View
    return (
        <div className="space-y-6">
            <RecordFeedUsageForm userName={userName} assignedShed={assignedShed} feedTypes={feedTypes ?? []} />
            <ReportIssueForm userName={userName} />

            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Send className="h-6 w-6 text-primary" /> Feed Allocated to Your Shed
                </CardTitle>
                <CardDescription>This is the feed that has been allocated to {assignedShed}.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Allocated</TableHead>
                      <TableHead>Feed Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workerAllocations && workerAllocations.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                        <TableCell className="font-medium">{item.feed_type}</TableCell>
                        <TableCell>{item.quantity_allocated}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                      </TableRow>
                    ))}
                    {(!workerAllocations || workerAllocations.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">No feed allocated to your shed yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Wrench className="h-6 w-6 text-primary" /> Your Feed Usage Log
                    </CardTitle>
                    <CardDescription>A log of the feed you have recorded as used.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date Recorded</TableHead>
                        <TableHead>Feed Type</TableHead>
                        <TableHead>Quantity Used</TableHead>
                        <TableHead>Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(feedUsage || []).filter(u => u.user_id === user.id).map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                          <TableCell className="font-medium">{item.feed_type}</TableCell>
                          <TableCell>{item.quantity_used}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                        </TableRow>
                      ))}
                      {(!feedUsage || feedUsage.filter(u => u.user_id === user.id).length === 0) && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">You have not recorded any feed usage yet.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
            </Card>
        </div>
    );
  }

  // Manager View
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <AddFeedStockForm feedTypes={feedTypes ?? []} />
            <AddFeedAllocationForm userName={userName} feedTypes={feedTypes ?? []} />
        </div>
        <ManageFeedTypes feedTypes={feedTypes ?? []} />
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <MessageSquareWarning className="h-6 w-6 text-destructive" /> Reported Issues
          </CardTitle>
          <CardDescription>Issues reported by workers regarding feed and other farm resources.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues && issues.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="max-w-sm truncate">{item.description}</TableCell>
                  <TableCell>{item.reported_by}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
               {(!issues || issues.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">No issues reported yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <PackagePlus className="h-6 w-6 text-primary" /> Current Feed Stock
          </CardTitle>
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
              {feedStock && feedStock.map((item: any) => (
                <TableRow key={item.id} className={item.quantity < lowStockThreshold ? 'bg-destructive/10 hover:bg-destructive/20' : ''}>
                  <TableCell>{format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell className="font-medium">{item.feed_type}</TableCell>
                  <TableCell>
                    {item.quantity < lowStockThreshold && <CircleAlert className="h-4 w-4 inline mr-1 text-destructive" />}
                    {item.quantity}
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.supplier || 'N/A'}</TableCell>
                  <TableCell>{item.cost ? `GH₵${Number(item.cost).toFixed(2)}` : 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <EditFeedStockButton record={item} feedTypes={feedTypes ?? []}/>
                    <DeleteFeedStockButton id={item.id} />
                  </TableCell>
                </TableRow>
              ))}
               {(!feedStock || feedStock.length === 0) && (
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
          <CardTitle className="font-headline flex items-center gap-2">
            <Send className="h-6 w-6 text-primary" /> Feed Allocation Log
          </CardTitle>
          <CardDescription>Record of feed allocated to different sheds.</CardDescription>
        </CardHeader>
        <CardContent>
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
              {feedAllocations && feedAllocations.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell>{item.shed}</TableCell>
                  <TableCell className="font-medium">{item.feed_type}</TableCell>
                  <TableCell>{item.quantity_allocated}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.allocated_by}</TableCell>
                  <TableCell className="text-right space-x-1">
                     <EditFeedAllocationButton record={item} userName={userName} feedTypes={feedTypes ?? []} />
                    <DeleteFeedAllocationButton id={item.id} />
                  </TableCell>
                </TableRow>
              ))}
              {(!feedAllocations || feedAllocations.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">No allocation records found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
