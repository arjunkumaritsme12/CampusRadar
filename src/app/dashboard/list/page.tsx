import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DrivesListClient } from '@/components/DrivesListClient'
import { Drive } from '@/lib/schema'

export default async function ListPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: drives } = await supabase
    .from('drives').select('*').eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <DrivesListClient drives={(drives || []) as Drive[]} />
}
