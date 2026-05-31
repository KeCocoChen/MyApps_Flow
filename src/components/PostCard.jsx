import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes_count || 0);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div className="border-b border-border">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link to={`/user/${post.author_username}`}>
          <img src={post.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
               className="w-8 h-8 rounded-full object-cover" alt="" />
        </Link>
        <Link to={`/user/${post.author_username}`} className="font-semibold text-sm hover:opacity-70 transition-opacity">
          {post.author_username || post.author_name}
        </Link>
      </div>
      {post.image_url && (
        <img src={post.image_url} className="w-full aspect-square object-cover" alt="" />
      )}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className="transition-transform active:scale-125">
              <Heart className={`h-6 w-6 transition-colors ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <MessageCircle className="h-6 w-6 cursor-pointer" />
            <Send className="h-6 w-6 cursor-pointer" />
          </div>
          <Bookmark className="h-6 w-6 cursor-pointer" />
        </div>
        <p className="font-semibold text-sm">{likes.toLocaleString()} likes</p>
        <p className="text-sm">
          <span className="font-semibold">{post.author_username || post.author_name}</span>{' '}
          {post.content}
        </p>
      </div>
    </div>
  );
}