import { useState } from 'react';
import { ArrowLeft, Send, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function ChatAI() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI assistant. Ask me anything — from finding people nearby to discovering new interests." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a helpful social app AI assistant called Socialite AI. Be friendly, concise and helpful. The user says: "${userMsg}"`
    });

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg z-10 border-b border-border px-4 py-3 flex items-center gap-3">
        <Link to="/contacts"><ArrowLeft className="h-5 w-5" /></Link>
        <img src="https://media.base44.com/images/public/6a1c530c59bb7bc9748ddeb4/11b6c5f41_generated_image.png"
             className="w-8 h-8 rounded-full object-cover" alt="AI" />
        <div>
          <h1 className="font-semibold text-sm">AI Assistant</h1>
          <p className="text-[10px] text-muted-foreground">Always online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <img src="https://media.base44.com/images/public/6a1c530c59bb7bc9748ddeb4/11b6c5f41_generated_image.png"
                   className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" alt="" />
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <img src="https://media.base44.com/images/public/6a1c530c59bb7bc9748ddeb4/11b6c5f41_generated_image.png"
                 className="w-7 h-7 rounded-full object-cover shrink-0" alt="" />
            <div className="bg-muted rounded-2xl px-4 py-3 flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
              <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3">
        <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Message..." className="rounded-full bg-muted border-0" />
          <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!input.trim() || loading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}