import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LivingTagBadge from '../components/LivingTagBadge';

export default function Contacts() {
  const [search, setSearch] = useState('');

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

  const filtered = profiles.filter(p =>
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

      <Link to="/chat/ai" className="flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors">
        <img src="https://media.base44.com/images/public/6a1c530c59bb7bc9748ddeb4/11b6c5f41_generated_image.png" className="w-12 h-12 rounded-full object-cover" alt="AI" />
        <div className="flex-1">
          <p className="font-semibold text-sm">AI Assistant</p>
          <p className="text-xs text-muted-foreground">Ask me anything</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

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
                return (
                  <Link key={profile.id} to={`/user/${profile.username}`}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                    <img src={profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                         className="w-11 h-11 rounded-full object-cover shrink-0 mt-0.5" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-medium text-sm">{profile.display_name}</p>
                        {profile.is_premium && (
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">PRO</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1.5">@{profile.username}</p>
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