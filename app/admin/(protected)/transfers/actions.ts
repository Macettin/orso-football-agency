'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireAdmin} from '@/src/lib/supabase/admin';
import {uploadPublicImage} from '@/src/lib/supabase/media';

const text=(data:FormData,key:string)=>String(data.get(key)??'').trim();
const optional=(data:FormData,key:string)=>text(data,key)||null;
const resultUrl=(result:string)=>`/admin/transfers?result=${encodeURIComponent(result)}`;
function values(data:FormData,photo:string|null,image:string|null){return {player_name:text(data,'player_name'),player_photo_url:photo,from_club:text(data,'from_club'),to_club:text(data,'to_club'),country:text(data,'country'),season:text(data,'season'),transfer_type:text(data,'transfer_type'),announcement_url:optional(data,'announcement_url'),image_url:image,display_order:Math.max(0,Number(text(data,'display_order'))||0),is_top_deal:data.get('is_top_deal')==='on',is_published:data.get('is_published')==='on'}}
function refresh(){revalidatePath('/admin/transfers');for(const locale of ['en','tr','ru','ar']){revalidatePath(`/${locale}`);revalidatePath(`/${locale}/transfers`);revalidatePath(`/${locale}/top-deals`)}}
export async function createTransfer(data:FormData){const{supabase}=await requireAdmin();try{const photo=await uploadPublicImage(supabase,'transfers','players',data.get('player_photo'));const image=await uploadPublicImage(supabase,'transfers','deals',data.get('image'));const row=values(data,photo,image);if(!row.player_name||!row.from_club||!row.to_club||!row.season)throw new Error('Player, clubs and season are required.');const{error}=await supabase.from('transfers').insert(row);if(error)throw error;refresh()}catch(error){redirect(resultUrl(error instanceof Error?error.message:'Unable to create transfer.'))}redirect(resultUrl('created'))}
export async function updateTransfer(data:FormData){const{supabase}=await requireAdmin();const id=text(data,'id');try{const photo=await uploadPublicImage(supabase,'transfers','players',data.get('player_photo'));const image=await uploadPublicImage(supabase,'transfers','deals',data.get('image'));const row=values(data,photo??optional(data,'current_player_photo_url'),image??optional(data,'current_image_url'));if(!id||!row.player_name||!row.from_club||!row.to_club||!row.season)throw new Error('Player, clubs and season are required.');const{error}=await supabase.from('transfers').update(row).eq('id',id);if(error)throw error;refresh()}catch(error){redirect(resultUrl(error instanceof Error?error.message:'Unable to update transfer.'))}redirect(resultUrl('updated'))}
export async function deleteTransfer(data:FormData){const{supabase}=await requireAdmin();const{error}=await supabase.from('transfers').delete().eq('id',text(data,'id'));if(error)redirect(resultUrl(error.message));refresh();redirect(resultUrl('deleted'))}
