import { Button } from '@/components/ui/button';

export default function ProfileHeader({ profile, isOwn, onFollow }) {
  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600">
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160'}
              className="w-full h-full rounded-full object-cover border-2 border-background"
              alt=""
            />
          </div>
          {profile?.is_premium && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-400 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full">PRO</span>
          )}
        </div>
        <div className="flex-1 flex justify-around text-center">
          <div><p className="font-bold">{profile?.posts_count || 0}</p><p className="text-xs text-muted-foreground">Posts</p></div>
          <div><p className="font-bold">{profile?.followers_count || 0}</p><p className="text-xs text-muted-foreground">Followers</p></div>
          <div><p className="font-bold">{profile?.following_count || 0}</p><p className="text-xs text-muted-foreground">Following</p></div>
        </div>
      </div>
      <div className="mt-3">
        <p className="font-semibold text-sm">{profile?.display_name}</p>
        <p className="text-xs text-muted-foreground">@{profile?.username}</p>
        {profile?.bio && <p className="text-sm mt-1 leading-relaxed">{profile.bio}</p>}
      </div>
      {!isOwn && (
        <Button onClick={onFollow} className="w-full mt-3 rounded-lg" size="sm">Follow</Button>
      )}
    </div>
  );
}