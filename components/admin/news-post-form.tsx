'use client';

import {useMemo, useState} from 'react';
import {Calendar, ImagePlus, Newspaper} from 'lucide-react';
import {AdminSubmitButton} from '@/components/admin/submit-button';

export type NewsFormPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  published_at: string;
  is_published: boolean;
};

type Props = {
  action: (data: FormData) => Promise<void>;
  label: string;
  post?: NewsFormPost;
};

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function NewsPostForm({action, label, post}: Props) {
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [publishedAt, setPublishedAt] = useState(post?.published_at?.slice(0, 16) ?? '');
  const [published, setPublished] = useState(post?.is_published ?? true);
  const [previewImage, setPreviewImage] = useState(post?.image_url ?? '');
  const previewSlug = useMemo(() => slug || slugify(title), [slug, title]);

  function selectImage(file?: File) {
    if (previewImage.startsWith('blob:')) URL.revokeObjectURL(previewImage);
    setPreviewImage(file ? URL.createObjectURL(file) : (post?.image_url ?? ''));
  }

  return (
    <form action={action} className="grid gap-6 border-t border-line p-5 xl:grid-cols-[1fr_360px]">
      <div className="grid gap-4 sm:grid-cols-2">
        {post ? <input type="hidden" name="id" value={post.id} /> : null}
        <input type="hidden" name="current_image_url" value={post?.image_url ?? ''} />
        <Field label="Title" name="title" value={title} onChange={setTitle} required />
        <Field
          label="Slug"
          name="slug"
          value={slug}
          onChange={setSlug}
          placeholder={previewSlug || 'Auto-generated from title'}
        />
        <Field
          label="Published at"
          name="published_at"
          type="datetime-local"
          value={publishedAt}
          onChange={setPublishedAt}
        />
        <label>
          <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-slate-400">
            <ImagePlus className="h-4 w-4" /> News image
          </span>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={(event) => selectImage(event.target.files?.[0])}
            className="block h-12 w-full border border-line bg-ink px-3 py-2 text-sm text-slate-300"
          />
        </label>
        <Area label="Excerpt" name="excerpt" value={excerpt} onChange={setExcerpt} />
        <Area label="Content" name="content" value={content} onChange={setContent} rows={8} />
        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            name="is_published"
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
          Published
        </label>
        <div className="sm:text-end">
          <AdminSubmitButton label={label} />
        </div>
      </div>

      <aside>
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Live preview</div>
        <article className="overflow-hidden border border-line bg-panel shadow-blue-soft">
          <div
            className="flex aspect-[16/10] items-center justify-center bg-[#0B1E36] bg-cover bg-center"
            style={previewImage ? {backgroundImage: `url("${previewImage}")`} : undefined}
          >
            {!previewImage ? <Newspaper className="h-12 w-12 text-blue-400" /> : null}
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-xs text-mist">
                <Calendar className="h-4 w-4 text-blue-400" />
                {publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Publication date'}
              </span>
              <span className="bg-blue-950/70 px-2 py-1 text-[10px] font-bold uppercase text-blue-300">
                {published ? 'Published' : 'Draft'}
              </span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">{title || 'News title'}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-mist">{excerpt || 'A short article summary will appear here.'}</p>
            <p className="mt-4 truncate text-xs text-blue-400">/news/{previewSlug || 'article-slug'}</p>
          </div>
        </article>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required,
  placeholder
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-slate-400">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="h-12 w-full border border-line bg-ink px-3 text-sm text-white outline-none focus:border-accent"
      />
    </label>
  );
}

function Area({
  label,
  name,
  value,
  onChange,
  rows = 4
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="sm:col-span-2">
      <span className="mb-2 block text-xs font-bold uppercase text-slate-400">{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        rows={rows}
        className="w-full border border-line bg-ink px-3 py-3 text-sm text-white outline-none focus:border-accent"
      />
    </label>
  );
}
