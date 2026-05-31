import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plus, Mic, MessageSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CreateRoomDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('talking');
  const queryClient = useQueryClient();

  const createRoom = useMutation({
    mutationFn: (data) => base44.entities.LiveRoom.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-rooms'] });
      setOpen(false);
      setName('');
      setDescription('');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full gap-1.5"><Plus className="h-4 w-4" /> Start Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Start a Live Room</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Room name" value={name} onChange={e => setName(e.target.value)} />
          <Textarea placeholder="What's this room about?" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
          <RadioGroup value={type} onValueChange={setType} className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="talking" id="talking" />
              <Label htmlFor="talking" className="flex items-center gap-1"><Mic className="h-4 w-4" /> Voice</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="texting" id="texting" />
              <Label htmlFor="texting" className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> Text</Label>
            </div>
          </RadioGroup>
          <Button onClick={() => createRoom.mutate({ name, description, type, is_active: true, participants_count: 1 })}
                  disabled={!name.trim() || createRoom.isPending} className="w-full">
            {createRoom.isPending ? 'Creating...' : 'Go Live'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}