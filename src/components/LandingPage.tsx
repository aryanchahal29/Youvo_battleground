import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { motion, useAnimation } from "motion/react";
import { ThreeDScene } from "./ThreeDModel";
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Sun,
  Moon,
  Info,
  CheckCircle2,
  Users,
  MessageSquare,
  ChevronRight,
  Plus,
  Compass,
  Zap,
  Globe,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Activity,
  FileText,
  FileCode,
  Network,
  Cpu,
  Layers,
  Scale,
  BrainCircuit,
  Building,
  Briefcase
} from "lucide-react";

interface LandingPageProps {
  onEnter: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const HeroAgentAnimation = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-30 sm:opacity-50">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }} viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 2 }}
        className="relative w-full max-w-4xl h-full min-h-[500px]"
      >
        {/* Abstract lines connecting nodes */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            d="M 20% 30% C 40% 40%, 60% 20%, 80% 40%" 
            stroke="url(#gradient-line)" 
            strokeWidth="1.5" 
            fill="transparent"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }} viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            strokeDasharray="4 4"
          />
          <motion.path 
            d="M 80% 40% C 70% 70%, 40% 60%, 20% 70%" 
            stroke="url(#gradient-line)" 
            strokeWidth="1.5" 
            fill="transparent"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }} viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            strokeDasharray="4 4"
          />
          <motion.path 
            d="M 20% 70% C 10% 50%, 10% 40%, 20% 30%" 
            stroke="url(#gradient-line)" 
            strokeWidth="1.5" 
            fill="transparent"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }} viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
            strokeDasharray="4 4"
          />
          
          <defs>
            <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#d946ef" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Animated Nodes */}
        <motion.div 
          className="absolute top-[30%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)]"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-500" />
          </div>
        </motion.div>

        <motion.div 
          className="absolute top-[40%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(217,70,239,0.2)]"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center">
            <Network className="w-5 h-5 text-fuchsia-500" />
          </div>
        </motion.div>

        <motion.div 
          className="absolute top-[70%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-sky-500/10 border border-sky-500/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.2)]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center">
            <BrainCircuit className="w-3 h-3 text-sky-500" />
          </div>
        </motion.div>

        {/* Floating Data Packets */}
        <motion.div 
          className="absolute w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,1)]"
          animate={{
            top: ["30%", "25%", "40%"],
            left: ["20%", "50%", "80%"],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,1)]"
          animate={{
            top: ["40%", "60%", "70%"],
            left: ["80%", "50%", "20%"],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </motion.div>
    </div>
  );
};

