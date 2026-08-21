'use server'

import { createClient } from '@/lib/supabase/server'
import { driveSchema, Drive } from '@/lib/schema'
import { revalidatePath } from 'next/cache'

export async function createDrive(data: Drive) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const parsedData = driveSchema.parse(data)
  
  // Format dates appropriately if they are empty strings
  const formattedData = {
    ...parsedData,
    user_id: user.id,
    mail_received_date: parsedData.mail_received_date || null,
    registration_deadline: parsedData.registration_deadline || null,
    scheduled_date: parsedData.scheduled_date || null,
    internship_duration: parsedData.employment_type === 'Internship' ? (parsedData.internship_duration || null) : null,
    internship_stipend: parsedData.employment_type === 'Internship' ? (parsedData.internship_stipend || null) : null,
    post_internship_package: parsedData.employment_type === 'Internship' ? (parsedData.post_internship_package || null) : null,
  }

  const { error } = await supabase
    .from('drives')
    .insert([formattedData])

  if (error) {
    console.error('Error creating drive:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function updateDrive(id: string, data: Drive) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const parsedData = driveSchema.parse(data)

  // First fetch the old drive to check if scheduled_date changed
  const { data: oldDrive, error: fetchError } = await supabase
    .from('drives')
    .select('scheduled_date, user_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError) {
    console.error('Error fetching drive before update:', fetchError)
    throw new Error(fetchError.message)
  }

  const { id: _, ...updateFields } = parsedData;
  const formattedData = {
    ...updateFields,
    user_id: user.id, // Explicitly include user_id for RLS policies with WITH CHECK
    mail_received_date: parsedData.mail_received_date || null,
    registration_deadline: parsedData.registration_deadline || null,
    scheduled_date: parsedData.scheduled_date || null,
    internship_duration: parsedData.employment_type === 'Internship' ? (parsedData.internship_duration || null) : null,
    internship_stipend: parsedData.employment_type === 'Internship' ? (parsedData.internship_stipend || null) : null,
    post_internship_package: parsedData.employment_type === 'Internship' ? (parsedData.post_internship_package || null) : null,
  }

  // Update drive
  const { data: updatedDrive, error: updateError } = await supabase
    .from('drives')
    .update(formattedData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (updateError) {
    console.error('Error updating drive:', updateError)
    throw new Error(updateError.message)
  }

  // If scheduled_date changed, create a reschedule log
  if (oldDrive.scheduled_date !== formattedData.scheduled_date && formattedData.scheduled_date) {
    const { error: logError } = await supabase.from('reschedule_logs').insert([
      {
        drive_id: id,
        old_date: oldDrive.scheduled_date,
        new_date: formattedData.scheduled_date,
      }
    ])
    
    if (logError) {
      console.error('Error creating reschedule log:', logError)
      throw new Error(logError.message)
    }
    
    // Set status to Rescheduled if it's currently Upcoming
    if (parsedData.status === 'Upcoming') {
       await supabase.from('drives').update({ status: 'Rescheduled' }).eq('id', id).eq('user_id', user.id)
    }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/drive/${id}`)
}

export async function deleteDrive(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('drives')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
