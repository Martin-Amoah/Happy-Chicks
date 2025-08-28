
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { format } from 'date-fns';

const formSchema = z.object({
  shed: z.string().min(1, 'Shed is required'),
  count: z.coerce.number().int().min(1, 'Count must be at least 1'),
  cause: z.string().optional(),
});

const updateFormSchema = formSchema.extend({
  id: z.string().uuid("Invalid record ID"),
});


export type FormState = {
  message: string;
  errors?: {
    id?: string[];
    date?: string[];
    shed?: string[];
    count?: string[];
    recorded_by?: string[];
    cause?: string[];
  };
  success?: boolean;
};

async function getCurrentUserProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role, assigned_shed')
        .eq('id', user.id)
        .single();
    
    return profile;
}

export async function addMortalityRecord(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Authentication error: User not found.', success: false };
  }

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return { message: 'Authentication error: Profile not found.', success: false };
  }

  const validatedFields = formSchema.safeParse({
    shed: formData.get('shed'),
    count: formData.get('count'),
    cause: formData.get('cause'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  
  let { shed, count, cause } = validatedFields.data;

  // Server-side enforcement for worker's assigned shed
  if (profile.role === 'Worker') {
      if (!profile.assigned_shed) {
          return { message: "Action denied. You have not been assigned to a shed.", success: false };
      }
      shed = profile.assigned_shed;
  }

  const recorded_by = profile.full_name ?? user.email ?? 'System';
  const date = format(new Date(), 'yyyy-MM-dd');

  const { error } = await supabase.from('mortality_records').insert({
    date,
    shed,
    count,
    cause,
    recorded_by,
    user_id: user.id,
  });

  if (error) {
    console.error('Supabase error:', error);
    return {
      message: `Failed to save record: ${error.message}`,
      success: false,
    };
  }

  revalidatePath('/dead-birds');
  revalidatePath('/dashboard');

  return {
    message: 'Successfully logged mortality record.',
    success: true,
  };
}


export async function updateMortalityRecord(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Authentication error: User not found.', success: false };
  }

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return { message: 'Authentication error: Profile not found.', success: false };
  }

  const validatedFields = updateFormSchema.safeParse({
    id: formData.get('id'),
    shed: formData.get('shed'),
    count: formData.get('count'),
    cause: formData.get('cause'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  
  let { id, shed, count, cause } = validatedFields.data;
  
  // Server-side enforcement for worker's assigned shed
  if (profile.role === 'Worker') {
      if (!profile.assigned_shed) {
          return { message: "Action denied. You have not been assigned to a shed.", success: false };
      }
      shed = profile.assigned_shed;
  }

  const recorded_by = profile.full_name ?? user.email ?? 'System';
  const date = format(new Date(), 'yyyy-MM-dd');

  const { error } = await supabase
    .from('mortality_records')
    .update({ date, shed, count, cause, recorded_by })
    .match({ id });

  if (error) {
    console.error('Supabase update error:', error);
    return {
      message: `Failed to update record: ${error.message}`,
      success: false,
    };
  }

  revalidatePath('/dead-birds');
  revalidatePath('/dashboard');

  return {
    message: 'Successfully updated mortality record.',
    success: true,
  };
}


export async function deleteMortalityRecord(id: string): Promise<{ message: string; success: boolean; }> {
  const supabase = createClient();
  const { error } = await supabase.from('mortality_records').delete().match({ id });

  if (error) {
    console.error('Supabase delete error:', error);
    return { message: `Failed to delete record: ${error.message}`, success: false };
  }

  revalidatePath('/dead-birds');
  revalidatePath('/dashboard');
  return { message: 'Successfully deleted mortality record.', success: true };
}