export default function LandingPage({ onEnter, theme, toggleTheme }: LandingPageProps) {
  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 overflow-x-hidden ${
        theme === "dark" ? "bg-[#0A0A0B] text-neutral-100 dark-theme" : "bg-neutral-50 text-neutral-900"
      }`}
    >
      {/* 1. Header Navigation Bar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`h-20 border-b px-4 md:px-10 flex items-center justify-between sticky top-0 z-40 backdrop-blur-2xl transition-all ${
          theme === "dark"
            ? "border-neutral-800/50 bg-[#0A0A0B]/80"
            : "border-neutral-200/50 bg-white/80"
        }`}
      >
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10 rounded-xl shadow-lg border border-neutral-200/50 dark:border-neutral-800" />
          <div className="flex flex-col">
            <span className={`font-black tracking-tight text-lg leading-none ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
              YouVo Battleground
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-violet-500 mt-1">
              AI Debate Arena
            </span>
          </div>
        </div>

        {/* Center: Navigation (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
          <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className={`transition-colors ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}>Features</a>
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }} className={`transition-colors ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}>How it Works</a>
          
        </nav>

        {/* Top Header Buttons (Right Side) */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-5 sm:pr-5 sm:border-r border-neutral-200 dark:border-neutral-800">
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-violet-500 focus:outline-none ${
                theme === "dark"
                  ? "text-neutral-500 hover:text-amber-400"
                  : "text-neutral-400 hover:text-violet-600"
              }`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
          <button
            onClick={() => onEnter()}
            className="hidden sm:flex relative p-[1px] rounded-xl overflow-hidden group hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_auto] animate-gradient"></span>
            <span className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black w-full h-full transition-colors ${
              theme === "dark"
                ? "bg-[#0A0A0B] text-white hover:bg-neutral-900/80"
                : "bg-white text-neutral-900 hover:bg-neutral-50/90"
            }`}>
              Enter Arena <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          {/* Mobile Launch Button */}
          <button
            onClick={() => onEnter()}
            className="sm:hidden p-2 rounded-xl bg-violet-600 text-white shadow-md shadow-violet-500/25 cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-40 px-4 sm:px-6 flex flex-col justify-center min-h-[90vh]">
        {/* Abstract Background Elements */}
        <motion.div 
          animate={{ 
            x: [0, 50, -30, 0], 
            y: [0, -50, 20, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/40 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 ${theme === "dark" ? "mix-blend-screen" : "mix-blend-multiply"}`}
        ></motion.div>
        <motion.div 
          animate={{ 
            x: [0, -60, 40, 0], 
            y: [0, 40, -30, 0],
            scale: [1, 0.8, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className={`absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/30 rounded-full blur-[150px] pointer-events-none translate-x-1/3 translate-y-1/3 ${theme === "dark" ? "mix-blend-screen" : "mix-blend-multiply"}`}
        ></motion.div>
        
        <ThreeDScene theme={theme} />

        <motion.div 
          className="max-w-5xl mx-auto text-center space-y-8 relative z-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible" viewport={{ once: false, amount: 0.1 }}
        >
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] rounded-[100%] blur-[100px] pointer-events-none -z-10 ${theme === "dark" ? "bg-black/20" : "bg-white/20"}`}></div>
          <motion.div variants={fadeInUp} className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black tracking-widest uppercase backdrop-blur-sm shadow-[0_0_25px_rgba(139,92,246,0.25)] transition-colors ${theme === "dark" ? "bg-violet-500/20 border-violet-500/50 text-violet-300" : "bg-violet-500/10 border-violet-500/30 text-violet-700"}`}>
            <Zap className="w-3.5 h-3.5" />
            <span>Multi-Agent Consensus Engine</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] relative z-10 ${theme === "dark" ? "" : "drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]"} ${
              theme === "dark" ? "text-white" : "text-neutral-900"
            }`}
          >
            Resolve complex decisions with <br className="hidden md:block" />
            <span className={`relative z-10 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient ${theme === "dark" ? "drop-shadow-sm" : "drop-shadow-[0_4px_10px_rgba(255,255,255,1)] filter"}`}>
              competing AI minds.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className={`text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            Assemble a panel of expert AI models. Launch structured debates, inject real-time feedback, and extract definitive, synthesized consensus for your toughest engineering and business trade-offs.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={() => onEnter()}
              className="w-full sm:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold tracking-wide rounded-full transition-all shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-1 active:scale-95"
            >
              Deploy Models <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              className={`w-full sm:w-auto px-8 py-4 border rounded-full text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95 ${
                theme === "dark"
                  ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                  : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              Explore the Lab <ChevronRight className="w-4 h-4 text-neutral-400" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. Features Bento Grid */}
      <section id="features" className={`py-16 md:py-24 px-4 sm:px-6 transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0A0A0B]" : "bg-white"
      }`}>
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
              The Multi-Agent Advantage
            </h2>
            <p className={`text-base ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Move beyond single-prompt limitations. Cross-validate ideas through adversarial debate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: false, amount: 0.1 }}
              className={`md:col-span-2 p-8 rounded-3xl border flex flex-col justify-between overflow-hidden relative group transition-colors duration-300 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] ${
                theme === "dark" ? "bg-[#121215] border-neutral-800" : "bg-neutral-50 border-neutral-200"
              }`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -mr-20 -mt-20 transition-transform group-hover:scale-150"></div>
              <div className="relative z-10 space-y-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-violet-900/30 border border-violet-800/50' : 'bg-violet-100 border border-violet-200'}`}>
                  <Scale className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Zero-Bias Analysis</h3>
                  <p className={`text-base max-w-md ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    By pitting distinct LLM architectures against each other, the arena naturally neutralizes individual model biases, resulting in highly objective, pressure-tested conclusions.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ delay: 0.1 }}
              className={`p-8 rounded-3xl border flex flex-col justify-between overflow-hidden relative group transition-colors duration-300 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] ${
                theme === "dark" ? "bg-[#121215] border-neutral-800" : "bg-neutral-50 border-neutral-200"
              }`}
            >
              <div className="relative z-10 space-y-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-fuchsia-900/30 border border-fuchsia-800/50' : 'bg-fuchsia-100 border border-fuchsia-200'}`}>
                  <Layers className="w-6 h-6 text-fuchsia-600" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Contextual Synthesis</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Distills hours of simulated debate into a single, high-signal executive verdict with clear pros, cons, and action steps.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ delay: 0.2 }}
              className={`p-8 rounded-3xl border flex flex-col justify-between overflow-hidden relative group transition-colors duration-300 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] ${
                theme === "dark" ? "bg-[#121215] border-neutral-800" : "bg-neutral-50 border-neutral-200"
              }`}
            >
              <div className="relative z-10 space-y-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-sky-900/30 border border-sky-800/50' : 'bg-sky-100 border border-sky-200'}`}>
                  <Activity className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Dynamic Moderation</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Inject real-time constraints mid-debate. Force panelists to pivot, address new parameters, or focus strictly on implementation constraints.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ delay: 0.3 }}
              className={`md:col-span-2 p-8 rounded-3xl border flex flex-col justify-between overflow-hidden relative group transition-colors duration-300 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] ${
                theme === "dark" ? "bg-[#121215] border-neutral-800" : "bg-neutral-50 border-neutral-200"
              }`}
            >
               <div className="absolute bottom-0 right-0 w-[400px] h-[100px] bg-gradient-to-t from-violet-500/20 to-transparent"></div>
              <div className="relative z-10 space-y-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-amber-900/30 border border-amber-800/50' : 'bg-amber-100 border border-amber-200'}`}>
                  <FileCode className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Deep File Context</h3>
                  <p className={`text-base max-w-md ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Upload massive codebases, PDFs, and strategic documents. The panelists will ground their arguments in your specific source material, not generic internet knowledge.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. How it Works (Process) */}
      <section id="how-it-works" className={`py-16 md:py-24 px-4 sm:px-6 border-y transition-colors duration-300 ${
        theme === "dark" ? "bg-neutral-900/50 border-neutral-800" : "bg-neutral-50 border-neutral-200"
      }`}>
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
              The Resolution Process
            </h2>
            <p className={`text-base ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Transform divergent perspectives into unified strategies through structured dialectic analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Assemble Panel",
                desc: "Select flagship models (GPT-4, Claude, Gemini) with distinct personas to challenge assumptions.",
                icon: <Users className="w-5 h-5 text-violet-500" />
              },
              {
                step: "02",
                title: "Define Context",
                desc: "Provide your prompt, upload PDFs or code, and set the parameters for the debate.",
                icon: <FileText className="w-5 h-5 text-violet-500" />
              },
              {
                step: "03",
                title: "Structured Debate",
                desc: "Models autonomously critique each other in turn-based rounds to uncover hidden flaws.",
                icon: <MessageSquare className="w-5 h-5 text-violet-500" />
              },
              {
                step: "04",
                title: "Synthesize",
                desc: "Extract a unified consensus report detailing agreements, risks, and actionable steps.",
                icon: <CheckCircle2 className="w-5 h-5 text-violet-500" />
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -10 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`group p-8 rounded-3xl border flex flex-col space-y-6 transition-all duration-300 hover:shadow-xl ${
                  theme === "dark"
                    ? "bg-[#121215] border-neutral-800 shadow-black/50"
                    : "bg-white border-neutral-200 shadow-neutral-200/50 hover:shadow-violet-500/10 hover:border-violet-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    theme === 'dark' ? 'bg-violet-500/10' : 'bg-violet-50'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="font-mono text-4xl font-black text-neutral-200 dark:text-neutral-800 select-none group-hover:text-violet-500/20 transition-colors duration-300">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      {/* 5. Clashes vs Single Prompts */}
      <section className={`py-16 md:py-24 px-4 sm:px-6 transition-colors duration-300 ${theme === "dark" ? "bg-[#0A0A0B]" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-8">
            <h2 className={`text-3xl md:text-5xl font-black tracking-tight leading-tight ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
              Why Battleground Clashes<br />Outperform Single Prompts
            </h2>
            <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              When you ask a single AI model for advice, you receive a single confirmation-biased perspective. By pitting different, highly specialized minds against each other, assumptions are cross-examined, hidden failure modes are brought to light, and compromises are rigorously resolved.
            </p>
            <ul className="space-y-5">
              {[
                "Neutralizes confirmation bias of a single LLM vendor",
                "Injects real-time human interventions to guide debate logic",
                "Multimodal integration supports files, PDFs, and code directly",
                "Fully customizable expert personas tailored to your industry"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full border border-violet-500/50 flex items-center justify-center shrink-0 text-violet-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          
          <div className="flex-1 w-full relative">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              className={`p-6 md:p-8 rounded-3xl border shadow-2xl ${theme === 'dark' ? 'bg-[#121215] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}
            >
              <div className="flex items-center justify-between mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                  </span>
                  <div className="text-[10px] font-bold tracking-widest uppercase font-mono text-neutral-500">
                    Active Simulation Preview
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Message A */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ delay: 0.2 }}
                  className={`flex gap-4 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-[#1A1A1E] border-neutral-800' : 'bg-white border-neutral-200'}`}
                >
                  <div className="w-8 h-8 rounded bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">A</div>
                  <div>
                    <h4 className={`text-sm font-bold mb-1 ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>Model Alpha (Academic Architect)</h4>
                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      "I strongly advocate for TypeScript type safety here. While Model Beta's schema yields rapid prototyping, the runtime risk isn't worth the brief velocity bump..."
                    </p>
                  </div>
                </motion.div>

                {/* Message B */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ delay: 0.4 }}
                  className={`flex gap-4 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme === 'dark' ? 'bg-[#1A1A1E] border-neutral-800' : 'bg-white border-neutral-200'}`}
                >
                  <div className="w-8 h-8 rounded bg-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0">B</div>
                  <div>
                    <h4 className={`text-sm font-bold mb-1 ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>Model Beta (Strategic Flagship)</h4>
                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      "Model Alpha is correct on safety, but overlooks the database cost multiplier. Running a fully normalized structure increases join latency. I suggest a Hybrid cache model..."
                    </p>
                  </div>
                </motion.div>

                {/* Message M */}
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ delay: 0.8 }}
                  className={`flex gap-4 p-4 rounded-xl border relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(139,92,246,0.2)] ${theme === 'dark' ? 'bg-[#121215] border-violet-500/30' : 'bg-violet-50/50 border-violet-500/30'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 translate-x-[-100%] animate-shimmer"></div>
                  <div className="w-8 h-8 rounded bg-violet-500 text-white flex items-center justify-center font-bold text-sm shrink-0 relative z-10">M</div>
                  <div className="relative z-10">
                    <h4 className={`text-sm font-bold mb-1 ${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}`}>Synthesized Moderator Consensus</h4>
                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      The council has reached general consensus on applying Type Safety checks, with a compromised denormalized caching layer to protect lookup latency.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>


      {/* 6. Use Cases */}
      <section className={`py-16 md:py-24 px-4 sm:px-6 transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0A0A0B]" : "bg-white"
      }`}>
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
              Built for High-Stakes Complexity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Cpu className="w-8 h-8" />,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                title: "Software Architecture",
                desc: "Debate microservices vs. monoliths, SQL vs. NoSQL, or evaluate the security implications of a new framework before writing a single line of code."
              },
              {
                icon: <Building className="w-8 h-8" />,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
                title: "Product Strategy",
                desc: "Pressure-test pricing models, go-to-market strategies, and feature roadmaps. Identify hidden market risks by pitting optimistic AI personas against cynical ones."
              },
              {
                icon: <Briefcase className="w-8 h-8" />,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
                title: "Crisis & Risk Management",
                desc: "Upload incident reports and let the panel debate the fastest path to mitigation, cross-checking solutions against compliance and security policies."
              }
            ].map((useCase, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.1 }}
                whileHover={{ y: -10 }}
                transition={{ delay: idx * 0.1, y: { type: "spring", stiffness: 300, damping: 20 } }}
                className={`group relative p-8 rounded-3xl text-center space-y-6 overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'bg-[#121215] border border-neutral-800 hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.1)]' : 'bg-white border border-neutral-200 hover:border-violet-500/30 hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)]'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color.replace('text', 'from').replace('500', '500/10')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
                <div className={`relative z-10 w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${useCase.bg} ${useCase.color}`}>
                  {useCase.icon}
                </div>
                <h3 className={`text-xl font-bold relative z-10 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>{useCase.title}</h3>
                <p className={`text-sm leading-relaxed relative z-10 transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-neutral-600 group-hover:text-neutral-700'}`}>{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* 7. CTA Section */}

      <section className={`py-20 md:py-32 px-4 sm:px-6 border-t relative overflow-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-neutral-900/50 border-neutral-800" : "bg-violet-50/50 border-neutral-200"
      }`}>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-8 relative z-10"
        >
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
            Ready to assemble your council?
          </h2>
          <p className={`text-lg font-medium max-w-2xl mx-auto ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Stop relying on a single prompt. Start making bulletproof decisions with the world's most advanced AI debate engine.
          </p>
          <div className="pt-8">
            <button
              onClick={() => onEnter()}
              className="px-10 py-5 bg-violet-600 hover:bg-violet-700 text-white text-base font-black tracking-wide rounded-full transition-all shadow-xl shadow-violet-500/30 flex items-center justify-center gap-3 mx-auto cursor-pointer hover:-translate-y-1 active:scale-95"
            >
              Enter the Arena <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

            {/* 8. Confidentiality & Footer */}
      <div className={`border-t ${theme === 'dark' ? 'border-neutral-800 bg-[#0A0A0B]' : 'border-neutral-200 bg-neutral-50'} pt-24 pb-8`}>
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          
          {/* Confidentiality Block */}
          <div className={`p-6 md:p-8 rounded-2xl border ${theme === 'dark' ? 'border-violet-500/20 bg-violet-500/5' : 'border-violet-500/20 bg-violet-50'} flex flex-col md:flex-row gap-6 items-start max-w-4xl mx-auto`}>
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className={`text-base md:text-lg font-bold tracking-widest uppercase font-mono ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}`}>
                Ephemeral Session Confidentiality
              </h4>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Your data is managed transiently within your secure browser session. The moment you log out or close this tab, your local context is cleared. For external processing, we connect exclusively via secure API to the official endpoints of the models you select.
              </p>
            </div>
          </div>

          {/* New Footer */}
          <footer className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <Logo className="w-8 h-8 grayscale opacity-80" />
                <span className={`text-lg font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
                  YouVo Battleground
                </span>
              </div>
              <p className={`text-base max-w-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                The premier platform for multi-agent dialectic simulation and rigorous AI consensus generation.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className={`text-sm font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Platform</h4>
              <div className="flex flex-col gap-3 text-base font-medium">
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }} className={`transition-colors ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}>How it Works</a>
                <button onClick={() => window.location.hash = 'faq'} className={`text-left transition-colors ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}>FAQ / Case Studies</button>
                <a href="https://youvoai.com" target="_blank" rel="noreferrer" className={`transition-colors ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}>YouVo AI Parent</a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className={`text-sm font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Legal & Support</h4>
              <div className="flex flex-col gap-3 text-base font-medium">
                <button onClick={() => window.location.hash = 'privacy'} className={`text-left transition-colors ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}>Privacy Policy</button>
                <button onClick={() => window.location.hash = 'terms'} className={`text-left transition-colors ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}>Terms of Service</button>
                <a href="mailto:support@youvo.ai" className={`transition-colors ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}>Contact Us</a>
              </div>
            </div>
          </footer>

          <div className="text-center pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
              © 2026 YouVo Battleground. Purely ephemeral dialectic workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


