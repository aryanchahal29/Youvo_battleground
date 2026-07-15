import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import Logo from './Logo';

export default function PrivacyPolicy({ onBack, theme }: { onBack: () => void, theme: 'light'|'dark' }) {
  return (
    <div className={`min-h-screen flex flex-col font-sans ${theme === 'dark' ? 'bg-[#0A0A0B] text-neutral-200' : 'bg-neutral-50 text-neutral-800'}`}>
      <header className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-40 ${theme === 'dark' ? 'border-neutral-800 bg-[#0A0A0B]' : 'border-neutral-200 bg-white'}`}>
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8" onClick={onBack} />
          <span className={`text-base font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>YouVo Battleground</span>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold hover:text-violet-500 transition-colors focus-visible:ring-2 focus-visible:ring-violet-500 focus:outline-none rounded-md px-2 py-1">
          <ArrowLeft className="w-4 h-4" /> Back to Arena
        </button>
      </header>
      <main className="max-w-3xl mx-auto py-16 px-6 space-y-8">
        <div className="flex items-center gap-4 border-b pb-8 border-neutral-200 dark:border-neutral-800">
          <Shield className="w-10 h-10 text-violet-500" />
          <h1 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Privacy Policy</h1>
        </div>
        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>1. Ephemeral Data Architecture</h2>
            <p>YouVo Battleground is built on a strict ephemeral architecture. All debate transcripts, multi-agent interactions, and consensus reports are stored entirely within your browser's local <code className="bg-neutral-500/10 px-1 py-0.5 rounded">sessionStorage</code>. When you close your tab or clear your browser session, this data is permanently destroyed.</p>
          </section>
          <section className="space-y-3">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>2. External API Processing</h2>
            <p>To power the AI agents, the platform transmits your prompts and configured system instructions to third-party LLM providers (e.g., OpenAI, Anthropic) using the API keys you provide. We do not proxy, intercept, or store these API requests on YouVo servers. Your relationship and data privacy regarding the AI outputs are governed by the respective API providers.</p>
          </section>
          <section className="space-y-3">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>3. API Keys Security</h2>
            <p>Your API keys are never stored on our servers. They are maintained securely in your browser's local storage and injected directly into the API calls made from your client to the LLM providers.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
