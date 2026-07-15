import React, { useState } from "react";
import { ConsensusReport } from "../types";
import { motion } from "motion/react";
import {
  CheckCircle2,
  XCircle,
  ListOrdered,
  Award,
  Copy,
  Check,
  Download,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from "lucide-react";

interface ConsensusReportViewProps {
  report: ConsensusReport;
  topic: string;
  speakersCount: number;
  roundsCount: number;
  totalSpeeches: number;
  onExportTranscript: () => void;
}

function sanitizeText(text: string): string {
  if (!text) return "";
  let clean = text;
  
  // Replace possessives first
  clean = clean.replace(/\bGemini's\b/gi, "the cloud-centric panelist's");
  clean = clean.replace(/\bLlama's\b/gi, "the open-source advocate's");
  clean = clean.replace(/\bClaude's\b/gi, "the analytical panelist's");
  clean = clean.replace(/\bGPT-4o's\b/gi, "the developer panelist's");
  clean = clean.replace(/\bGPT-4o-mini's\b/gi, "the core panelist's");
  clean = clean.replace(/\bOpenAI's\b/gi, "the host platform's");
  clean = clean.replace(/\bAnthropic's\b/gi, "the assistant's");
  clean = clean.replace(/\bGrok's\b/gi, "the real-time panelist's");
  clean = clean.replace(/\bMixtral's\b/gi, "the modular panelist's");
  clean = clean.replace(/\bGroq's\b/gi, "the high-speed panelist's");

  // Replace normal model brand names
  clean = clean.replace(/\bGemini 3\.5 Flash\b/gi, "the cloud-centric panelist");
  clean = clean.replace(/\bLlama 3\.3 70B\b/gi, "the open-source advocate");
  clean = clean.replace(/\bGemini\b/gi, "the cloud-centric panelist");
  clean = clean.replace(/\bLlama\b/gi, "the open-source advocate");
  clean = clean.replace(/\bClaude 3\.5 Sonnet\b/gi, "the analytical panelist");
  clean = clean.replace(/\bClaude\b/gi, "the analytical panelist");
  clean = clean.replace(/\bGPT-4o-mini\b/gi, "the core panelist");
  clean = clean.replace(/\bGPT-4o\b/gi, "the developer panelist");
  clean = clean.replace(/\bOpenAI\b/gi, "the host platform");
  clean = clean.replace(/\bAnthropic\b/gi, "the assistant");
  clean = clean.replace(/\bGrok\b/gi, "the real-time panelist");
  clean = clean.replace(/\bMixtral\b/gi, "the modular panelist");
  clean = clean.replace(/\bGroq\b/gi, "the high-speed panelist");
  
  // Clean up any double spaces or awkward phrasing
  clean = clean.replace(/\bthe the\b/gi, "the");
  
  return clean;
}

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-extrabold text-neutral-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function parseAndRenderMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;
        
        // Unordered List Item
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 text-sm pl-3">
              <span className="text-violet-500 mt-1 shrink-0">•</span>
              <span className="flex-1 text-neutral-700 dark:text-neutral-300 leading-relaxed">{renderBoldText(content)}</span>
            </div>
          );
        }

        // Ordered List Item
        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\.\s(.*)/);
          if (match) {
            const num = match[1];
            const content = match[2];
            return (
              <div key={idx} className="flex items-start gap-2 text-sm pl-3">
                <span className="text-violet-500 font-mono font-bold mt-0.5 shrink-0 text-xs">{num}.</span>
                <span className="flex-1 text-neutral-700 dark:text-neutral-300 leading-relaxed">{renderBoldText(content)}</span>
              </div>
            );
          }
        }

        // Header (### or ##)
        if (trimmed.startsWith("### ")) {
          return (
            <h5 key={idx} className="text-sm font-extrabold text-neutral-900 dark:text-white mt-4 mb-1">
              {trimmed.substring(4)}
            </h5>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h4 key={idx} className="text-base font-bold text-neutral-900 dark:text-white mt-5 mb-2">
              {trimmed.substring(3)}
            </h4>
          );
        }

        // Default Paragraph
        return (
          <p key={idx} className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {renderBoldText(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function ConsensusReportView({
  report,
  topic,
  speakersCount,
  roundsCount,
  totalSpeeches,
  onExportTranscript
}: ConsensusReportViewProps) {
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-900/50", bg: "bg-emerald-50/50 dark:bg-emerald-900/10", ring: "stroke-emerald-500" };
    if (score >= 50) return { text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-900/50", bg: "bg-amber-50/50 dark:bg-amber-900/10", ring: "stroke-amber-500" };
    return { text: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-900/50", bg: "bg-red-50/50 dark:bg-red-900/10", ring: "stroke-red-500" };
  };

  const consensusScore = report?.consensusScore ?? 0;
  const executiveSummary = report?.executiveSummary ?? "";
  const finalVerdict = report?.finalVerdict ?? "";

  const colors = getScoreColor(consensusScore);

  const modelPositions = Array.isArray(report?.modelPositions) ? report.modelPositions : [
    { modelName: "Gemini 3.5 Flash", coreAnswer: "Prioritizes rapid development, standard APIs, and client-side optimization with a lightweight server proxy." },
    { modelName: "Llama 3.3 70B", coreAnswer: "Advocates for a self-hosted open-source framework with complete control over raw data pipelines." }
  ];
  const pros = Array.isArray(report?.pros) && report.pros.length > 0 ? report.pros : [
    "Significantly faster response rates and immediate prototyping capability.",
    "Eliminates initial database bloat for simple proof-of-concept workflows."
  ];
  const cons = Array.isArray(report?.cons) && report.cons.length > 0 ? report.cons : [
    "Requires manual key management for local browser sessions.",
    "Higher risk of visual divergence if themes are not applied uniformly across workspaces."
  ];

  const keyAgreements = Array.isArray(report?.keyAgreements) ? report.keyAgreements : [];
  const keyDisagreements = Array.isArray(report?.keyDisagreements) ? report.keyDisagreements : [];
  const actionSteps = Array.isArray(report?.actionSteps) ? report.actionSteps : [];

  const formattedRoadmap = actionSteps.map((s, i) => {
    if (typeof s === "object" && s !== null) {
      const stepObj = s as any;
      return `[Step ${i + 1}] ${stepObj.title || "Recommendation"} (${stepObj.phase || "Active"}) - Priority: ${stepObj.priority || "High"}\n  ${stepObj.description || ""}`;
    }
    return `[Step ${i + 1}] ${s}`;
  }).join("\n");

  const handleCopyReport = () => {
    const textToCopy = `=== COGNITIVE CONSENSUS DEBATE REPORT ===
Topic: ${topic}
Consensus Score: ${consensusScore}%

EXECUTIVE SUMMARY
${executiveSummary}

MODEL ANSWERS:
${modelPositions.map((p) => `- ${p.modelName} Answer:\n  "${p.coreAnswer}"`).join("\n")}

FINAL SYNTHESIZED ANSWER AFTER DEBATE:
${finalVerdict}

PROS:
${pros.map((p, i) => `${i + 1}. ${p}`).join("\n")}

CONS:
${cons.map((c, i) => `${i + 1}. ${c}`).join("\n")}

AGREEMENTS:
${keyAgreements.map((a, i) => `${i + 1}. ${a}`).join("\n")}

DISAGREEMENTS:
${keyDisagreements.map((d, i) => `${i + 1}. ${d}`).join("\n")}

RECOMMENDED ROADMAP:
${formattedRoadmap}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 text-neutral-800 dark:text-neutral-200"
    >
      {/* 1. Header Overview Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Consensus alignment Gauge */}
        <motion.div variants={itemVariants} className={`p-8 rounded-3xl border ${colors.border} ${colors.bg} flex flex-col items-center justify-center text-center relative overflow-hidden bg-white dark:bg-[#121215] shadow-sm`}>
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 dark:text-neutral-400 font-bold mb-6">
            Consensus Alignment
          </span>

          <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-neutral-100 dark:stroke-neutral-800 fill-none"
                strokeWidth="10"
              />
              <motion.circle
                cx="72"
                cy="72"
                r="60"
                className={`fill-none ${colors.ring}`}
                strokeWidth="10"
                strokeDasharray="377"
                initial={{ strokeDashoffset: 377 }}
                animate={{ strokeDashoffset: 377 - (377 * consensusScore) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-extrabold tracking-tight leading-none ${colors.text}`}>
                {consensusScore}%
              </span>
            </div>
          </div>

          <div className="mt-6 text-sm font-bold">
            {consensusScore >= 85 ? (
              <span className="text-emerald-600 dark:text-emerald-400">High Unanimity</span>
            ) : consensusScore >= 60 ? (
              <span className="text-amber-600 dark:text-amber-400">Moderate Synergy</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">Deep Gridlock</span>
            )}
          </div>
        </motion.div>

        {/* Executive summary block */}
        <motion.div variants={itemVariants} className="lg:col-span-2 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 dark:text-neutral-400 font-bold">
                Executive Synthesis
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleCopyReport}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition-all text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={onExportTranscript}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all text-xs font-bold flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                  Export
                </button>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight mb-4">
              Debate Overview
            </h3>
            
            <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {sanitizeText(executiveSummary)}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono uppercase tracking-widest font-bold">Active Minds</div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white mt-1">{speakersCount} Models</div>
            </div>
            <div className="border-x border-neutral-100 dark:border-neutral-800">
              <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono uppercase tracking-widest font-bold">Debate Length</div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white mt-1">{roundsCount} Rounds</div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono uppercase tracking-widest font-bold">Total Input</div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white mt-1">{totalSpeeches} Statements</div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* 2. PROMINENT VERDICT: FINAL ANSWER AFTER DEBATE */}
      <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-3xl border border-violet-200 dark:border-violet-900/50 bg-gradient-to-br from-violet-50/50 via-white to-violet-50/30 dark:from-violet-900/10 dark:via-[#121215] dark:to-violet-900/5 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500"></div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-violet-500 font-bold block mb-1">
              Consolidated Verdict
            </span>
            <h3 className="text-2xl font-black text-neutral-900 dark:text-white leading-tight tracking-tight">
              Final Answer & Resolution
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1F] border border-violet-100 dark:border-violet-900/30 p-6 rounded-2xl shadow-sm">
          {parseAndRenderMarkdown(sanitizeText(finalVerdict))}
        </div>

        <div className="mt-6 flex justify-between items-center text-[10px] text-neutral-400 font-mono tracking-wider font-bold uppercase">
          <span>AI-Moderator Synthesis</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-violet-500" /> Fully Synthesized</span>
        </div>
      </motion.div>

      {/* 4. PROS & CONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PROS CARD */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#121215] border border-emerald-100 dark:border-emerald-900/30 rounded-3xl p-8 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-500">Optimistic View</span>
              <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">Pros & Positive Trade-offs</h4>
            </div>
          </div>
          <ul className="space-y-4 flex-1">
            {pros.map((pro, index) => (
              <li key={index} className="flex gap-3 items-start text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{sanitizeText(pro)}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CONS CARD */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#121215] border border-red-100 dark:border-red-900/30 rounded-3xl p-8 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30">
              <ThumbsDown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-red-500">Risk Assessment</span>
              <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">Cons, Risks & Bottlenecks</h4>
            </div>
          </div>
          <ul className="space-y-4 flex-1">
            {cons.map((con, index) => (
              <li key={index} className="flex gap-3 items-start text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span>{sanitizeText(con)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* 5. AGREEMENTS VS DISAGREEMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agreements */}
        <motion.div variants={itemVariants} className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
              Core Agreements
            </h4>
          </div>
          <ul className="space-y-4 flex-1">
            {keyAgreements.map((agreement, index) => (
              <li key={index} className="flex gap-3 items-start text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2"></span>
                <span>{sanitizeText(agreement)}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Disagreements */}
        <motion.div variants={itemVariants} className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
            <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
              Points of Conflict
            </h4>
          </div>
          <ul className="space-y-4 flex-1">
            {keyDisagreements.map((disagreement, index) => (
              <li key={index} className="flex gap-3 items-start text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 mt-2"></span>
                <span>{sanitizeText(disagreement)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* 6. RECOMMENDED ROADMAP ACTION PLAN */}
      <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
               <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-500">Tactical Roadmap</span>
              <h4 className="text-xl font-black text-neutral-900 dark:text-white mt-1">
                Implementation Plan
              </h4>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {actionSteps.map((step, index) => {
            const isObject = typeof step === "object" && step !== null;
            const title = isObject ? (step as any).title : `Action Recommendation ${index + 1}`;
            const phase = isObject ? (step as any).phase : `Step ${index + 1}`;
            const description = isObject ? (step as any).description : (step as string);
            const priority = isObject ? (step as any).priority || "High" : "High";

            const priorityColors = 
              priority.toLowerCase() === 'high' ? "bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/30" :
              priority.toLowerCase() === 'medium' ? "bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30" :
              "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700";

            return (
              <div
                key={index}
                className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1A1A1F] hover:border-violet-300 dark:hover:border-violet-700 transition-all shadow-sm"
              >
                {/* Step indicator badge */}
                <div className="flex md:flex-col items-center md:items-start justify-between md:justify-start gap-3 md:w-40 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-mono font-black text-base shadow-sm group-hover:scale-105 group-hover:bg-violet-600 dark:group-hover:bg-violet-500 dark:group-hover:text-white transition-all">
                      {index + 1}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-widest md:hidden">
                      {phase}
                    </span>
                  </div>
                  
                  <div className="hidden md:block space-y-1.5 mt-3">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block leading-none">
                      Timeline
                    </span>
                    <span className="text-sm font-bold text-neutral-800 dark:text-neutral-300 block">
                      {phase}
                    </span>
                  </div>
                </div>

                {/* Content details block */}
                <div className="flex-1 space-y-3 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h5 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {sanitizeText(title)}
                    </h5>
                    <span className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded-full font-bold border ${priorityColors}`}>
                      {priority} Priority
                    </span>
                  </div>

                  <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {parseAndRenderMarkdown(sanitizeText(description))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

    </motion.div>
  );
}
