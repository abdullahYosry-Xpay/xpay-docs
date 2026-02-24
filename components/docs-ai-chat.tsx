'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

function mockAiResponse(_prompt: string): string {
  return "This is a placeholder response ";
}

export function DocsAIChat() {
  const [prompt, setPrompt] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = prompt.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setIsPanelOpen(true);
    setIsLoading(true);

    // Simulate AI response (replace with your API call)
    const delay = 400 + Math.random() * 400;
    setTimeout(() => {
      const assistantContent = mockAiResponse(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: assistantContent,
        },
      ]);
      setIsLoading(false);
    }, delay);
  };

  return (
    <>
      {/* Floating input at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-4 pt-2 pointer-events-none">
        <div className="w-full max-w-2xl pointer-events-auto">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-xl border border-[var(--fd-border)] bg-background shadow-lg shadow-black/5 dark:shadow-black/20 px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--fd-ring)] focus-within:ring-offset-2 focus-within:ring-offset-background"
          >
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about the docs..."
              className="flex-1 min-w-0 bg-background text-sm text-foreground placeholder:text-[var(--fd-muted-foreground)] outline-none"
              aria-label="Chat with AI"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="shrink-0 rounded-lg bg-[var(--fd-foreground)] text-[var(--fd-background)] px-3 py-1.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Overlay when panel is open (mobile-friendly) */}
      {isPanelOpen && (
        <button
          type="button"
          aria-label="Close AI chat"
          className="fixed inset-0 z-40 bg-black/20 md:bg-transparent md:pointer-events-none"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Right-side chat panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background border-l border-[var(--fd-border)] shadow-xl flex flex-col transition-transform duration-200 ease-out md:duration-300 ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isPanelOpen}
      >
        <div className="flex items-center justify-between shrink-0 border-b border-[var(--fd-border)] px-4 py-3 bg-background">
          <h2 className="text-sm font-semibold text-[var(--fd-foreground)]">
            AI Assistant
          </h2>
          <button
            type="button"
            onClick={() => setIsPanelOpen(false)}
            className="rounded-lg p-2 text-[var(--fd-muted-foreground)] hover:text-[var(--fd-foreground)] hover:bg-[var(--fd-accent)] transition-colors"
            aria-label="Close panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4 bg-background">
          {messages.length === 0 && !isLoading && (
            <p className="text-sm text-[var(--fd-muted-foreground)]">
              Send a message from the input below to start the conversation.
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user'
                    ? 'bg-[var(--fd-primary)] text-[var(--fd-primary-foreground)]'
                    : 'bg-[var(--fd-accent)] text-[var(--fd-foreground)]'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-2.5 text-sm bg-[var(--fd-accent)] text-[var(--fd-muted-foreground)]">
                <span className="inline-flex gap-1">
                  <span className="animate-pulse">Thinking</span>
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse">.</span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </aside>
    </>
  );
}
