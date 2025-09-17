
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { format } from 'date-fns';

// Helper function to get current user's profile
async function getCurrentUserProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role, assigned_shed')
      .eq('id', user.id)
      .single();
  
  return { user, profile };
}

// --- Feed Type Actions ---
const feedTypeSchema = z.object({
  name: z.string().min(1, 'Feed type name is required.'),
});

export async function addFeedType(formData: FormData): Promise<{ message: string; success: boolean; }> {
    const userProfile = await getCurrentUserProfile();
    if (userProfile?.profile?.role !== 'Manager') return { message: "Permission denied.", success: false };

    const validatedFields = feedTypeSchema.safeParse({ name: formData.get('name') });
    if (!validatedFields.success) return { message: "Invalid name.", success: false };

    const supabase = createClient();
    const { error } = await supabase.from('feed_types').insert({ name: validatedFields.data.name });

    if (error) {
        console.error("Supabase add feed type error:", error);
        if (error.code === '23505') return { message: "This feed type already exists.", success: false };
        return { message: `Database error: ${error.message}`, success: false };
    }
    revalidatePath('/inventory');
    return { message: 'Feed type added successfully.', success: true };
}

export async function deleteFeedType(id: string): Promise<{ message: string; success: boolean; }> {
    const userProfile = await getCurrentUserProfile();
    if (userProfile?.profile?.role !== 'Manager') return { message: "Permission denied.", success: false };

    const supabase = createClient();
    const { error } = await supabase.from('feed_types').delete().eq('id', id);

    if (error) {
        console.error("Supabase delete feed type error:", error);
        return { message: `Database error: ${error.message}`, success: false };
    }
    revalidatePath('/inventory');
    return { message: 'Feed type deleted successfully.', success: true };
}


// Schema for adding feed stock
const addFeedStockSchema = z.object({
  feedType: z.string().min(1, 'Feed type is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  supplier: z.string().optional(),
  cost: z.coerce.number().min(0, 'Cost cannot be negative').optional(),
});

// Schema for updating feed stock
const updateFeedStockSchema = addFeedStockSchema.extend({
    id: z.string().uuid("Invalid record ID"),
});

// Schema for adding feed allocation
const addFeedAllocationSchema = z.object({
  shed: z.string().min(1, 'Shed is required'),
  feedType: z.string().min(1, 'Feed type is required'),
  quantityAllocated: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
});

// Schema for updating feed allocation
const updateFeedAllocationSchema = addFeedAllocationSchema.extend({
    id: z.string().uuid("Invalid record ID"),
});

const recordFeedUsageSchema = z.object({
  shed: z.string().min(1, 'Shed is required'),
  feedType: z.string().min(1, 'Feed type is required'),
  quantityUsed: z.coerce.number().min(0.1, 'Quantity used must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
});

const reportIssueSchema = z.object({
    category: z.string().min(1, "Category is required."),
    description: z.string().min(10, "Description must be at least 10 characters long."),
});


export type FormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
  success?: boolean;
};

// Action to add a new feed stock item
export async function addFeedStock(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const userProfile = await getCurrentUserProfile();
  if (!userProfile?.user || userProfile?.profile?.role !== 'Manager') return { message: 'Permission denied.', success: false };

  const validatedFields = addFeedStockSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  
  const { feedType, quantity, unit, supplier, cost } = validatedFields.data;
  const date = format(new Date(), 'yyyy-MM-dd');

  const supabase = createClient();
  const { error } = await supabase.from('feed_stock').insert({
    date,
    feed_type: feedType,
    quantity,
    unit,
    supplier,
    cost,
    user_id: userProfile.user.id,
  });

  if (error) {
    console.error('Supabase error:', error);
    return { message: `Failed to save record: ${error.message}`, success: false };
  }

  revalidatePath('/inventory');
  revalidatePath('/dashboard');
  return { message: 'Successfully added feed stock.', success: true };
}

// Action to update a feed stock item
export async function updateFeedStock(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
    const userProfile = await getCurrentUserProfile();
    if (userProfile?.profile?.role !== 'Manager') return { message: 'Permission denied.', success: false };

    const supabase = createClient();
    const validatedFields = updateFeedStockSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: 'Invalid form data.',
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
        };
    }

    const { id, feedType, quantity, unit, supplier, cost } = validatedFields.data;
    const date = format(new Date(), 'yyyy-MM-dd');

    const { error } = await supabase
        .from('feed_stock')
        .update({
            date,
            feed_type: feedType,
            quantity,
            unit,
            supplier,
            cost,
        })
        .match({ id });

    if (error) {
        console.error('Supabase update error:', error);
        return { message: `Failed to update stock: ${error.message}`, success: false };
    }

    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    return { message: 'Successfully updated feed stock.', success: true };
}

