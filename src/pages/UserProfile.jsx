import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ProfileHeader from '../components/ProfileHeader';
import LivingTagBadge from '../components/LivingTagBadge';
import { Grid3X3, Tag, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function UserProfile() {
  const { username } = useParams();
  const [tab, setTab] = useState('posts');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const results = await base44.entities.Profile.filter({ username });
      return results[0];
    },
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['living-tags', username],
    queryFn: () => base44.entities.LivingTag.filter({ profile_username: username }),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['user-posts', username],
    queryFn: () => base44.entities.Post.filter({ author_username: username }, '-created_date'),
  });

  const handleTagClick = (tag) => {
    if (tag.action_type === 'location_discover') toast.info(`Discovering people in ${tag.value || tag.label}`);
    else if (tag.action_type === 'schedule_meeting') toast.info('Scheduling feature coming soon');
    else if (tag.action_type === 'upload_resume') toast.info('Resume upload coming soon');
    else toast.info(tag.label);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="w-6 h-6 border-2 border-muted border-t-foreground rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="bg-background min-h-screen pb-4">
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg z-10 border-b border-border px-4 py-3 flex items-center gap-3">
        <Link to="/contacts"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-bold font-heading">{profile?.username}</h1>
      </div>

      <ProfileHeader profile={profile} isOwn={false} onFollow={() => toast.success('Followed!')} />

      {tags.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-2">
          {tags.map(tag => <LivingTagBadge key={tag.id} tag={tag} onClick={handleTagClick} />)}
        </div>
      )}

      <div className="flex border-b border-border mt-2">
        <button onClick={() => setTab('posts')}
                className={`flex-1 py-3 flex justify-center transition-colors ${tab === 'posts' ? 'border-b-2 border-foreground' : 'text-muted-foreground'}`}>
          <Grid3X3 className="h-5 w-5" />
        </button>
        <button onClick={() => setTab('tags')}
                className={`flex-1 py-3 flex justify-center transition-colors ${tab === 'tags' ? 'border-b-2 border-foreground' : 'text-muted-foreground'}`}>
          <Tag className="h-5 w-5" />
        </button>
      </div>

      {tab === 'posts' ? (
        <div className="grid grid-cols-3 gap-0.5">
          {posts.map(post => (
            <div key={post.id} className="aspect-square">
              <img src={post.image_url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300'}
                   className="w-full h-full object-cover" alt="" />
            </div>
          ))}
          {posts.length === 0 && <p className="col-span-3 text-center text-sm text-muted-foreground py-12">No posts yet</p>}
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => <LivingTagBadge key={tag.id} tag={tag} onClick={handleTagClick} />)}
            </div>
          ) : <p className="text-sm text-muted-foreground text-center py-8">No living tags</p>}
        </div>
      )}
    </div>
  );
}