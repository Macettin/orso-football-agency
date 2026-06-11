import {unstable_noStore as noStore} from 'next/cache';
import {createClient} from '@/src/lib/supabase/server';
import {isSupabaseConfigured} from '@/src/lib/supabase/config';

export type StaffMember = {
  id: string;
  name: string;
  slug: string;
  role: string;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  display_order: number;
  is_published: boolean;
};

const fallbackStaff: StaffMember[] = [
  {
    id: 'fallback-eren-yildirim',
    name: 'Eren YILDIRIM',
    slug: 'eren-yildirim',
    role: 'FIFA Licensed Football Agent',
    email: 'info@orsofootball.com',
    phone: null,
    photo_url: null,
    linkedin_url: null,
    instagram_url: null,
    display_order: 1,
    is_published: true
  }
];

export async function getPublishedStaff() {
  noStore();
  if (!isSupabaseConfigured()) return fallbackStaff;

  try {
    const supabase = await createClient();
    const {data, error} = await supabase
      .from('staff_members')
      .select('id,name,slug,role,email,phone,photo_url,linkedin_url,instagram_url,display_order,is_published')
      .eq('is_published', true)
      .order('display_order', {ascending: true})
      .order('name', {ascending: true})
      .abortSignal(AbortSignal.timeout(4000));

    if (error || !data?.length) return fallbackStaff;
    return data as StaffMember[];
  } catch {
    return fallbackStaff;
  }
}
