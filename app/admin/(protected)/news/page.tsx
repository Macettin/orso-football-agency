import Image from 'next/image';
import {Newspaper, Pencil, Plus, Trash2} from 'lucide-react';
import {NewsPostForm, type NewsFormPost} from '@/components/admin/news-post-form';
import {requireAdmin} from '@/src/lib/supabase/admin';
import {createNewsPost, deleteNewsPost, updateNewsPost} from './actions';

type Row = NewsFormPost;

export default async function AdminNewsPage({searchParams}:{searchParams:Promise<{result?:string}>}) {
  const query=await searchParams; const {supabase}=await requireAdmin();
  const {data,error}=await supabase.from('news_posts').select('*').order('published_at',{ascending:false});
  const posts=(data??[]) as Row[];
  return <><Header/><Message result={query.result??error?.message}/>
    <details className="mt-10 border border-accent/40 bg-panel" open={!posts.length}><summary className="flex cursor-pointer items-center gap-3 p-5 font-display text-xl font-semibold text-white"><Plus className="h-5 w-5 text-blue-400"/> Add news post</summary><NewsPostForm action={createNewsPost} label="Create news post"/></details>
    <section className="mt-10"><div className="flex justify-between"><h2 className="font-display text-2xl font-semibold text-white">News posts</h2><span className="text-sm text-slate-500">{posts.length} records</span></div>
    <div className="mt-5 grid gap-5 lg:grid-cols-2">{posts.map(post=><article key={post.id} className="overflow-hidden border border-line bg-panel">
      <div className="grid grid-cols-[150px_1fr]">{post.image_url?<div className="relative min-h-40"><Image src={post.image_url} alt={post.title} fill className="object-cover"/></div>:<div className="flex min-h-40 items-center justify-center bg-blue-950/30"><Newspaper className="h-10 w-10 text-blue-400"/></div>}<div className="p-5"><Badge>{post.is_published?'Published':'Draft'}</Badge><h3 className="mt-4 font-display text-2xl font-semibold text-white">{post.title}</h3><p className="mt-2 line-clamp-2 text-sm text-mist">{post.excerpt}</p></div></div>
      <details className="border-t border-line"><summary className="flex cursor-pointer items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider text-blue-300"><Pencil className="h-4 w-4"/> Edit post</summary><NewsPostForm action={updateNewsPost} label="Save changes" post={post}/><form action={deleteNewsPost} className="border-t border-line p-5"><input type="hidden" name="id" value={post.id}/><button className="inline-flex h-10 items-center gap-2 border border-red-500/50 px-4 text-xs font-bold uppercase text-red-300"><Trash2 className="h-4 w-4"/> Delete post</button></form></details>
    </article>)}</div></section></>;
}
function Header(){return <div className="max-w-3xl"><div className="eyebrow">Agency journal</div><h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">Manage news</h1><p className="mt-4 text-lg leading-8 text-mist">Publish agency announcements, stories and market updates.</p></div>}
function Badge({children}:{children:React.ReactNode}){return <span className="bg-blue-950/70 px-2 py-1 text-[10px] font-bold uppercase text-blue-300">{children}</span>}
function Message({result}:{result?:string}){if(!result)return null;const ok=['created','updated','deleted'].includes(result);return <p className={`mt-6 border-s-2 px-4 py-3 text-sm ${ok?'border-emerald-500 bg-emerald-500/10 text-emerald-200':'border-red-500 bg-red-500/10 text-red-200'}`}>{ok?`News post ${result} successfully.`:decodeURIComponent(result)}</p>}
