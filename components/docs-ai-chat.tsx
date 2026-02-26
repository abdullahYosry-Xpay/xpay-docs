'use client';

import { createContext, useContext, useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

function mockAiResponse(_prompt: string): string {
  return 'This is a placeholder response ';
}

// ——— Context: open state shared between TOC trigger and panel ———
type AskAIContextValue = { isOpen: boolean; setOpen: (open: boolean) => void };
const AskAIContext = createContext<AskAIContextValue | null>(null);

function useAskAI() {
  const ctx = useContext(AskAIContext);
  if (!ctx) throw new Error('AskAI used outside AskAIProvider');
  return ctx;
}

// ——— Floating button: bottom-left (Fumadocs-style) ———
function AskAIFloatingButton() {
  const { setOpen, isOpen } = useAskAI();
  if (isOpen) return null;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full border border-(--fd-border) bg-(--fd-background) px-4 py-2.5 text-sm font-medium text-(--fd-foreground) shadow-lg shadow-black/5 transition-colors hover:bg-(--fd-accent) hover:text-(--fd-accent-foreground) dark:shadow-black/20"
      aria-label="Ask AI"
    >
      <span aria-hidden className="size-4 shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>
      Ask AI
    </button>
  );
}

// ——— Trigger: "Ask AI" link in TOC footer (Fumadocs-style) ———
export function AskAITrigger() {
  const { setOpen } = useAskAI();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="mt-3 flex w-full items-center gap-1.5 ps-3 py-1.5 text-left text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
      aria-label="Ask AI"
    >
      <span aria-hidden className="size-4 shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>
      Ask AI
    </button>
  );
}

// ——— Panel + chat logic (no floating bar) ———
function AskAIPanel({
  messages,
  setMessages,
  isLoading,
  setIsLoading,
  prompt,
  setPrompt,
  handleSubmit,
  messagesEndRef,
  inputRef,
}: {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  prompt: string;
  setPrompt: (s: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { isOpen, setOpen } = useAskAI();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close AI chat"
          className="fixed inset-0 z-40 bg-black/20 md:bg-transparent md:pointer-events-none"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background border-l border-[var(--fd-border)] shadow-xl flex flex-col transition-transform duration-200 ease-out md:duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between shrink-0 border-b border-[var(--fd-border)] px-4 py-3 bg-background">
          <h2 className="text-sm font-semibold text-[var(--fd-foreground)]">Ask AI</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-[var(--fd-muted-foreground)] hover:text-[var(--fd-foreground)] hover:bg-[var(--fd-accent)] transition-colors"
            aria-label="Close panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col p-4">
          <div className="flex-1 space-y-4 min-h-0">
            {messages.length === 0 && !isLoading && (
              <p className="text-sm text-[var(--fd-muted-foreground)]">
                Ask a question about the docs. Your conversation appears here.
              </p>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--fd-border)] bg-[var(--fd-card)] px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--fd-ring)] focus-within:ring-offset-2 focus-within:ring-offset-background shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about the docs..."
              className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-[var(--fd-muted-foreground)] outline-none"
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
      </aside>
    </>
  );
}

// ——— Provider: state + panel (Fumadocs-style: no floating bar) ———
export function DocsAIChat({ children }: { children?: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
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

    const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setOpen(true);
    setIsLoading(true);

    const delay = 400 + Math.random() * 400;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: 'assistant', content: mockAiResponse(text) },
      ]);
      setIsLoading(false);
    }, delay);
  };

  return (
    <AskAIContext.Provider value={{ isOpen, setOpen }}>
      {children}
      <AskAIFloatingButton />
      <AskAIPanel
        messages={messages}
        setMessages={setMessages}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        prompt={prompt}
        setPrompt={setPrompt}
        handleSubmit={handleSubmit}
        messagesEndRef={messagesEndRef}
        inputRef={inputRef}
      />
    </AskAIContext.Provider>
  );
}
