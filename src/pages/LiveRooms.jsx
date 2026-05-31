import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CreateRoomDialog from '../components/CreateRoomDialog';
import { Mic, MessageSquare, Users, Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LiveRooms() {
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['live-rooms'],
    queryFn: () => base44.entities.LiveRoom.list('-created_date'),
  });

  const activeRooms = rooms.filter(r => r.is_active);

  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg z-10 border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold font-heading">Live</h1>
        <CreateRoomDialog />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-muted border-t-foreground rounded-full animate-spin" />
        </div>
      ) : activeRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <Radio className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold text-lg">No rooms live right now</h3>
          <p className="text-sm text-muted-foreground mt-1">Start one and bring people together</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {activeRooms.map(room => (
            <div key={room.id} className="relative bg-card border border-border rounded-2xl p-4 space-y-3 hover:shadow-sm transition-shadow overflow-hidden">
              {(room.cover_image || room.host_avatar) && (
                <img
                  src={room.cover_image || room.host_avatar}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
                />
              )}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{room.name}</h3>
                  {room.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{room.description}</p>}
                </div>
                <Badge variant="secondary" className="gap-1 shrink-0 ml-2">
                  {room.type === 'talking' ? <Mic className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                  {room.type === 'talking' ? 'Voice' : 'Text'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={room.host_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40'}
                       className="w-6 h-6 rounded-full object-cover" alt="" />
                  <span className="text-xs text-muted-foreground">{room.host_name || 'Host'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{room.participants_count || 0}</span>
                  </div>
                  <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> LIVE
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}