import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import Logo from './Logo';

export default function TermsOfService({ onBack, theme }: { onBack: () => void, theme: 'light'|'dark' }) {
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
          <FileText className="w-10 h-10 text-violet-500" />
          <h1 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Terms of Service</h1>
        </div>
        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>1. Acceptance of Terms</h2>
            <p>By accessing and using YouVo Battleground, you accept and agree to be bound by the terms and provision of this agreement. This application is provided "as is" without warranty of any kind.</p>
          </section>
          <section className="space-y-3">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>2. API Usage and Liability</h2>
            <p>YouVo Battleground acts as a client-side interface to third-party language models. You are entirely responsible for the API keys you provide, the costs incurred through their usage, and adherence to the Terms of Service of the respective API providers (OpenAI, Anthropic, Google, etc.).</p>
          </section>
          <section className="space-y-3">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>3. Intellectual Property</h2>
            <p>The code, design, and architecture of YouVo Battleground are the intellectual property of YouVo AI. However, the outputs generated during your ephemeral sessions belong to you, subject to the licensing terms of the foundational models used.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
