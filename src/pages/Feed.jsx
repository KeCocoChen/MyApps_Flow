import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PostCard from '../components/PostCard';
import CreatePostDialog from '../components/CreatePostDialog';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Feed() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list('-created_date'),
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => base44.entities.Profile.list(),
  });

  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg z-10 border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold italic tracking-tight">Socialite</h1>
        <Camera className="h-6 w-6" />
      </div>

      {profiles.length > 0 && (
        <div className="flex gap-3 px-4 py-3 overflow-x-auto border-b border-border">
          {profiles.slice(0, 12).map(p => (
            <Link key={p.id} to={`/user/${p.username}`} className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600">
                <img src={p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128'}
                     className="w-full h-full rounded-full object-cover border-2 border-background" alt="" />
              </div>
              <span className="text-[10px] text-muted-foreground truncate w-16 text-center">{p.username}</span>
            </Link>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-muted border-t-foreground rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <Camera className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold text-lg">Your feed is waiting</h3>
          <p className="text-sm text-muted-foreground mt-1">Share your first moment with the world</p>
        </div>
      ) : (
        <div>{posts.map(post => <PostCard key={post.id} post={post} />)}</div>
      )}

      <CreatePostDialog />
    </div>
  );
}