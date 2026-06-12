import {Instagram, Linkedin, Mail, Phone, UserRound} from 'lucide-react';
import type {StaffMember} from '@/lib/staff';

export function StaffCard({member}: {member: StaffMember}) {
  return (
    <article className="group overflow-hidden border border-line bg-panel transition hover:border-accent/60 hover:shadow-blue-soft">
      {member.photo_url ? (
        <div
          className="aspect-[4/5] bg-slate-900 bg-cover bg-center"
          style={{backgroundImage: `url("${member.photo_url}")`}}
          role="img"
          aria-label={member.name}
        />
      ) : (
        <div className="flex aspect-[4/5] items-center justify-center bg-[radial-gradient(circle_at_center,rgba(37,99,235,.24),transparent_58%),#0B1E36]">
          <UserRound className="h-20 w-20 text-blue-400/70" strokeWidth={1.2} />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-blue-400">{member.role}</div>
        <h3 className="mt-2 font-display text-2xl font-semibold text-white">{member.name}</h3>
        <div className="mt-5 flex flex-wrap gap-3 text-slate-400">
          {member.email ? <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className="hover:text-blue-300"><Mail className="h-4 w-4" /></a> : null}
          {member.phone ? <a href={`tel:${member.phone}`} aria-label={`Call ${member.name}`} className="hover:text-blue-300"><Phone className="h-4 w-4" /></a> : null}
          {member.linkedin_url ? <a href={member.linkedin_url} target="_blank" rel="noreferrer" aria-label={`${member.name} LinkedIn`} className="hover:text-blue-300"><Linkedin className="h-4 w-4" /></a> : null}
          {member.instagram_url ? <a href={member.instagram_url} target="_blank" rel="noreferrer" aria-label={`${member.name} Instagram`} className="hover:text-blue-300"><Instagram className="h-4 w-4" /></a> : null}
        </div>
      </div>
    </article>
  );
}
