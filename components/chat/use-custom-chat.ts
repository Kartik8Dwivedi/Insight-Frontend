import { useState, useCallback } from 'react';

export function useCustomChat({ api, id }: { api: string; id: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const append = useCallback(async (message: { role: string; content: string }) => {
    setIsLoading(true);
    setError(null);
    const newMessages = [...messages, { ...message, id: Date.now().toString() }];
    setMessages(newMessages);

    // Save to localStorage if it's the first message
    if (messages.length === 0 && message.role === 'user') {
      try {
        const storedChats = JSON.parse(localStorage.getItem('jee_recent_chats') || '[]');
        const newChat = {
          id,
          userPrompt: message.content,
          timestamp: Date.now()
        };
        // avoid duplicates
        const filteredChats = storedChats.filter((c: any) => c.id !== id);
        localStorage.setItem('jee_recent_chats', JSON.stringify([newChat, ...filteredChats]));
      } catch (e) {
        console.error("Failed to save chat to local storage", e);
      }
    }

    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantMessageId = (Date.now() + 1).toString();

      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: 'assistant', content: '' },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;
        
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex].role === 'assistant') {
            updated[lastIndex] = { ...updated[lastIndex], content: assistantContent };
          }
          return updated;
        });
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [api, messages]);

  const handleSubmit = (e?: any) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input;
    setInput('');
    append({ role: 'user', content: msg });
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    error,
  };
}
