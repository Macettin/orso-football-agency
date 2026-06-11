import type {SupabaseClient} from '@supabase/supabase-js';

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function uploadPublicImage(
  supabase: SupabaseClient,
  bucket: string,
  folder: string,
  file: FormDataEntryValue | null
) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!file.type.startsWith('image/')) throw new Error('Only image files are allowed.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Images must be smaller than 10 MB.');

  const path = `${folder}/${crypto.randomUUID()}-${safeFileName(file.name) || 'image'}`;
  const {error} = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false
  });
  if (error) throw error;

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
