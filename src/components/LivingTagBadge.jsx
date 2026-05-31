import { MapPin, Coffee, Briefcase, Gamepad2, Home, Music, BookOpen, Sparkles } from 'lucide-react';

const categoryConfig = {
  location: { icon: MapPin, colors: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
  hobby: { icon: Coffee, colors: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' },
  service: { icon: Briefcase, colors: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
  virtual_avatar: { icon: Gamepad2, colors: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100' },
  virtual_home: { icon: Home, colors: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  music: { icon: Music, colors: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  movie_reading: { icon: BookOpen, colors: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' },
};

export default function LivingTagBadge({ tag, onClick }) {
  const config = categoryConfig[tag.category] || { icon: Sparkles, colors: 'bg-muted text-foreground' };
  const Icon = config.icon;
  const isOfficial = tag.tag_type === 'official';

  return (
    <button
      onClick={() => onClick?.(tag)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer active:scale-95 ${config.colors} ${isOfficial ? 'ring-1 ring-offset-1 ring-amber-300' : ''}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{tag.label}</span>
      {isOfficial && <Sparkles className="h-3 w-3 text-amber-500" />}
    </button>
  );
}