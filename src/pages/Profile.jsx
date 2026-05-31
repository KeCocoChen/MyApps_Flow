import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ProfileHeader from '../components/ProfileHeader';
import LivingTagBadge from '../components/LivingTagBadge';
import { History, Eye, EyeOff, MessageCircle, DoorOpen, UserPlus, Share2, Camera, Mail, Plus } from 'lucide-react';
import AvatarWalker from '../components/AvatarWalker';
import { useRef } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Profile() {
  const [historyVisible, setHistoryVisible] = useState(false);
  const [bgPhoto, setBgPhoto] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900');
  const fileInputRef = useRef(null);

  const handleBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setBgPhoto(file_url);
  };

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

  const storyTags = [
    {
      id: 'virtual_home',
      label: 'Home',
      preview: bgPhoto,
      type: 'image',
    },
    {
      id: 'music',
      label: 'Music',
      emoji: '🎵',
      sublabel: 'Blinding Lights',
    },
    {
      id: 'movie',
      label: 'Movie',
      emoji: '🎬',
      sublabel: 'Interstellar',
    },
    {
      id: 'custom',
      label: 'Gaming',
      emoji: '🎮',
      sublabel: 'Valorant',
    },
  ];

  const handleTagClick = (tag) => {
    if (tag.action_type === 'location_discover') toast.info(`Discovering people in ${tag.value || tag.label}`);
    else if (tag.action_type === 'schedule_meeting') toast.info('Opening scheduling...');
    else toast.info(`${tag.label}: ${tag.value || 'Tap to explore'}`);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header with transparent home background */}
      <div className="relative overflow-hidden">
        {/* Very transparent home bg */}
        <img
          src={bgPhoto}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
        />
        {/* Camera button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute top-3 right-3 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />

        {/* Walking avatar — no box, fully transparent bg */}
        <div className="relative h-28 overflow-hidden">
          <div style={{ animation: 'walkAcross 8s linear infinite', position: 'absolute', bottom: 0 }}>
            <AvatarWalker size={110} />
          </div>
        </div>

        {/* Profile info */}
        <div className="relative flex flex-col items-center pb-4 px-4">
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-lg">{myProfile?.display_name || 'My Name'}</p>
            <Mail className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          </div>
          {myProfile?.bio && <p className="text-xs text-muted-foreground text-center mt-0.5 max-w-xs">{myProfile.bio}</p>}
          <div className="flex gap-8 mt-3">
            <div className="text-center"><p className="font-bold text-sm">{myProfile?.posts_count || 0}</p><p className="text-[11px] text-muted-foreground">Posts</p></div>
            <div className="text-center"><p className="font-bold text-sm">{myProfile?.followers_count || 0}</p><p className="text-[11px] text-muted-foreground">Followers</p></div>
            <div className="text-center"><p className="font-bold text-sm">{myProfile?.following_count || 0}</p><p className="text-[11px] text-muted-foreground">Following</p></div>
          </div>
        </div>
      </div>

      {/* 4 Story-style tag pills */}
      <div className="flex gap-4 px-4 py-3 overflow-x-auto border-b border-border">
        {storyTags.map(tag => (
          <button key={tag.id} className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-purple-400 overflow-hidden flex items-center justify-center bg-muted">
              {tag.type === 'image' ? (
                <img src={tag.preview} className="w-full h-full object-cover" alt={tag.label} />
              ) : (
                <span className="text-2xl">{tag.emoji}</span>
              )}
            </div>
            <span className="text-[11px] font-medium text-foreground">{tag.label}</span>
            {tag.sublabel && <span className="text-[10px] text-muted-foreground -mt-0.5">{tag.sublabel}</span>}
          </button>
        ))}
        <button className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="text-[11px] text-muted-foreground">Add</span>
        </button>
      </div>

      {/* Posts grid (Instagram style) */}
      <div className="grid grid-cols-3 gap-0.5 mt-0.5">
        {myPosts.length === 0 ? (
          <div className="col-span-3 py-16 flex flex-col items-center text-muted-foreground gap-2">
            <p className="text-sm">No posts yet</p>
          </div>
        ) : myPosts.map(post => (
          <div key={post.id} className="aspect-square">
            <img
              src={post.image_url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300'}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
        ))}
      </div>

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
              const EventIcon = icons[ev.event_type] || MessageCircle;
              const label = ev.event_type === 'visited_home'
                ? `Visited ${ev.target_name}'s home`
                : ev.event_type === 'sent_message' ? `Sent a message to ${ev.target_name}`
                : ev.event_type === 'followed' ? `Followed ${ev.target_name}`
                : `Shared a post with ${ev.target_name}`;
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