import React from "react";
import { Speaker } from "../types";
import { MessageSquare } from "lucide-react";
import { motion } from "motion/react";

interface SpeakerCardProps {
  key?: string | number;
  speaker: Speaker;
  isCurrent: boolean;
  status: "idle" | "running" | "paused" | "synthesizing" | "completed" | "error";
  isThinking: boolean;
  speechCount: number;
}

export default function SpeakerCard({
  speaker,
  isCurrent,
  status,
  isThinking,
  speechCount,
}: SpeakerCardProps) {
  // Brand colors with adjusted contrast for both themes
  const colorMap: Record<string, string> = {
    indigo: "from-indigo-500/20 to-indigo-600/10 text-indigo-500",
    emerald: "from-emerald-500/20 to-emerald-600/10 text-emerald-500",
    amber: "from-amber-500/20 to-amber-600/10 text-amber-500",
    rose: "from-rose-500/20 to-rose-600/10 text-rose-500",
    violet: "from-violet-500/20 to-violet-600/10 text-violet-500",
    sky: "from-sky-500/20 to-sky-600/10 text-sky-500",
    slate: "from-slate-500/20 to-slate-600/10 text-slate-500",
    teal: "from-teal-500/20 to-teal-600/10 text-teal-500",
    orange: "from-orange-500/20 to-orange-600/10 text-orange-500",
    cyan: "from-cyan-500/20 to-cyan-600/10 text-cyan-500",
    pink: "from-pink-500/20 to-pink-600/10 text-pink-500",
    green: "from-green-500/20 to-green-600/10 text-green-500",
  };

  const activeColor = colorMap[speaker.color] || colorMap.slate;
  const isActiveSpeaking = isCurrent && status === "running" && !isThinking;

  return (
    <motion.div
      id={`speaker-card-${speaker.id}`}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 shadow-sm overflow-hidden ${
        isActiveSpeaking
          ? `border-violet-400/50 bg-violet-50/5 dark:bg-violet-900/10 shadow-lg shadow-violet-500/10 scale-[1.02] ring-1 ring-violet-500/20`
          : isCurrent && isThinking
          ? "border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 opacity-90"
          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] hover:border-neutral-300 dark:hover:border-neutral-700"
      }`}
    >
      {/* Background Gradient for Active Speaker */}
      {isActiveSpeaking && (
        <div className={`absolute inset-0 bg-gradient-to-br ${activeColor} opacity-5 mix-blend-overlay pointer-events-none`} />
      )}

      {/* Top Indicators */}
      {isActiveSpeaking && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-1 -right-1 flex h-5 px-3 items-center justify-center rounded-bl-xl rounded-tr-xl text-[10px] font-mono tracking-wider uppercase font-bold text-white bg-violet-600 shadow-sm"
        >
          Speaking
        </motion.div>
      )}
      {isCurrent && isThinking && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-1 -right-1 flex h-5 px-3 items-center justify-center rounded-bl-xl rounded-tr-xl text-[10px] font-mono tracking-wider uppercase font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 border-l border-b border-neutral-200 dark:border-neutral-700"
        >
          <span className="flex items-center gap-1">
            Thinking <span className="flex gap-0.5"><span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span></span>
          </span>
        </motion.div>
      )}

      {/* Profile Header */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display text-xl font-bold bg-gradient-to-br ${activeColor} border border-black/5 dark:border-white/10 shrink-0`}>
          {speaker.name.charAt(0)}
        </div>
        
        <div className="flex-1 min-w-0 pt-0.5">
          <h4 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight truncate">
            {speaker.name}
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate mt-0.5">
            {speaker.role}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
              <MessageSquare className="w-3 h-3 text-neutral-400" />
              {speechCount} contributions
            </span>
          </div>
        </div>
      </div>

      {/* Persona Description */}
      <div className="mt-4 flex-1">
        <div className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium bg-neutral-50/80 dark:bg-neutral-900/50 p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800/80">
          <span className="font-bold text-neutral-400 dark:text-neutral-500 block mb-1 text-[10px] tracking-widest uppercase font-mono">Core Bias & Persona</span>
          <span className="line-clamp-3 hover:line-clamp-none transition-all">{speaker.persona}</span>
        </div>
      </div>

      {/* Visual Equalizer spectrum during speaking */}
      {isActiveSpeaking && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 flex items-center justify-between bg-violet-50/50 dark:bg-violet-900/20 px-3 py-2 rounded-lg border border-violet-100 dark:border-violet-900/50"
        >
          <span className="text-[10px] font-mono font-bold tracking-widest text-violet-500 uppercase">Acoustic Feed</span>
          <div className="flex items-center gap-0.5 h-4">
            <motion.div animate={{ height: ["4px", "16px", "4px"] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }} className="w-1 bg-violet-500 rounded-full"></motion.div>
            <motion.div animate={{ height: ["8px", "12px", "8px"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="w-1 bg-violet-500 rounded-full"></motion.div>
            <motion.div animate={{ height: ["12px", "6px", "12px"] }} transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} className="w-1 bg-violet-500 rounded-full"></motion.div>
            <motion.div animate={{ height: ["6px", "14px", "6px"] }} transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="w-1 bg-violet-500 rounded-full"></motion.div>
            <motion.div animate={{ height: ["14px", "8px", "14px"] }} transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.15 }} className="w-1 bg-violet-500 rounded-full"></motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
