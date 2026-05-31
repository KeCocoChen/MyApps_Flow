import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, ChevronRight, ChevronDown, Building2, CreditCard, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LivingTagBadge from '../components/LivingTagBadge';

export default function Contacts() {
  const [search, setSearch] = useState('');
  const [enterpriseExpanded, setEnterpriseExpanded] = useState(false);

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => base44.entities.Profile.list(),
  });

  const { data: allTags = [] } = useQuery({
    queryKey: ['living-tags'],
    queryFn: () => base44.entities.LivingTag.list(),
  });

  const tagsByUser = allTags.reduce((acc, t) => {
    if (!acc[t.profile_username]) acc[t.profile_username] = [];
    acc[t.profile_username].push(t);
    return acc;
  }, {});

  const sorted = [...profiles].sort((a, b) => {
    if (a.is_mutual_follow && !b.is_mutual_follow) return -1;
    if (!a.is_mutual_follow && b.is_mutual_follow) return 1;
    const aTime = a.last_contacted || a.updated_date || '';
    const bTime = b.last_contacted || b.updated_date || '';
    return bTime.localeCompare(aTime);
  });

  const personalProfiles = sorted.filter(p => p.account_type !== 'enterprise');
  const enterpriseProfiles = sorted.filter(p => p.account_type === 'enterprise');

  const filtered = personalProfiles.filter(p =>
    p.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.username?.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, p) => {
    const letter = (p.display_name || '?')[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(p);
    return acc;
  }, {});
  const sortedLetters = Object.keys(grouped).sort();

  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg z-10 px-4 pt-4 pb-2 border-b border-border">
        <h1 className="text-xl font-bold font-heading mb-3">Contacts</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)}
                 className="pl-9 bg-muted border-0 rounded-lg h-9" />
        </div>
      </div>

      {/* Enterprise group */}
      {enterpriseProfiles.length > 0 && (
        <div className="border-b border-border">
          <button
            onClick={() => setEnterpriseExpanded(!enterpriseExpanded)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-slate-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">Enterprise Contacts</p>
              <p className="text-xs text-muted-foreground">{enterpriseProfiles.length} organizations</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${enterpriseExpanded ? 'rotate-180' : ''}`} />
          </button>
          {enterpriseExpanded && enterpriseProfiles.map(profile => (
            <Link key={profile.id} to={`/user/${profile.username}`}
                  className="flex items-start gap-3 px-4 py-3 pl-8 hover:bg-muted/50 transition-colors border-t border-border/50">
              <img src={profile.avatar_url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80'}
                   className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{profile.display_name}</p>
                <p className="text-xs text-muted-foreground">@{profile.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* AI Contacts */}
      {[
        {
          id: 'flow', name: 'Flow', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80',
          tags: [
            { label: 'Pay to Upgrade', bg: 'bg-amber-50 text-amber-700 border-amber-200', Icon: CreditCard },
            { label: 'Donate', bg: 'bg-pink-50 text-pink-700 border-pink-200', Icon: Heart },
          ], to: '/chat/ai'
        },
        {
          id: 'chatgpt', name: 'ChatGPT', avatar: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=80',
          tags: [], to: '/chat/ai'
        },
        {
          id: 'meta', name: 'Meta AI', avatar: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=80',
          tags: [], to: '/chat/ai'
        },
        {
          id: 'claude', name: 'Claude', avatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=80',
          tags: [], to: '/chat/ai'
        },
      ].map(ai => (
        <Link key={ai.id} to={ai.to} className="flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors">
          <img src={ai.avatar} className="w-12 h-12 rounded-full object-cover" alt={ai.name} />
          <div className="flex-1">
            <p className="font-semibold text-sm">{ai.name}</p>
            {ai.tags.length > 0 && (
              <div className="flex gap-1.5 mt-1">
                {ai.tags.map(tag => (
                  <span key={tag.label} className={`inline-flex items-center gap-1 border text-[10px] font-semibold px-2 py-0.5 rounded-full ${tag.bg}`}>
                    <tag.Icon className="h-2.5 w-2.5" /> {tag.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      ))}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-muted border-t-foreground rounded-full animate-spin" />
        </div>
      ) : (
        <div>
          {sortedLetters.map(letter => (
            <div key={letter}>
              <div className="px-4 py-1.5 bg-muted/50">
                <span className="text-xs font-semibold text-muted-foreground">{letter}</span>
              </div>
              {grouped[letter].map(profile => {
                const userTags = (tagsByUser[profile.username] || []).slice(0, 3);
                const isMutual = profile.is_mutual_follow;
                return (
                  <Link key={profile.id} to={`/user/${profile.username}`}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition-colors ${isMutual ? 'bg-blue-50' : ''}`}>
                    <img src={profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                         className="w-11 h-11 rounded-full object-cover shrink-0 mt-0.5" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className={`text-sm ${isMutual ? 'font-bold' : 'font-medium'}`}>{profile.display_name}</p>
                        {profile.is_premium && (
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">PRO</span>
                        )}
                      </div>
                      {userTags.length > 0 && (
                        <div className="flex flex-wrap gap-1" onClick={e => e.preventDefault()}>
                          {userTags.map(tag => (
                            <LivingTagBadge key={tag.id} tag={tag} onClick={() => {}} />
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}