import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';

export default function TikTokFeed({ posts }) {
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState({});
  const [likes, setLikes] = useState({});

  if (!posts.length) return null;
  const post = posts[current];

  const toggleLike = () => {
    const isLiked = liked[post.id];
    setLiked(prev => ({ ...prev, [post.id]: !isLiked }));
    setLikes(prev => ({ ...prev, [post.id]: (prev[post.id] ?? post.likes_count ?? 0) + (isLiked ? -1 : 1) }));
  };

  const likeCount = likes[post.id] ?? post.likes_count ?? 0;
  const isLiked = liked[post.id];

  return (
    <div className="relative w-full h-[calc(100vh-7rem)] bg-black overflow-hidden rounded-none select-none">
      {/* background image */}
      <img
        src={post.image_url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800'}
        className="absolute inset-0 w-full h-full object-cover"
        alt=""
      />
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      {/* top nav indicators */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1">
        {posts.map((_, i) => (
          <div key={i} className={`h-0.5 w-6 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/30'}`} />
        ))}
      </div>

      {/* right actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
        <img src={post.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
             className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="" />
        <button onClick={toggleLike} className="flex flex-col items-center gap-1">
          <Heart className={`h-7 w-7 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          <span className="text-white text-xs font-semibold">{likeCount.toLocaleString()}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <MessageCircle className="h-7 w-7 text-white" />
          <span className="text-white text-xs font-semibold">{post.comments_count || 0}</span>
        </button>
        <Send className="h-7 w-7 text-white" />
        <Bookmark className="h-7 w-7 text-white" />
        <VolumeX className="h-7 w-7 text-white" />
      </div>

      {/* bottom info */}
      <div className="absolute bottom-6 left-4 right-16 space-y-1.5">
        <p className="text-white font-bold text-sm">@{post.author_username || post.author_name}</p>
        <p className="text-white/90 text-sm leading-relaxed line-clamp-3">{post.content}</p>
      </div>

      {/* prev/next tap zones */}
      <button onClick={() => setCurrent(Math.max(0, current - 1))}
              className="absolute left-0 top-10 bottom-0 w-1/3 opacity-0" aria-label="previous" />
      <button onClick={() => setCurrent(Math.min(posts.length - 1, current + 1))}
              className="absolute right-0 top-10 bottom-0 w-1/3 opacity-0" aria-label="next" />

      {/* swipe hint arrows */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-40 pointer-events-none">
        {current > 0 && <ChevronUp className="h-5 w-5 text-white" />}
        {current < posts.length - 1 && <ChevronDown className="h-5 w-5 text-white" />}
      </div>
    </div>
  );
}