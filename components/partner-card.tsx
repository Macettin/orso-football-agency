import {ExternalLink, Handshake} from 'lucide-react';
import type {Partner} from '@/lib/partners';

export function PartnerCard({partner}: {partner: Partner}) {
  const content = (
    <article className="group flex h-full min-h-52 flex-col items-center justify-center border border-line bg-panel p-6 text-center transition hover:border-accent/60 hover:shadow-blue-soft">
      {partner.logo_url ? (
        <div
          className="h-24 w-full bg-contain bg-center bg-no-repeat"
          style={{backgroundImage: `url("${partner.logo_url}")`}}
          role="img"
          aria-label={`${partner.name} logo`}
        />
      ) : (
        <Handshake className="h-12 w-12 text-blue-400/70" strokeWidth={1.3} />
      )}
      <h3 className="mt-5 font-display text-xl font-semibold text-white">{partner.name}</h3>
      {partner.description ? <p className="mt-3 text-sm leading-6 text-mist">{partner.description}</p> : null}
      {partner.website_url ? <ExternalLink className="mt-4 h-4 w-4 text-blue-400" /> : null}
    </article>
  );

  return partner.website_url ? (
    <a href={partner.website_url} target="_blank" rel="noreferrer" className="block h-full">
      {content}
    </a>
  ) : content;
}
