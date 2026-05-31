import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Image } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CreatePostDialog() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const queryClient = useQueryClient();

  const createPost = useMutation({
    mutationFn: (data) => base44.entities.Post.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setOpen(false);
      setContent('');
      setImageUrl('');
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setImageUrl(file_url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="fixed bottom-20 right-4 h-12 w-12 rounded-full shadow-lg z-40 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0">
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New Post</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="What's on your mind?" value={content} onChange={e => setContent(e.target.value)} rows={3} />
          <label className="cursor-pointer flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Image className="h-5 w-5" /><span>Add photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          {imageUrl && <img src={imageUrl} className="w-full rounded-lg max-h-48 object-cover" alt="" />}
          <Button onClick={() => createPost.mutate({ content, image_url: imageUrl, likes_count: 0, comments_count: 0 })}
                  disabled={!content.trim() || createPost.isPending} className="w-full">
            {createPost.isPending ? 'Posting...' : 'Share'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}