
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { format } from 'date-fns';

const formSchema = z.object({
  shed: z.string().min(1, 'Shed is required'),
  collection_time: z.string().min(1, 'Collection time is required'),
  total_eggs: z.coerce.number().int().min(0, 'Total eggs cannot be negative'),
  broken_eggs: z.coerce.number().int().min(0, 'Broken eggs cannot be negative'),
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
    collection_time?: string[];
    total_eggs?: string[];
    broken_eggs?: string[];
    collected_by?: string[];
  };
  success?: boolean;
};

async function getCurrentUserFullName() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'System';

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
    
    return profile?.full_name ?? user.email ?? 'System';
}

function calculateCratesAndPieces(totalEggs: number) {
    const crates = Math.floor(totalEggs / 30);
    const pieces = totalEggs % 30;
    return { crates, pieces };
}

export async function addEggCollection(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: 'Authentication error: User not found.',
      success: false,
    };
  }

  const validatedFields = formSchema.safeParse({
    shed: formData.get('shed'),
    collection_time: formData.get('collection_time'),
    total_eggs: formData.get('totalEggs'),
    broken_eggs: formData.get('brokenEggs'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  
  const { shed, collection_time, total_eggs, broken_eggs } = validatedFields.data;
  const collected_by = await getCurrentUserFullName();
  const { crates, pieces } = calculateCratesAndPieces(total_eggs);
  const date = format(new Date(), 'yyyy-MM-dd');


  const { error } = await supabase.from('egg_collections').insert({
    date,
    shed,
    collection_time,
    total_eggs,
    crates,
    pieces,
    broken_eggs,
    collected_by,
    user_id: user.id,
  });

  if (error) {
    console.error('Supabase error:', error);
    return {
      message: `Failed to save record: ${error.message}`,
      success: false,
    };
  }

  revalidatePath('/egg-collection');
  revalidatePath('/dashboard');

  return {
    message: 'Successfully saved egg collection record.',
    success: true,
  };
}

export async function updateEggCollection(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const supabase = createClient();

  const validatedFields = updateFormSchema.safeParse({
    id: formData.get('id'),
    shed: formData.get('shed'),
    collection_time: formData.get('collection_time'),
    total_eggs: formData.get('totalEggs'),
    broken_eggs: formData.get('brokenEggs'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  
  const { id, shed, collection_time, total_eggs, broken_eggs } = validatedFields.data;
  const collected_by = await getCurrentUserFullName();
  const { crates, pieces } = calculateCratesAndPieces(total_eggs);
  const date = format(new Date(), 'yyyy-MM-dd');

  const { error } = await supabase
    .from('egg_collections')
    .update({ date, shed, collection_time, total_eggs, crates, pieces, broken_eggs, collected_by })
    .match({ id });

  if (error) {
    console.error('Supabase update error:', error);
    return {
      message: `Failed to update record: ${error.message}`,
      success: false,
    };
  }

  revalidatePath('/egg-collection');
  revalidatePath('/dashboard');

  return {
    message: 'Successfully updated egg collection record.',
    success: true,
  };
}


export async function deleteEggCollection(id: string): Promise<{ message: string; success: boolean; }> {
  const supabase = createClient();
  const { error } = await supabase.from('egg_collections').delete().match({ id });

  if (error) {
    console.error('Supabase delete error:', error);
    return { message: `Failed to delete record: ${error.message}`, success: false };
  }

  revalidatePath('/egg-collection');
  revalidatePath('/dashboard');
  return { message: 'Successfully deleted egg collection record.', success: true };
}
