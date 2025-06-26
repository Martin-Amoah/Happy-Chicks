
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const formSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  shed: z.string().min(1, 'Shed is required'),
  total_eggs: z.coerce.number().int().min(0, 'Total eggs cannot be negative'),
  broken_eggs: z.coerce.number().int().min(0, 'Broken eggs cannot be negative'),
  collected_by: z.string().min(1, 'Collected by is required'),
});

export type FormState = {
  message: string;
  errors?: {
    date?: string[];
    shed?: string[];
    total_eggs?: string[];
    broken_eggs?: string[];
    collected_by?: string[];
  };
  success?: boolean;
};

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
    date: formData.get('collectionDate'),
    shed: formData.get('shed'),
    total_eggs: formData.get('totalEggs'),
    broken_eggs: formData.get('brokenEggs'),
    collected_by: formData.get('collectedBy'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  
  const { date, shed, total_eggs, broken_eggs, collected_by } = validatedFields.data;

  const { error } = await supabase.from('egg_collections').insert({
    date,
    shed,
    total_eggs,
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

  revalidatePath('/egg-production');

  return {
    message: 'Successfully saved egg collection record.',
    success: true,
  };
}
