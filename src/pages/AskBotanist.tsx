import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSession } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  ArrowLeft, 
  Bot, 
  User,
  Loader2,
  Sparkles,
  Leaf
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AskBotanist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { user } = getSession();
    if (!user) {
      navigate("/auth");
      return;
    }

    // Add welcome message
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: 'Kumusta! Ako si Kuya Botanist 🧑‍🌾 Ano ang maitutulong ko sa iyo ngayon? Pwede mo akong tanungin tungkol sa pagtatanim, pag-aalaga ng halaman, o kahit anong tungkol sa urban gardening!',
        timestamp: new Date(),
      }]);
    }
  }, [navigate, messages.length]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Create placeholder for assistant response
    const assistantId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }]);

    try {
      const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/botanist-chat`;
      
      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Masyadong maraming tanong! Maghintay ng kaunti.');
        }
        throw new Error('Hindi makausap si Kuya Botanist');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') continue;

              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantContent += content;
                  setMessages(prev => prev.map(m => 
                    m.id === assistantId 
                      ? { ...m, content: assistantContent }
                      : m
                  ));
                }
              } catch {
                // Ignore parsing errors for incomplete JSON
              }
            }
          }
        }
      }

      if (!assistantContent) {
        throw new Error('Walang sagot mula kay Kuya Botanist');
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      // Update the placeholder message with error
      setMessages(prev => prev.map(m => 
        m.id === assistantId 
          ? { 
              ...m, 
              content: 'Pasensya na, may problema ako ngayon. Subukan ulit mamaya! 😅' 
            }
          : m
      ));

      toast({
        title: "May Problema",
        description: error instanceof Error ? error.message : "Hindi makausap si Kuya Botanist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const quickQuestions = [
    "Paano magdilig ng halaman?",
    "Ano ang pechay?",
    "Paano magtanim ng kamatis?",
    "Ano ang organic gardening?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col pb-20 safe-area-bottom">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm px-4 py-3 sticky top-0 z-10 border-b border-gray-100 safe-area-top">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Kuya Botanist</h1>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online - Handang tumulong!
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <Card className={cn(
                "max-w-[80%] p-3 rounded-2xl",
                message.role === 'user'
                  ? "bg-green-600 text-white rounded-br-sm"
                  : "bg-white border-gray-200 rounded-bl-sm"
              )}>
                {message.content || (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Nag-iisip...</span>
                  </div>
                )}
              </Card>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2">
          <div className="max-w-md mx-auto">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Mabilis na tanong:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-full border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => {
                    setInput(q);
                    inputRef.current?.focus();
                  }}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Magtanong kay Kuya Botanist..."
            className="flex-1 rounded-full border-gray-200"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="rounded-full bg-green-600 hover:bg-green-700 w-10 h-10 p-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AskBotanist;
