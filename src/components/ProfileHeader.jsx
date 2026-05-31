import { Button } from '@/components/ui/button';
import Avatar3D from './Avatar3D';

export default function ProfileHeader({ profile, isOwn, onFollow }) {
  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex flex-col items-center mb-4">
        <div className="relative">
          <Avatar3D size={180} />
          {profile?.is_premium && (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full">PRO</span>
          )}
        </div>
        <div className="mt-2 text-center">
          <p className="font-semibold text-base">{profile?.display_name}</p>
          <p className="text-xs text-muted-foreground">@{profile?.username}</p>
          {profile?.bio && <p className="text-sm mt-1 leading-relaxed">{profile.bio}</p>}
        </div>
      </div>
      <div className="flex justify-around text-center border-t border-border pt-3">
        <div><p className="font-bold">{profile?.posts_count || 0}</p><p className="text-xs text-muted-foreground">Posts</p></div>
        <div><p className="font-bold">{profile?.followers_count || 0}</p><p className="text-xs text-muted-foreground">Followers</p></div>
        <div><p className="font-bold">{profile?.following_count || 0}</p><p className="text-xs text-muted-foreground">Following</p></div>
      </div>
      {!isOwn && (
        <Button onClick={onFollow} className="w-full mt-3 rounded-lg" size="sm">Follow</Button>
      )}
    </div>
  );
}