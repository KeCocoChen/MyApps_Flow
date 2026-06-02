import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { History, Eye, EyeOff, List, MessageCircle, DoorOpen, UserPlus, Share2, Camera, Mail } from 'lucide-react';
import AvatarWalker from '../components/AvatarWalker';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

// Fallback placeholder images so the grid always looks full
const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=300',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300',
];

// 3 modes: 'actions' → 'detailed' → 'hidden'
const HISTORY_MODES = [
  { key: 'actions',   label: 'Actions only',    Icon: List   },
  { key: 'detailed',  label: 'Detailed',         Icon: Eye    },
  { key: 'hidden',    label: 'Hidden',           Icon: EyeOff },
];

const EVENT_ICONS = { sent_message: MessageCircle, visited_home: DoorOpen, followed: UserPlus, shared_post: Share2 };

function eventLabel(ev) {
  if (ev.event_type === 'visited_home') return `Visited ${ev.target_name}'s home`;
  if (ev.event_type === 'sent_message') return `Sent a message to ${ev.target_name}`;
  if (ev.event_type === 'followed') return `Followed ${ev.target_name}`;
  return `Shared a post with ${ev.target_name}`;
}

export default function Profile() {
  const [historyModeIdx, setHistoryModeIdx] = useState(0);
  const [bgPhoto, setBgPhoto] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900');
  const fileInputRef = useRef(null);

  const historyMode = HISTORY_MODES[historyModeIdx];

  const cycleHistoryMode = () => setHistoryModeIdx(i => (i + 1) % HISTORY_MODES.length);

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

  const myProfile = profiles[0];

  // Ensure at least 9 photos for the grid
  const rawPosts = posts.slice(0, 9);
  const gridPhotos = Array.from({ length: 9 }, (_, i) =>
    rawPosts[i]?.image_url || PLACEHOLDER_PHOTOS[i]
  );

  const storyTags = [
    { id: 'virtual_home', label: 'Home',   preview: bgPhoto, type: 'image' },
    { id: 'music',        label: 'Music',  emoji: '🎵', sublabel: 'Blinding Lights' },
    { id: 'movie',        label: 'Movie',  emoji: '🎬', sublabel: 'Interstellar' },
    { id: 'custom',       label: 'Gaming', emoji: '🎮', sublabel: 'Valorant' },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden">
        <img src={bgPhoto} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute top-3 right-3 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />

        <div className="relative h-28 overflow-hidden">
          <div style={{ animation: 'walkAcross 22s linear infinite', position: 'absolute', bottom: 0 }}>
            <AvatarWalker size={110} />
          </div>
        </div>

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

      {/* 2x2 story tag grid */}
      <div className="grid grid-cols-2 gap-1 px-1 py-1 border-b border-border">
        {storyTags.map(tag => (
          <button key={tag.id} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            {tag.type === 'image' ? (
              <img src={tag.preview} className="w-full h-full object-cover" alt={tag.label} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl">{tag.emoji}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <span className="text-white text-xs font-semibold drop-shadow">{tag.label}</span>
              {tag.sublabel && <p className="text-white/80 text-[10px] leading-tight">{tag.sublabel}</p>}
            </div>
          </button>
        ))}
      </div>

      {/* Contact History */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Contact History</span>
          </div>
          <button
            onClick={cycleHistoryMode}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-2.5 py-1"
          >
            <historyMode.Icon className="h-3 w-3" />
            {historyMode.label}
          </button>
        </div>

        {historyMode.key === 'hidden' ? (
          <p className="text-xs text-muted-foreground py-1">History is hidden from others.</p>
        ) : contactHistory.length === 0 ? (
          <p className="text-xs text-muted-foreground py-1">No contact history yet.</p>
        ) : (
          <div className="space-y-2">
            {contactHistory.map(ev => {
              const EventIcon = EVENT_ICONS[ev.event_type] || MessageCircle;
              return (
                <div key={ev.id} className="flex items-center gap-3 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <EventIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground">{eventLabel(ev)}</p>
                    {historyMode.key === 'detailed' && ev.note && (
                      <p className="text-[11px] text-muted-foreground mt-0.5 italic">"{ev.note}"</p>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {new Date(ev.event_date).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Posts grid — always 9 photos */}
      <div className="grid grid-cols-3 gap-0.5 mt-0.5">
        {gridPhotos.map((src, i) => (
          <div key={i} className="aspect-square">
            <img src={src} className="w-full h-full object-cover" alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}