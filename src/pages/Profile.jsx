import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ProfileHeader from '../components/ProfileHeader';
import LivingTagBadge from '../components/LivingTagBadge';
import { Grid3X3, Tag, Home, History, Eye, EyeOff, MessageCircle, DoorOpen, UserPlus, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Profile() {
  const [tab, setTab] = useState('virtual_home');
  const [historyVisible, setHistoryVisible] = useState(false);

  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => base44.entities.Profile.list(),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list('-created_date'),
  });

  const { data: contactHistory = [] } = useQuery({
    queryKey: ['contact-history'],
    queryFn: () => base44.entities.ContactHistory.list('-event_date', 20),
  });

  const { data: allTags = [] } = useQuery({
    queryKey: ['living-tags'],
    queryFn: () => base44.entities.LivingTag.list(),
  });

  const myProfile = profiles[0];
  const myPosts = posts.slice(0, 9);
  const myTags = allTags.filter(t => t.profile_username === myProfile?.username);
  const customTags = myTags.filter(t => t.tag_type === 'custom');
  const officialTags = myTags.filter(t => t.tag_type === 'official');

  const handleTagClick = (tag) => {
    if (tag.action_type === 'location_discover') toast.info(`Discovering people in ${tag.value || tag.label}`);
    else if (tag.action_type === 'schedule_meeting') toast.info('Opening scheduling...');
    else toast.info(`${tag.label}: ${tag.value || 'Tap to explore'}`);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg z-10 border-b border-border px-4 py-3">
        <h1 className="text-lg font-bold font-heading text-center">{myProfile?.username || 'My Profile'}</h1>
      </div>

      <ProfileHeader profile={myProfile} isOwn />

      {myTags.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-2">
          {myTags.map(tag => <LivingTagBadge key={tag.id} tag={tag} onClick={handleTagClick} />)}
        </div>
      )}

      <div className="flex border-b border-border mt-2">
        <button onClick={() => setTab('virtual_home')}
                className={`flex-1 py-3 flex justify-center transition-colors ${tab === 'virtual_home' ? 'border-b-2 border-foreground' : 'text-muted-foreground'}`}>
          <Home className="h-5 w-5" />
        </button>
        <button onClick={() => setTab('posts')}
                className={`flex-1 py-3 flex justify-center transition-colors ${tab === 'posts' ? 'border-b-2 border-foreground' : 'text-muted-foreground'}`}>
          <Grid3X3 className="h-5 w-5" />
        </button>
        <button onClick={() => setTab('tags')}
                className={`flex-1 py-3 flex justify-center transition-colors ${tab === 'tags' ? 'border-b-2 border-foreground' : 'text-muted-foreground'}`}>
          <Tag className="h-5 w-5" />
        </button>
      </div>

      {tab === 'virtual_home' ? (
        <div className="p-4">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-purple-100 overflow-hidden">
            <div className="p-4 border-b border-purple-100">
              <h3 className="font-semibold text-sm text-purple-800">✨ {myProfile?.display_name || 'My'}'s Virtual Home</h3>
              <p className="text-xs text-purple-500 mt-0.5">Welcome to my personal space</p>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              {[{emoji:'🎨',label:'Art Studio'},{emoji:'🎵',label:'Music Room'},{emoji:'📚',label:'Library'},{emoji:'🌿',label:'Garden'}].map(r => (
                <div key={r.label} className="bg-white/70 rounded-xl p-3 flex flex-col items-center gap-1.5 border border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-xs font-medium text-gray-600">{r.label}</span>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <div className="bg-white/70 rounded-xl p-3 border border-white">
                <p className="text-xs font-medium text-gray-500 mb-1">🏡 Message Board</p>
                <p className="text-sm text-gray-700 italic">"{myProfile?.bio || 'Welcome, make yourself at home!'}"</p>
              </div>
            </div>
          </div>
        </div>
      ) : tab === 'posts' ? (
        <div className="grid grid-cols-3 gap-0.5">
          {myPosts.map(post => (
            <div key={post.id} className="aspect-square">
              <img src={post.image_url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300'}
                   className="w-full h-full object-cover" alt="" />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 space-y-5">
          <div>
            <h3 className="text-sm font-semibold mb-2">Custom Tags ({customTags.length}/{myProfile?.is_premium ? 5 : 3})</h3>
            <div className="flex flex-wrap gap-2">
              {customTags.length > 0 ? customTags.map(t => <LivingTagBadge key={t.id} tag={t} onClick={handleTagClick} />) :
                <p className="text-xs text-muted-foreground">No custom tags yet</p>}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Official Tags</h3>
            <div className="flex flex-wrap gap-2">
              {officialTags.length > 0 ? officialTags.map(t => <LivingTagBadge key={t.id} tag={t} onClick={handleTagClick} />) :
                <p className="text-xs text-muted-foreground">No official tags</p>}
            </div>
          </div>
        </div>
      )}
      {/* Contact History Section */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Contact History</span>
          </div>
          <button
            onClick={() => setHistoryVisible(!historyVisible)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-2.5 py-1">
            {historyVisible ? <><Eye className="h-3 w-3" /> Visible to others</> : <><EyeOff className="h-3 w-3" /> Hidden from others</>}
          </button>
        </div>
        {contactHistory.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2">No contact history yet.</p>
        ) : (
          <div className="space-y-2">
            {contactHistory.map(ev => {
              const icons = { sent_message: MessageCircle, visited_home: DoorOpen, followed: UserPlus, shared_post: Share2 };
              const labels = { sent_message: 'Sent a message to', visited_home: "Visited\'s home", followed: 'Followed', shared_post: 'Shared a post with' };
              const EventIcon = icons[ev.event_type] || MessageCircle;
              const label = ev.event_type === 'visited_home'
                ? `Visited ${ev.target_name}'s home`
                : `${labels[ev.event_type] || ev.event_type} ${ev.target_name}`;
              return (
                <div key={ev.id} className="flex items-center gap-3 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <EventIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground">{label}</p>
                    {ev.note && <p className="text-[11px] text-muted-foreground">{ev.note}</p>}
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">{new Date(ev.event_date).toLocaleDateString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}