// Action to add a new feed allocation record
export async function addFeedAllocation(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile?.user || userProfile?.profile?.role !== 'Manager') return { message: 'Permission denied.', success: false };

    const validatedFields = addFeedAllocationSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: 'Invalid form data.',
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
        };
    }

    const { shed, feedType, quantityAllocated, unit } = validatedFields.data;
    const allocated_by = userProfile.profile.full_name ?? userProfile.user.email ?? 'System';
    const date = format(new Date(), 'yyyy-MM-dd');

    const supabase = createClient();
    const { error } = await supabase.from('feed_allocations').insert({
        date,
        shed,
        feed_type: feedType,
        quantity_allocated: quantityAllocated,
        unit,
        allocated_by,
        user_id: userProfile.user.id,
    });

    if (error) {
        console.error('Supabase error:', error);
        return { message: `Failed to save allocation: ${error.message}`, success: false };
    }

    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    return { message: 'Successfully allocated feed.', success: true };
}

// Action to update a feed allocation record
export async function updateFeedAllocation(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile?.user || userProfile?.profile?.role !== 'Manager') return { message: 'Permission denied.', success: false };

    const supabase = createClient();
    const validatedFields = updateFeedAllocationSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: 'Invalid form data.',
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
        };
    }

    const { id, shed, feedType, quantityAllocated, unit } = validatedFields.data;
    const allocated_by = userProfile.profile.full_name ?? userProfile.user.email ?? 'System';
    const date = format(new Date(), 'yyyy-MM-dd');

    const { error } = await supabase
        .from('feed_allocations')
        .update({
            date,
            shed,
            feed_type: feedType,
            quantity_allocated: quantityAllocated,
            unit,
            allocated_by,
        })
        .match({ id });

    if (error) {
        console.error('Supabase update error:', error);
        return { message: `Failed to update allocation: ${error.message}`, success: false };
    }

    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    return { message: 'Successfully updated allocation.', success: true };
}


// Action to delete a feed stock item
export async function deleteFeedStock(id: string): Promise<{ message: string; success: boolean; }> {
  const userProfile = await getCurrentUserProfile();
  if (userProfile?.profile?.role !== 'Manager') return { message: 'Permission denied.', success: false };
  
  const supabase = createClient();
  const { error } = await supabase.from('feed_stock').delete().match({ id });

  if (error) {
    console.error('Supabase delete error:', error);
    return { message: `Failed to delete record: ${error.message}`, success: false };
  }

  revalidatePath('/inventory');
  revalidatePath('/dashboard');
  return { message: 'Successfully deleted feed stock.', success: true };
}

// Action to delete a feed allocation record
export async function deleteFeedAllocation(id: string): Promise<{ message: string; success: boolean; }> {
    const userProfile = await getCurrentUserProfile();
    if (userProfile?.profile?.role !== 'Manager') return { message: 'Permission denied.', success: false };

    const supabase = createClient();
    const { error } = await supabase.from('feed_allocations').delete().match({ id });

    if (error) {
        console.error('Supabase delete error:', error);
        return { message: `Failed to delete allocation: ${error.message}`, success: false };
    }

    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    return { message: 'Successfully deleted allocation.', success: true };
}


export async function recordFeedUsage(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile?.user || !userProfile?.profile) return { message: 'Authentication error.', success: false };

    let shed = formData.get('shed') as string;
    if (userProfile.profile.role === 'Worker' && userProfile.profile.assigned_shed) {
        shed = userProfile.profile.assigned_shed;
    }

    const validatedFields = recordFeedUsageSchema.safeParse({
        shed: shed,
        feedType: formData.get('feedType'),
        quantityUsed: formData.get('quantityUsed'),
        unit: formData.get('unit'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid form data.',
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
        };
    }

    const { feedType, quantityUsed, unit } = validatedFields.data;
    const recorded_by = userProfile.profile.full_name ?? userProfile.user.email ?? 'System';
    const date = format(new Date(), 'yyyy-MM-dd');
    
    const supabase = createClient();
    const { error } = await supabase.from('feed_usage').insert({
        date,
        shed: validatedFields.data.shed,
        feed_type: feedType,
        quantity_used: quantityUsed,
        unit,
        recorded_by,
        user_id: userProfile.user.id,
    });

    if (error) {
        console.error('Supabase error:', error);
        return { message: `Failed to record usage: ${error.message}`, success: false };
    }

    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    return { message: 'Successfully recorded feed usage.', success: true };
}

export async function reportIssue(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile?.user || !userProfile?.profile) return { message: 'Authentication error.', success: false };

    const validatedFields = reportIssueSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: 'Invalid form data.',
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
        };
    }

    const { category, description } = validatedFields.data;
    const reported_by = userProfile.profile.full_name ?? userProfile.user.email ?? 'System';

    const supabase = createClient();
    const { error } = await supabase.from('issues').insert({
        category,
        description,
        reported_by,
        user_id: userProfile.user.id,
    });

    if (error) {
        console.error('Supabase error:', error);
        return { message: `Failed to report issue: ${error.message}`, success: false };
    }
    
    revalidatePath('/inventory');
    return { message: 'Successfully reported issue.', success: true };
}
