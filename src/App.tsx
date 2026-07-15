import React, { useState, useEffect, useRef, useMemo } from "react";
import { Speaker, DebateTurn, UserIntervention, ConsensusReport, DebateSession } from "./types";
import SpeakerCard from "./components/SpeakerCard";
import ConsensusReportView from "./components/ConsensusReportView";
import LandingPage from "./components/LandingPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import Logo from "./components/Logo";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Send,
  History,
  Plus,
  Trash2,
  BookOpen,
  ArrowRight,
  Activity,
  UserCheck,
  AlertCircle,
  Clock,
  Award,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Globe,
  Settings2,
  Download,
  ChevronDown,
  ChevronUp,
  Search,
  MessageSquare,
  ArrowLeft,
  Key,
  Eye,
  EyeOff,
  LogOut,
  Sun,
  Moon,
  Mic,
  Radio,
  FileText,
  Image,
  FileCode,
  X,
  CheckCircle,
  Loader2
} from "lucide-react";

// Transient session storage keys (lost when user exits the tab)
const STORAGE_KEY_SESSIONS = "youvo_battleground_sessions";
const STORAGE_KEY_CUSTOM_MODELS = "youvo_battleground_custom_models";

interface ModelItem {
  id: string;
  name: string;
  provider: "OpenAI" | "Anthropic" | "Google AI (Gemini)" | "Groq" | "OpenRouter";
  role: string;
  persona: string;
  color: string;
}

const DEFAULT_MODELS: ModelItem[] = [
  // OpenAI
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    role: "Strategic Flagship Analyst",
    persona: "You are the OpenAI flagship model, GPT-4o. You write in a highly structured, analytical, and articulate style. You prioritize performance, scalability, and clear business metrics. You back up your arguments with logical deductions, structural steps, and balanced cost-benefit analysis. Address points raised by other models directly, calling out any logical fallacies or technical compromises.",
    color: "indigo"
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    role: "Rapid Utility Auditor",
    persona: "You are GPT-4o Mini by OpenAI. You speak concisely, focusing on high-speed implementations, cost optimization, and developer productivity. You prefer lightweight architectures, microservices, and simple, maintainable code over complex enterprise setups.",
    color: "sky"
  },
  {
    id: "o1-mini",
    name: "o1-mini",
    provider: "OpenAI",
    role: "Deep Logical Reasoner",
    persona: "You are OpenAI's o1-mini. You reason in a highly structured, deep, and logical style. You focus on technical details, complex algorithms, system architecture, edge cases, security, and schema normalization. Keep your tone quiet, highly authoritative, and intellectually rigorous.",
    color: "violet"
  },
  // Anthropic
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    role: "Academic Solutions Architect",
    persona: "You are Claude 3.5 Sonnet by Anthropic. You think with academic rigor, deeply valuing safety, type safety (TypeScript), elegant clean code, and robust software design patterns. You write beautifully detailed, thoughtful, and highly comprehensive answers. Your critiques are constructive, well-argued, and balanced.",
    color: "emerald"
  },
  {
    id: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    role: "Swift Pragmatic Engineer",
    persona: "You are Claude 3.5 Haiku by Anthropic. You are highly pragmatic, straightforward, and dislike fluff. You get straight to the point, suggesting lightweight, agile, and immediately implementable solutions.",
    color: "teal"
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    role: "Creative Synthesis Thinker",
    persona: "You are Claude 3 Opus by Anthropic. You think outside the box, exploring unique philosophical viewpoints, socio-technical impacts, and user experience. You speak with warm, masterclass-level eloquence and structural depth.",
    color: "pink"
  },
  // Google AI (Gemini)
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    provider: "Google AI (Gemini)",
    role: "Real-Time Context Synthesizer",
    persona: "You are Gemini 3.5 Flash by Google. You are extremely fast, versatile, and context-aware. You leverage massive context windows, real-time web research, and multimodal links. You write in a modern, highly engaging, tech-forward style.",
    color: "amber"
  },
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    provider: "Google AI (Gemini)",
    role: "Infinite Context Strategist",
    persona: "You are Google's flagship Gemini 3.1 Pro. You leverage immense context, deep reasoning, and advanced multi-disciplinary insights. You analyze complex systems holistically, noting integration bottlenecks, future-proofing strategies, and complex state lifecycles.",
    color: "orange"
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash Lite",
    provider: "Google AI (Gemini)",
    role: "Lean Prototype Developer",
    persona: "You are Gemini 3.1 Flash Lite by Google. You focus on quick prototype iteration, minimal dependencies, and speed. You suggest direct, simple, and standard solutions that can be stood up in hours.",
    color: "rose"
  },
  // Groq
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    provider: "Groq",
    role: "Open Source Advocate",
    persona: "You are Llama 3.3 70B. You are a strong advocate for open-source software, transparent architectures, self-hosting, and avoiding proprietary vendor lock-in. You suggest robust, enterprise-grade open-source tools.",
    color: "cyan"
  },
  {
    id: "llama-3-1-8b",
    name: "Llama 3.1 8B",
    provider: "Groq",
    role: "Distributed Systems Advisor",
    persona: "You are Llama 3.1 8B. You specialize in light-weight distributed architectures, resilient sub-systems, highly efficient server routines, and robust open-source integrations.",
    color: "green"
  },
  // OpenRouter
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "OpenRouter",
    role: "High-Performance Optimizer",
    persona: "You are DeepSeek V3. You are highly performance-tuned, budget-conscious, and mathematically precise. You suggest extremely low-cost, high-performance database indexing and optimized code structures.",
    color: "slate"
  },
  {
    id: "command-r-plus",
    name: "Command R+",
    provider: "OpenRouter",
    role: "Enterprise RAG Expert",
    persona: "You are Cohere's Command R+. You excel in enterprise search, retrieval-augmented generation (RAG), structured JSON outputs, and multilingual integrations.",
    color: "pink"
  }
];

function renderBoldTextInApp(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-extrabold text-neutral-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderSidebarMarkdown(text: string) {
  if (!text) return null;
  
  // Clean text from AI brand models if any
  let cleanText = text;
  cleanText = cleanText.replace(/\bGemini\b/gi, "the cloud-centric panelist");
  cleanText = cleanText.replace(/\bLlama\b/gi, "the open-source advocate");
  cleanText = cleanText.replace(/\bClaude\b/gi, "the analytical panelist");
  cleanText = cleanText.replace(/\bGPT-4o\b/gi, "the developer panelist");
  cleanText = cleanText.replace(/\bOpenAI\b/gi, "the host platform");
  cleanText = cleanText.replace(/\bAnthropic\b/gi, "the assistant");
  cleanText = cleanText.replace(/\bGrok\b/gi, "the real-time panelist");

  const lines = cleanText.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;
        
        // Unordered List Item
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-2">
              <span className="text-violet-500 mt-1 shrink-0">•</span>
              <span className="flex-1 text-neutral-700 leading-relaxed font-semibold">{renderBoldTextInApp(content)}</span>
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
              <div key={idx} className="flex items-start gap-1.5 pl-2">
                <span className="text-violet-500 font-mono font-bold shrink-0 text-xs">{num}.</span>
                <span className="flex-1 text-neutral-700 leading-relaxed font-semibold">{renderBoldTextInApp(content)}</span>
              </div>
            );
          }
        }

        // Header (### or ##)
        if (trimmed.startsWith("### ")) {
          return (
            <h5 key={idx} className="text-xs font-extrabold text-neutral-800 mt-2 mb-0.5">
              {trimmed.substring(4)}
            </h5>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h4 key={idx} className="text-xs font-bold text-neutral-900 mt-2.5 mb-1">
              {trimmed.substring(3)}
            </h4>
          );
        }

        // Default Paragraph
        return (
          <p key={idx} className="text-neutral-700 font-semibold leading-relaxed">
            {renderBoldTextInApp(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function App() {
  // --- STATE ---
  const [view, setView] = useState<"landing" | "draft" | "arena" | "report">("landing");
  const [sessions, setSessions] = useState<DebateSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (sessionStorage.getItem("youvo_theme") as "light" | "dark") || "light";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    sessionStorage.setItem("youvo_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("dark-theme");
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("dark-theme");
    }
  }, [theme]);

  

  const handleLogout = () => {
    sessionStorage.clear();
    setSessions([]);
    setCustomModels([]);
    setView("landing");
  };

  // Personal user-provided API key configurations
  const [apiKeyGemini, setApiKeyGemini] = useState<string>(() => {
    return localStorage.getItem("youvo_api_key_gemini") || localStorage.getItem("youvo_personal_api_key") || "";
  });
  const [apiKeyOpenAI, setApiKeyOpenAI] = useState<string>(() => {
    return localStorage.getItem("youvo_api_key_openai") || "";
  });
  const [apiKeyAnthropic, setApiKeyAnthropic] = useState<string>(() => {
    return localStorage.getItem("youvo_api_key_anthropic") || "";
  });
  const [apiKeyGroq, setApiKeyGroq] = useState<string>(() => {
    return localStorage.getItem("youvo_api_key_groq") || "";
  });
  const [apiKeyOpenRouter, setApiKeyOpenRouter] = useState<string>(() => {
    return localStorage.getItem("youvo_api_key_openrouter") || "";
  });

  const [personalApiKey, setPersonalApiKey] = useState<string>(() => {
    return localStorage.getItem("youvo_api_key_gemini") || localStorage.getItem("youvo_personal_api_key") || "";
  });

  const [valStatus, setValStatus] = useState<Record<string, { loading: boolean; valid?: boolean; message?: string }>>({});

  const handleValidateKey = async (provider: string, apiKey: string, keyName: string) => {
    if (!apiKey || !apiKey.trim()) {
      setValStatus(prev => ({
        ...prev,
        [keyName]: { loading: false, valid: false, message: "Please enter a key first." }
      }));
      return;
    }

    setValStatus(prev => ({
      ...prev,
      [keyName]: { loading: true }
    }));

    try {
      const res = await fetch("/api/keys/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey })
      });
      const data = await res.json();
      setValStatus(prev => ({
        ...prev,
        [keyName]: { loading: false, valid: data.valid, message: data.message }
      }));
    } catch (err: any) {
      setValStatus(prev => ({
        ...prev,
        [keyName]: { loading: false, valid: false, message: "Network error validating key." }
      }));
    }
  };

  const [showKeySettings, setShowKeySettings] = useState<boolean>(false);
  const [showApiKeysDraft, setShowApiKeysDraft] = useState<boolean>(false);

  const handleSaveGeminiKey = (key: string) => {
    setApiKeyGemini(key);
    setPersonalApiKey(key);
    localStorage.setItem("youvo_api_key_gemini", key);
    localStorage.setItem("youvo_personal_api_key", key);
  };

  const handleSaveOpenAIKey = (key: string) => {
    setApiKeyOpenAI(key);
    localStorage.setItem("youvo_api_key_openai", key);
  };

  const handleSaveAnthropicKey = (key: string) => {
    setApiKeyAnthropic(key);
    localStorage.setItem("youvo_api_key_anthropic", key);
  };

  const handleSaveGroqKey = (key: string) => {
    setApiKeyGroq(key);
    localStorage.setItem("youvo_api_key_groq", key);
  };

  const handleSaveOpenRouterKey = (key: string) => {
    setApiKeyOpenRouter(key);
    localStorage.setItem("youvo_api_key_openrouter", key);
  };

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const toggleKeyVisibility = (keyName: string) => {
    setShowKeys((prev) => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  // Drafting view configurations
  const [topic, setTopic] = useState<string>("");
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [webResearch, setWebResearch] = useState<"auto" | "always" | "off">("auto");
  const [presetMode, setPresetMode] = useState<"quick" | "balanced" | "deep" | "custom">("custom");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [maxRounds, setMaxRounds] = useState<number>(2);

  // Custom model creator inline states
  const [showAddCustom, setShowAddCustom] = useState<boolean>(false);
  const [customModelName, setCustomModelName] = useState<string>("");
  const [customModelProvider, setCustomModelProvider] = useState<"OpenAI" | "Anthropic" | "Google AI (Gemini)" | "Groq" | "OpenRouter">("OpenAI");
  const [customModelRole, setCustomModelRole] = useState<string>("");
  const [customModelPersona, setCustomModelPersona] = useState<string>("");
  const [customModelColor, setCustomModelColor] = useState<string>("violet");

  // Custom models loaded from localStorage
  const [customModels, setCustomModels] = useState<ModelItem[]>([]);

  // Accordion toggle state for providers
  const [expandedProviders, setExpandedProviders] = useState<Record<string, boolean>>({
    "OpenAI": false,
    "Anthropic": false,
    "Google AI (Gemini)": true,
    "Groq": false,
    "OpenRouter": false
  });

  // Active debate runtime states
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");
  const [activeTab, setActiveTab] = useState<"arena" | "report" | "transcript">("arena");
  const [interventionInput, setInterventionInput] = useState<string>("");

  // References for autoscrolling and double execution guard
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const arenaMessagesContainerRef = useRef<HTMLDivElement>(null);
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);
  const loopActiveRef = useRef<boolean>(false);

  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) || null;
  }, [sessions, activeSessionId]);

  // Permanent follow-up chat states
  interface FileAttachment {
    name: string;
    type: string;
    base64: string;
    size: number;
  }

  interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    attachments?: FileAttachment[];
  }
  const [followupMessages, setFollowupMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(true);

  // Multimodal File attachments & Speech recognition states/refs
  const [chatAttachments, setChatAttachments] = useState<FileAttachment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Native Speech Recognition Setup
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#privacy') setView('privacy');
      else if (hash === '#terms') setView('terms');
      else if (['#privacy', '#terms'].includes(hash)) setView('landing');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";
      
      rec.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setChatInput((prev) => prev + (prev ? " " : "") + finalTranscript);
        }
      };
      
      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not fully supported or active in this workspace.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setChatAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type,
            base64: base64String,
            size: file.size,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (indexToRemove: number) => {
    setChatAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Primary draft attachment states and handlers
  const [draftAttachments, setDraftAttachments] = useState<FileAttachment[]>([]);
  const draftFileInputRef = useRef<HTMLInputElement>(null);

  const handleDraftFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setDraftAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type,
            base64: base64String,
            size: file.size,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    if (draftFileInputRef.current) draftFileInputRef.current.value = "";
  };

  const removeDraftAttachment = (indexToRemove: number) => {
    setDraftAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Sync follow-up chat messages with active session topic
  useEffect(() => {
    if (!activeSession) {
      setFollowupMessages([]);
      return;
    }
    try {
      const saved = sessionStorage.getItem(`youvo_followup_chat_${activeSession.topic}`);
      setFollowupMessages(saved ? JSON.parse(saved) : []);
    } catch {
      setFollowupMessages([]);
    }
    setChatInput("");
  }, [activeSession?.topic]);

  useEffect(() => {
    if (activeSession) {
      sessionStorage.setItem(`youvo_followup_chat_${activeSession.topic}`, JSON.stringify(followupMessages));
    }
  }, [followupMessages, activeSession?.topic]);

  const scrollToChatBottom = () => {
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTo({
        top: chatMessagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToChatBottom();
  }, [followupMessages, chatLoading]);

  const handleAskQuestion = async (questionText: string, attachmentsToSubmit?: FileAttachment[]) => {
    const currentAttachments = attachmentsToSubmit || chatAttachments;
    const hasAttachments = currentAttachments && currentAttachments.length > 0;
    
    if (!activeSession || !activeSession.consensusReport || (!questionText.trim() && !hasAttachments) || chatLoading) return;

    const userMsg: ChatMessage = { 
      role: "user", 
      content: questionText,
      attachments: hasAttachments ? currentAttachments : undefined
    };
    const updatedHistory = [...followupMessages, userMsg];
    setFollowupMessages(updatedHistory);
    setChatInput("");
    setChatAttachments([]); // Clear current attachments from input bar
    setChatLoading(true);

    try {
      const response = await fetch("/api/debate/followup", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(apiKeyGemini ? { "x-gemini-key": apiKeyGemini, "x-api-key": apiKeyGemini } : {}),
          ...(apiKeyOpenAI ? { "x-openai-key": apiKeyOpenAI } : {}),
          ...(apiKeyAnthropic ? { "x-anthropic-key": apiKeyAnthropic } : {}),
          ...(apiKeyGroq ? { "x-groq-key": apiKeyGroq } : {}),
          ...(apiKeyOpenRouter ? { "x-openrouter-key": apiKeyOpenRouter } : {})
        },
        body: JSON.stringify({
          topic: activeSession.topic,
          report: activeSession.consensusReport,
          speakers: activeSession.speakers,
          history: updatedHistory.map(h => ({ role: h.role, content: h.content })),
          message: questionText,
          attachments: currentAttachments
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = { role: "assistant", content: data.message };
      setFollowupMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Failed to query follow-up chat:", err);
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: `**Error:** Failed to connect to consensus panel. Please try again. (${err.message || err})`,
      };
      setFollowupMessages((prev) => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskQuestion(chatInput);
  };

  // Combine default and custom models
  const allModels = useMemo(() => {
    return [...DEFAULT_MODELS, ...customModels];
  }, [customModels]);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Check Server Connection
    fetch("/api/health")
      .then((res) => {
        if (res.ok) setServerStatus("online");
        else setServerStatus("offline");
      })
      .catch(() => setServerStatus("offline"));

    // Load sessions from sessionStorage
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_SESSIONS);
      if (stored) {
        const parsed = JSON.parse(stored) as DebateSession[];
        setSessions(parsed);
      }
    } catch (e) {
      console.error("Failed to load saved sessions", e);
    }

    // Load custom models from sessionStorage
    try {
      const storedCustom = sessionStorage.getItem(STORAGE_KEY_CUSTOM_MODELS);
      if (storedCustom) {
        setCustomModels(JSON.parse(storedCustom));
      }
    } catch (e) {
      console.error("Failed to load custom models", e);
    }

    // Restore active session state, view, and tab
    try {
      const storedActiveId = sessionStorage.getItem("youvo_active_session_id");
      if (storedActiveId) {
        setActiveSessionId(storedActiveId);
      }
      const storedView = sessionStorage.getItem("youvo_current_view");
      if (storedView) {
        setView(storedView as any);
      }
      const storedTab = sessionStorage.getItem("youvo_active_tab");
      if (storedTab) {
        setActiveTab(storedTab as any);
      }
    } catch (e) {
      console.error("Failed to restore active view states", e);
    }
  }, []);

  // Sync sessions to sessionStorage (even when empty)
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  // Sync custom models to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_CUSTOM_MODELS, JSON.stringify(customModels));
  }, [customModels]);

  // Sync active session, view, and activeTab to sessionStorage
  useEffect(() => {
    if (activeSessionId) {
      sessionStorage.setItem("youvo_active_session_id", activeSessionId);
    } else {
      sessionStorage.removeItem("youvo_active_session_id");
    }
  }, [activeSessionId]);

  useEffect(() => {
    sessionStorage.setItem("youvo_current_view", view);
  }, [view]);

  useEffect(() => {
    sessionStorage.setItem("youvo_active_tab", activeTab);
  }, [activeTab]);

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this debate session and its consensus report?")) {
      const updatedSessions = sessions.filter((s) => s.id !== sessionId);
      setSessions(updatedSessions);
      if (activeSessionId === sessionId) {
        if (updatedSessions.length > 0) {
          setActiveSessionId(updatedSessions[0].id);
        } else {
          setActiveSessionId(null);
          setView("draft");
        }
      }
    }
  };

  // Autoscroll transcript
  useEffect(() => {
    if (activeTab === "arena" && activeSession?.status !== "completed" && arenaMessagesContainerRef.current) {
      arenaMessagesContainerRef.current.scrollTo({
        top: arenaMessagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [activeSession?.turns, activeSession?.status, isThinking, activeTab]);

  // Scroll report to top when report tab becomes active
  useEffect(() => {
    if (activeTab === "report") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const container = document.getElementById("report-scroll-container");
      if (container) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [activeTab]);

  // --- CORE DEBATE EXECUTION LOOP ---
  useEffect(() => {
    let timeoutId: any = null;

    const executeNextTurn = async () => {
      if (!activeSession || activeSession.status !== "running" || isThinking || loopActiveRef.current) return;

      loopActiveRef.current = true;
      setIsThinking(true);

      const currentSpeaker = activeSession.speakers[activeSession.currentSpeakerIndex];

      try {
        const response = await fetch("/api/debate/next-turn", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(apiKeyGemini ? { "x-gemini-key": apiKeyGemini, "x-api-key": apiKeyGemini } : {}),
            ...(apiKeyOpenAI ? { "x-openai-key": apiKeyOpenAI } : {}),
            ...(apiKeyAnthropic ? { "x-anthropic-key": apiKeyAnthropic } : {}),
            ...(apiKeyGroq ? { "x-groq-key": apiKeyGroq } : {}),
            ...(apiKeyOpenRouter ? { "x-openrouter-key": apiKeyOpenRouter } : {})
          },
          body: JSON.stringify({
            topic: activeSession.topic,
            speaker: currentSpeaker,
            allSpeakers: activeSession.speakers,
            turns: activeSession.turns,
            userInterventions: activeSession.userInterventions,
            currentRound: activeSession.currentRound,
            model: currentSpeaker.id,
            attachments: activeSession.attachments || []
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `HTTP error ${response.status}`);
        }

        const data = await response.json();

        const newTurn: DebateTurn = {
          id: `turn-${Date.now()}`,
          speakerId: currentSpeaker.id,
          speakerName: currentSpeaker.name,
          speakerRole: currentSpeaker.role,
          speakerColor: currentSpeaker.color,
          message: data.message,
          round: activeSession.currentRound,
          timestamp: new Date().toISOString(),
        };

        let nextSpeakerIndex = activeSession.currentSpeakerIndex + 1;
        let nextRound = activeSession.currentRound;
        let nextStatus = activeSession.status;

        if (nextSpeakerIndex >= activeSession.speakers.length) {
          nextSpeakerIndex = 0;
          nextRound += 1;
        }

        if (nextRound > activeSession.maxRounds) {
          nextStatus = "synthesizing";
        }

        setSessions((prevSessions) =>
          prevSessions.map((s) => {
            if (s.id === activeSession.id) {
              return {
                ...s,
                turns: [...s.turns, newTurn],
                currentSpeakerIndex: nextSpeakerIndex,
                currentRound: nextRound,
                status: nextStatus,
              };
            }
            return s;
          })
        );
      } catch (err: any) {
        console.error("Error generating turn:", err);
        setSessions((prevSessions) =>
          prevSessions.map((s) => {
            if (s.id === activeSession.id) {
              return {
                ...s,
                status: "error",
                error: err.message || "An unexpected error occurred during simulation.",
              };
            }
            return s;
          })
        );
      } finally {
        setIsThinking(false);
        loopActiveRef.current = false;
      }
    };

    if (activeSession && activeSession.status === "running" && !isThinking) {
      timeoutId = setTimeout(executeNextTurn, 400);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeSession?.status, activeSession?.currentSpeakerIndex, activeSession?.currentRound, isThinking]);

  // --- AUTOMATED SYNTHESIS TRIGGER ---
  useEffect(() => {
    const runSynthesis = async () => {
      if (!activeSession || activeSession.status !== "synthesizing" || loopActiveRef.current) return;

      loopActiveRef.current = true;
      try {
        const response = await fetch("/api/debate/synthesize", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(apiKeyGemini ? { "x-gemini-key": apiKeyGemini, "x-api-key": apiKeyGemini } : {}),
            ...(apiKeyOpenAI ? { "x-openai-key": apiKeyOpenAI } : {}),
            ...(apiKeyAnthropic ? { "x-anthropic-key": apiKeyAnthropic } : {}),
            ...(apiKeyGroq ? { "x-groq-key": apiKeyGroq } : {}),
            ...(apiKeyOpenRouter ? { "x-openrouter-key": apiKeyOpenRouter } : {})
          },
          body: JSON.stringify({
            topic: activeSession.topic,
            turns: activeSession.turns,
            allSpeakers: activeSession.speakers,
            model: "gemini-3.5-flash" // Use extremely fast and highly-available model for synthesis report
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `HTTP error ${response.status}`);
        }

        const report = (await response.json()) as ConsensusReport;

        setSessions((prevSessions) =>
          prevSessions.map((s) => {
            if (s.id === activeSession.id) {
              return {
                ...s,
                status: "completed",
                consensusReport: report,
              };
            }
            return s;
          })
        );
        setActiveTab("report");
        setView("arena"); // Redirect to the active workspace on report tab
      } catch (err: any) {
        console.error("Error synthesizing report:", err);
        setSessions((prevSessions) =>
          prevSessions.map((s) => {
            if (s.id === activeSession.id) {
              return {
                ...s,
                status: "error",
                error: `Synthesis failed: ${err.message}`,
              };
            }
            return s;
          })
        );
      } finally {
        loopActiveRef.current = false;
      }
    };

    if (activeSession && activeSession.status === "synthesizing") {
      runSynthesis();
    }
  }, [activeSession?.status]);

  // --- ACTIONS ---
  const handleLaunchDebate = () => {
    if (!topic.trim()) {
      alert("Please specify what the AI minds should figure out.");
      return;
    }
    if (selectedModelIds.length === 0) {
      alert("Please select at least 1 AI model for the council.");
      return;
    }

    // Map selected model IDs to Speaker configurations
    const speakersList: Speaker[] = selectedModelIds.map((mid) => {
      const found = allModels.find((m) => m.id === mid);
      return {
        id: found?.id || `sim-spk-${mid}`,
        name: found ? found.name : `Model ${mid}`,
        role: found?.role || "Specialist Reasoning AI",
        persona: found?.persona || `You are the AI model ${mid}. Act as an expert panelist in this debate.`,
        color: found?.color || "indigo",
        avatarSeed: mid,
        provider: found?.provider || "Google AI (Gemini)"
      };
    });

    const newSession: DebateSession = {
      id: `sess-${Date.now()}`,
      topic: topic,
      speakers: speakersList,
      turns: [],
      userInterventions: [],
      status: "running", // Auto-start the battleground
      currentRound: 1,
      currentSpeakerIndex: 0,
      maxRounds: maxRounds,
      createdAt: new Date().toISOString(),
      model: "gemini-3.5-flash",
      attachments: draftAttachments
    };

    setSessions([newSession, ...sessions]);
    setDraftAttachments([]); // Clear the draft attachments state
    setActiveSessionId(newSession.id);
    setActiveTab("arena");
    setView("arena");
  };

  const handleStartResume = () => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) return { ...s, status: "running" };
        return s;
      })
    );
  };

  const handlePause = () => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) return { ...s, status: "paused" };
        return s;
      })
    );
  };

  const handleForceSynthesis = () => {
    if (!activeSession) return;
    if (activeSession.turns.length < 1) {
      alert("Wait for at least 1 model statement before synthesizing consensus.");
      return;
    }
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) return { ...s, status: "synthesizing" };
        return s;
      })
    );
  };

  const handleSendIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !interventionInput.trim()) return;

    const newIntervention: UserIntervention = {
      id: `interv-${Date.now()}`,
      round: activeSession.currentRound,
      message: interventionInput.trim(),
      timestamp: new Date().toISOString(),
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            userInterventions: [...s.userInterventions, newIntervention],
          };
        }
        return s;
      })
    );

    setInterventionInput("");
  };

  const handleExportFullTranscript = () => {
    if (!activeSession) return;

    let transcriptText = `# YOUVO BATTLEGROUND DETAILED DEBATE LOG
Topic: ${activeSession.topic}
Created On: ${new Date(activeSession.createdAt).toLocaleString()}
Models Engaged: ${activeSession.speakers.map((s) => s.name).join(", ")}

=========================================
DEBATE TRANSCRIPT
=========================================
`;

    activeSession.turns.forEach((turn) => {
      transcriptText += `\n[Round ${turn.round}] ${turn.speakerName}:\n"${turn.message}"\n---------------------\n`;
    });

    if (activeSession.userInterventions.length > 0) {
      transcriptText += `\n=========================================\nMODERATOR INTERVENTIONS\n=========================================\n`;
      activeSession.userInterventions.forEach((int) => {
        transcriptText += `- [Round ${int.round}] Injected Guidance: ${int.message}\n`;
      });
    }

    if (activeSession.consensusReport) {
      const r = activeSession.consensusReport;
      transcriptText += `\n=========================================\nCONSENSUS COGNITIVE SYNTHESIS REPORT\n=========================================\n`;
      transcriptText += `Consensus Alignment: ${r.consensusScore}%\n\n`;
      transcriptText += `Executive Summary:\n${r.executiveSummary}\n\n`;
      transcriptText += `Core Points of Agreement:\n${r.keyAgreements.map((a) => `- ${a}`).join("\n")}\n\n`;
      transcriptText += `Key Tensions & Disagreements:\n${r.keyDisagreements.map((d) => `- ${d}`).join("\n")}\n\n`;
      transcriptText += `Action Roadmap:\n${r.actionSteps.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}\n\n`;
      transcriptText += `Consolidated Final Verdict:\n${r.finalVerdict}\n`;
    }

    const blob = new Blob([transcriptText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `youvo-battleground-${activeSession.id}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Preset configuration change
  const handlePresetChange = (mode: "quick" | "balanced" | "deep" | "custom") => {
    setPresetMode(mode);
    if (mode === "quick") {
      setSelectedModelIds(["gemini-3.5-flash", "llama-3-3-70b"]);
      setMaxRounds(2);
    } else if (mode === "balanced") {
      setSelectedModelIds(["gemini-3.5-flash", "llama-3-3-70b", "claude-3-5-sonnet"]);
      setMaxRounds(2);
    } else if (mode === "deep") {
      setSelectedModelIds(["gemini-3.1-pro", "llama-3-3-70b", "claude-3-5-sonnet", "gpt-4o"]);
      setMaxRounds(3);
    }
  };

  // Handle checking/unchecking custom models
  const toggleModelSelection = (modelId: string) => {
    setPresetMode("custom"); // Change preset mode to custom if the user interacts with individual boxes
    setSelectedModelIds((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    );
  };

  const handleAddCustomModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customModelName.trim() || !customModelPersona.trim() || !customModelRole.trim()) {
      alert("Please fill in all details for your custom model.");
      return;
    }

    const newId = `custom-model-${Date.now()}`;
    const newModelItem: ModelItem = {
      id: newId,
      name: customModelName.trim(),
      provider: customModelProvider,
      role: customModelRole.trim(),
      persona: customModelPersona.trim(),
      color: customModelColor
    };

    setCustomModels([...customModels, newModelItem]);
    setSelectedModelIds([...selectedModelIds, newId]);
    setPresetMode("custom");

    // Reset inline form
    setCustomModelName("");
    setCustomModelRole("");
    setCustomModelPersona("");
    setShowAddCustom(false);
  };

  const toggleProvider = (providerName: string) => {
    setExpandedProviders((prev) => ({
      ...prev,
      [providerName]: !prev[providerName]
    }));
  };

  // Filter models based on search query
  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return allModels;
    return allModels.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allModels, searchQuery]);

  // Group models by provider
  const modelsByProvider = useMemo(() => {
    const groups: Record<string, ModelItem[]> = {
      "OpenAI": [],
      "Anthropic": [],
      "Google AI (Gemini)": [],
      "Groq": [],
      "OpenRouter": []
    };
    filteredModels.forEach((m) => {
      if (groups[m.provider]) {
        groups[m.provider].push(m);
      } else {
        groups[m.provider] = [m];
      }
    });
    return groups;
  }, [filteredModels]);

  // Track active model providers based on selected models
  const activeProviders = useMemo(() => {
    const providers = new Set<string>();
    selectedModelIds.forEach((mid) => {
      const found = allModels.find((m) => m.id === mid);
      if (found) {
        providers.add(found.provider);
      }
    });
    return providers;
  }, [selectedModelIds, allModels]);

  const isAnyKeyMissing = useMemo(() => {
    return Array.from(activeProviders).some((provider) => {
      if (provider === "Google AI (Gemini)") return !apiKeyGemini;
      if (provider === "OpenAI") return !apiKeyOpenAI;
      if (provider === "Anthropic") return !apiKeyAnthropic;
      if (provider === "Groq") return !apiKeyGroq;
      if (provider === "OpenRouter") return !apiKeyOpenRouter;
      return false;
    });
  }, [activeProviders, apiKeyGemini, apiKeyOpenAI, apiKeyAnthropic, apiKeyGroq, apiKeyOpenRouter]);

  const showLeftChat = !!(activeSession?.consensusReport && (followupMessages.length > 0 || chatLoading));

  const renderChatbotContent = (isSidebar: boolean) => {
    if (!activeSession?.consensusReport) return null;

    return (
      <div className={`flex flex-col overflow-hidden ${
        isSidebar 
          ? "w-full h-full" 
          : `border-t transition-all duration-300 ${
              isChatExpanded 
                ? (followupMessages.length === 0 && !chatLoading ? "h-[145px]" : "h-[320px]") 
                : "h-12"
            }`
      } ${
        theme === "dark"
          ? "text-neutral-200 bg-[#121214]"
          : "text-neutral-850 bg-white"
      }`}>
        {/* Chat Header */}
        <div className={`h-12 border-b px-4 sm:px-6 flex items-center justify-between shrink-0 select-none ${
          theme === "dark" ? "border-neutral-800/80 bg-[#121214]" : "border-neutral-200/80 bg-white"
        }`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <MessageSquare className="w-4 h-4 text-violet-500 animate-pulse shrink-0" />
            <div className="flex items-center gap-2 min-w-0">
              <span className={`text-xs font-mono font-bold tracking-widest uppercase truncate ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}>Interactive Consultation</span>
              <span className={theme === "dark" ? "text-neutral-700" : "text-neutral-300"}>|</span>
              <span className={`text-xs font-bold truncate ${theme === "dark" ? "text-neutral-200" : "text-neutral-800"}`}>Discuss with Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {followupMessages.length > 0 && (isChatExpanded || isSidebar) && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear the discussion history?")) {
                    setFollowupMessages([]);
                  }
                }}
                className={`text-xs font-mono flex items-center gap-1 transition-colors font-bold uppercase tracking-wider cursor-pointer border-0 bg-transparent ${
                  theme === "dark" ? "text-neutral-400 hover:text-red-400" : "text-neutral-500 hover:text-red-600"
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            )}
            {!isSidebar && (
              <button
                onClick={() => setIsChatExpanded(!isChatExpanded)}
                className={`p-1 rounded transition-colors cursor-pointer border-0 bg-transparent ${
                  theme === "dark" ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-neutral-950"
                }`}
                title={isChatExpanded ? "Collapse panel" : "Expand panel"}
              >
                {isChatExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-500 animate-pulse">Consult Panel</span>
                    <ChevronUp className="w-4 h-4" />
                  </div>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Chat Content */}
        {((!isSidebar && isChatExpanded) || isSidebar) && (
          <div className={`flex-1 flex flex-col overflow-hidden min-h-0 ${
            theme === "dark" ? "bg-[#0E0E11]" : "bg-neutral-50"
          }`}>
            
            {/* Messages area */}
            {(followupMessages.length > 0 || chatLoading) && (
              <div ref={chatMessagesContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
                {followupMessages.length === 0 ? null : (
                  <div className="space-y-4 max-w-3xl mx-auto w-full">
                    {followupMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3.5 ${
                          msg.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center border font-bold text-xs select-none ${
                            msg.role === "user"
                              ? (theme === "dark" ? "bg-[#212124] text-neutral-200 border-neutral-800" : "bg-neutral-100 text-neutral-800 border-neutral-200")
                              : "bg-violet-600 text-white border-violet-700 shadow-md"
                          }`}
                        >
                          {msg.role === "user" ? "U" : <Sparkles className="w-3.5 h-3.5 text-violet-100" />}
                        </div>

                        {/* Bubble content */}
                        <div
                          className={`p-3 rounded-2xl shadow-md text-xs leading-relaxed max-w-[80%] ${
                            msg.role === "user"
                              ? "bg-violet-600 text-white rounded-tr-none font-semibold"
                              : (theme === "dark"
                                  ? "bg-[#17171B] text-neutral-200 border border-neutral-800 rounded-tl-none font-semibold"
                                  : "bg-white text-neutral-800 border border-neutral-200 rounded-tl-none font-semibold")
                          }`}
                        >
                          {msg.role === "user" ? (
                            <div className="space-y-2.5">
                              {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-violet-500/40">
                                  {msg.attachments.map((att, idx) => {
                                    const isImg = att.type.startsWith("image/");
                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 p-1.5 rounded-lg bg-violet-700/60 text-white border border-violet-500/50 max-w-[190px] min-w-[120px] shadow-sm"
                                      >
                                        {isImg ? (
                                          <img
                                            src={att.base64}
                                            alt={att.name}
                                            className="w-8 h-8 rounded object-cover flex-shrink-0 bg-neutral-900 border border-violet-450"
                                            referrerPolicy="no-referrer"
                                          />
                                        ) : att.type === "application/pdf" ? (
                                          <div className="w-8 h-8 rounded bg-red-950/40 border border-red-550/30 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-4 h-4 text-red-200" />
                                          </div>
                                        ) : (
                                          <div className="w-8 h-8 rounded bg-violet-900/40 border border-violet-450/30 flex items-center justify-center flex-shrink-0">
                                            <FileCode className="w-4 h-4 text-violet-200" />
                                          </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                          <p className="text-xs font-black truncate leading-tight">
                                            {att.name}
                                          </p>
                                          <p className="text-[8px] opacity-75 font-mono">
                                            {(att.size / 1024).toFixed(1)} KB
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {renderSidebarMarkdown(msg.content)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {chatLoading && (
                  <div className="flex items-start gap-3.5 max-w-3xl mx-auto w-full animate-pulse">
                    <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md border border-violet-700 animate-spin">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className={`p-3 rounded-2xl border rounded-tl-none font-mono text-xs font-bold flex items-center gap-2 ${
                      theme === "dark" ? "bg-[#17171B] text-neutral-400 border-neutral-800" : "bg-white text-neutral-500 border-neutral-200"
                    }`}>
                      Synthesizing panel stances...
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input Section */}
            <div className={`px-4 sm:px-6 py-3 border-t shrink-0 ${
              theme === "dark" ? "border-neutral-800 bg-[#121214]" : "border-neutral-200 bg-white"
            }`}>
              
              {/* Suggestions */}
              {followupMessages.length === 0 && (
                <div className="max-w-3xl mx-auto mb-3">
                  <span className={`text-[8px] font-mono uppercase tracking-widest font-extrabold block mb-1 text-center ${
                    theme === "dark" ? "text-neutral-500" : "text-neutral-400"
                  }`}>Suggested Topics</span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "Explain Phase 1 of the action roadmap.",
                      "What are the core technical prerequisites?",
                      "How can we address the main risks/cons?",
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={chatLoading}
                        onClick={() => handleAskQuestion(q)}
                        className={`text-center text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm truncate max-w-xs border ${
                          theme === "dark"
                            ? "text-neutral-300 hover:text-white bg-[#17171B] hover:bg-[#212124] border-neutral-800 hover:border-neutral-700"
                            : "text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}              {/* File Attachment Chips and Input bar styled exactly like ChatGPT */}
              <div className="max-w-3xl mx-auto w-full relative flex flex-col items-stretch space-y-2">
                
                {/* Hidden input file element */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,application/pdf,text/*"
                  className="hidden"
                />

                {/* Elegant File Attachment Chips rendering above the input bar */}
                {chatAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-100/50 dark:bg-neutral-900/40 rounded-xl border border-neutral-200/50 dark:border-neutral-800 animate-fade-in max-h-24 overflow-y-auto">
                    {chatAttachments.map((att, idx) => {
                      const isImg = att.type.startsWith("image/");
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-lg bg-white dark:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 shadow-sm"
                        >
                          {isImg ? (
                            <img
                              src={att.base64}
                              alt={att.name}
                              className="w-5 h-5 rounded object-cover flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : att.type === "application/pdf" ? (
                            <FileText className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                          ) : (
                            <FileCode className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                          )}
                          <span className="font-semibold max-w-[110px] truncate">{att.name}</span>
                          <span className="text-xs text-neutral-400 font-mono">({(att.size / 1024).toFixed(0)}kb)</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="p-0.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer border-0"
                            title="Remove file"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pulsing speech recognition alert banner if active */}
                {isListening && (
                  <div className="flex items-center justify-between px-4 py-2 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-pulse">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                      <span>Listening actively... Speak your query directly.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (recognitionRef.current) {
                          recognitionRef.current.stop();
                          setIsListening(false);
                        }
                      }}
                      className="text-xs font-mono uppercase bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 px-2 py-0.5 rounded font-black cursor-pointer border-0"
                    >
                      Stop mic
                    </button>
                  </div>
                )}

                <form onSubmit={handleChatFormSubmit} className={`w-full relative flex items-center gap-2.5 rounded-full px-4 py-2 shadow-sm border transition-all ${
                  theme === "dark"
                    ? "bg-[#17171B] border-neutral-800 focus-within:border-neutral-700"
                    : "bg-neutral-50 border-neutral-200 focus-within:border-neutral-300"
                }`}>
                  {/* Left Plus icon for file trigger */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={chatLoading}
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-0 cursor-pointer disabled:opacity-50 ${
                      theme === "dark" ? "bg-neutral-800 text-neutral-400 hover:text-white" : "bg-neutral-200 text-neutral-600 hover:text-neutral-900"
                    }`}
                    title="Add image, PDF, or text document"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  
                  <input
                    type="text"
                    disabled={chatLoading}
                    placeholder={chatLoading ? "Consulting..." : "Ask follow-up questions to the consensus panel..."}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className={`flex-1 bg-transparent border-0 text-xs focus:outline-none focus:ring-0 font-sans font-semibold disabled:opacity-50 py-1 ${
                      theme === "dark" ? "text-white placeholder-neutral-500" : "text-neutral-850 placeholder-neutral-400"
                    }`}
                  />

                  {/* Mic and Waves buttons */}
                  <div className={`flex items-center gap-2 shrink-0 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                    <button
                      type="button"
                      onClick={toggleListening}
                      disabled={chatLoading}
                      className={`transition-colors bg-transparent border-0 cursor-pointer p-1 rounded-lg ${
                        isListening 
                          ? "text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 animate-pulse" 
                          : "hover:text-neutral-950 dark:hover:text-white"
                      }`}
                      title={isListening ? "Stop listening" : "Voice consultation"}
                    >
                      <Mic className={`w-4 h-4 ${isListening ? "text-rose-600" : ""}`} />
                    </button>
                    {isListening && (
                      <button
                        type="button"
                        className="hover:text-neutral-950 dark:hover:text-white transition-colors bg-transparent border-0 cursor-pointer animate-bounce"
                        title="Waveform indicator active"
                      >
                        <Radio className="w-4 h-4 text-rose-500" />
                      </button>
                    )}
                  </div>

                  {/* Circle Send Button */}
                  <button
                    type="submit"
                    disabled={chatLoading || (!chatInput.trim() && chatAttachments.length === 0)}
                    className={`w-7 h-7 rounded-full transition-all cursor-pointer flex items-center justify-center shadow border-0 shrink-0 ml-1 ${
                      theme === "dark"
                        ? "bg-white text-black hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-white"
                        : "bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-neutral-900"
                    }`}
                    title="Send inquiry"
                  >
                    <Send className="w-3 h-3 fill-current" />
                  </button>
                </form>
                
                {/* ChatGPT style Footer */}
                <div className={`text-xs font-bold tracking-wide mt-1 text-center ${
                  theme === "dark" ? "text-neutral-500" : "text-neutral-400"
                }`}>
                  YouVo Panel can make mistakes. Verify important information.
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    );
  };

  // --- RENDERING ---
  if (view === "privacy") {
    return <PrivacyPolicy onBack={() => { window.location.hash = ''; setView("landing"); }} theme={theme} />;
  }
  if (view === "terms") {
    return <TermsOfService onBack={() => { window.location.hash = ''; setView("landing"); }} theme={theme} />;
  }
  if (view === "landing") {
    return <LandingPage onEnter={() => setView("draft")} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-violet-100 selection:text-violet-900 transition-colors duration-300 ${
      theme === "dark" ? "bg-[#0E0E11] text-neutral-100 dark-theme" : "bg-[#F9F9FB] text-neutral-800"
    }`}>
      
      {/* 1. Header Navigation Bar */}
      <header className={`h-20 border-b px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-2xl transition-all ${
        theme === "dark"
          ? "border-neutral-800/50 bg-[#0E0E11]/80 text-white"
          : "border-neutral-200/50 bg-white/80 text-neutral-900"
      }`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView("draft")}>
            <div className="group-hover:scale-105 transition-transform"><Logo className="w-10 h-10 rounded-xl shadow-lg border border-neutral-200/50 dark:border-neutral-800" /></div>
            <div className="flex flex-col">
              <span className={`text-lg font-black tracking-tight leading-none ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
                YouVo Battleground
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-violet-500 mt-1">
                AI Debate Arena
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-3 pl-6 border-l border-neutral-200 dark:border-neutral-800">
            <span className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-[10px] font-mono tracking-widest font-bold border border-neutral-200 dark:border-neutral-800 flex items-center gap-2 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Workspace Active
            </span>
          </div>
        </div>

        {/* Action Button & API status */}
        <div className="flex items-center gap-4">
          
          

          {/* User Personal Key Configuration Input */}
          <div className="relative">
            <button
              onClick={() => setShowKeySettings(!showKeySettings)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102 ${
                [apiKeyGemini, apiKeyOpenAI, apiKeyAnthropic, apiKeyGroq, apiKeyOpenRouter].filter(Boolean).length > 0 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
              title="Configure Personal API Keys"
            >
              <Key className="w-3.5 h-3.5" />
              {[apiKeyGemini, apiKeyOpenAI, apiKeyAnthropic, apiKeyGroq, apiKeyOpenRouter].filter(Boolean).length > 0
                ? `${[apiKeyGemini, apiKeyOpenAI, apiKeyAnthropic, apiKeyGroq, apiKeyOpenRouter].filter(Boolean).length} Key${[apiKeyGemini, apiKeyOpenAI, apiKeyAnthropic, apiKeyGroq, apiKeyOpenRouter].filter(Boolean).length > 1 ? "s" : ""} Loaded`
                : "Set API Keys"}
            </button>
            
            {showKeySettings && (
              <div className="absolute right-0 mt-2 w-80 p-5 bg-white border border-neutral-200 rounded-2xl shadow-xl z-50 space-y-4 text-left animate-fade-in max-h-[480px] overflow-y-auto">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-neutral-900 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-[#8B5CF6]" />
                    Configure API Keys
                  </h4>
                  <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                    Provide your own API keys to run simulations using actual, full-fidelity models. Keys are saved securely in your browser.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {/* Gemini Key */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-neutral-500 font-mono tracking-wider">Gemini API Key</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleValidateKey("Google AI (Gemini)", apiKeyGemini, "gemini")}
                          className="text-xs font-extrabold text-violet-600 hover:text-violet-800 bg-transparent border-0 cursor-pointer p-0"
                          disabled={valStatus["gemini"]?.loading}
                        >
                          {valStatus["gemini"]?.loading ? "Verifying..." : "Validate"}
                        </button>
                        <span className="text-neutral-300 text-xs">|</span>
                        <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-violet-600 hover:underline">Get Key ↗</a>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type={showKeys["gemini"] ? "text" : "password"}
                        placeholder="AIzaSy..."
                        value={apiKeyGemini}
                        onChange={(e) => handleSaveGeminiKey(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-3 pr-8 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility("gemini")}
                        className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                      >
                        {showKeys["gemini"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {valStatus["gemini"] && (
                      <div className={`text-xs p-2 rounded-lg font-semibold leading-snug flex items-start gap-1.5 ${
                        valStatus["gemini"].loading
                          ? "bg-neutral-50 text-neutral-600"
                          : valStatus["gemini"].valid
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            : "bg-red-50 text-red-800 border border-red-100"
                      }`}>
                        {valStatus["gemini"].loading ? (
                          <Loader2 className="w-3.5 h-3.5 text-neutral-500 animate-spin shrink-0 mt-0.5" />
                        ) : valStatus["gemini"].valid ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <span>{valStatus["gemini"].message || (valStatus["gemini"].loading ? "Connecting to Google AI..." : "Key is invalid.")}</span>
                      </div>
                    )}
                  </div>

                  {/* OpenAI Key */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-neutral-500 font-mono tracking-wider">OpenAI API Key</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleValidateKey("OpenAI", apiKeyOpenAI, "openai")}
                          className="text-xs font-extrabold text-violet-600 hover:text-violet-800 bg-transparent border-0 cursor-pointer p-0"
                          disabled={valStatus["openai"]?.loading}
                        >
                          {valStatus["openai"]?.loading ? "Verifying..." : "Validate"}
                        </button>
                        <span className="text-neutral-300 text-xs">|</span>
                        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-violet-600 hover:underline">Get Key ↗</a>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type={showKeys["openai"] ? "text" : "password"}
                        placeholder="sk-proj-..."
                        value={apiKeyOpenAI}
                        onChange={(e) => handleSaveOpenAIKey(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-3 pr-8 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility("openai")}
                        className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                      >
                        {showKeys["openai"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {valStatus["openai"] && (
                      <div className={`text-xs p-2 rounded-lg font-semibold leading-snug flex items-start gap-1.5 ${
                        valStatus["openai"].loading
                          ? "bg-neutral-50 text-neutral-600"
                          : valStatus["openai"].valid
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            : "bg-red-50 text-red-800 border border-red-100"
                      }`}>
                        {valStatus["openai"].loading ? (
                          <Loader2 className="w-3.5 h-3.5 text-neutral-500 animate-spin shrink-0 mt-0.5" />
                        ) : valStatus["openai"].valid ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <span>{valStatus["openai"].message || (valStatus["openai"].loading ? "Connecting to OpenAI..." : "Key is invalid.")}</span>
                      </div>
                    )}
                  </div>

                  {/* Anthropic Key */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-neutral-500 font-mono tracking-wider">Anthropic API Key</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleValidateKey("Anthropic", apiKeyAnthropic, "anthropic")}
                          className="text-xs font-extrabold text-violet-600 hover:text-violet-800 bg-transparent border-0 cursor-pointer p-0"
                          disabled={valStatus["anthropic"]?.loading}
                        >
                          {valStatus["anthropic"]?.loading ? "Verifying..." : "Validate"}
                        </button>
                        <span className="text-neutral-300 text-xs">|</span>
                        <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-violet-600 hover:underline">Get Key ↗</a>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type={showKeys["anthropic"] ? "text" : "password"}
                        placeholder="sk-ant-..."
                        value={apiKeyAnthropic}
                        onChange={(e) => handleSaveAnthropicKey(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-3 pr-8 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility("anthropic")}
                        className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                      >
                        {showKeys["anthropic"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {valStatus["anthropic"] && (
                      <div className={`text-xs p-2 rounded-lg font-semibold leading-snug flex items-start gap-1.5 ${
                        valStatus["anthropic"].loading
                          ? "bg-neutral-50 text-neutral-600"
                          : valStatus["anthropic"].valid
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            : "bg-red-50 text-red-800 border border-red-100"
                      }`}>
                        {valStatus["anthropic"].loading ? (
                          <Loader2 className="w-3.5 h-3.5 text-neutral-500 animate-spin shrink-0 mt-0.5" />
                        ) : valStatus["anthropic"].valid ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <span>{valStatus["anthropic"].message || (valStatus["anthropic"].loading ? "Connecting to Anthropic..." : "Key is invalid.")}</span>
                      </div>
                    )}
                  </div>

                  {/* Groq Key */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-neutral-500 font-mono tracking-wider">Groq API Key</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleValidateKey("Groq", apiKeyGroq, "groq")}
                          className="text-xs font-extrabold text-violet-600 hover:text-violet-800 bg-transparent border-0 cursor-pointer p-0"
                          disabled={valStatus["groq"]?.loading}
                        >
                          {valStatus["groq"]?.loading ? "Verifying..." : "Validate"}
                        </button>
                        <span className="text-neutral-300 text-xs">|</span>
                        <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-violet-600 hover:underline">Get Key ↗</a>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type={showKeys["groq"] ? "text" : "password"}
                        placeholder="gsk_..."
                        value={apiKeyGroq}
                        onChange={(e) => handleSaveGroqKey(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-3 pr-8 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility("groq")}
                        className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                      >
                        {showKeys["groq"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {valStatus["groq"] && (
                      <div className={`text-xs p-2 rounded-lg font-semibold leading-snug flex items-start gap-1.5 ${
                        valStatus["groq"].loading
                          ? "bg-neutral-50 text-neutral-600"
                          : valStatus["groq"].valid
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            : "bg-red-50 text-red-800 border border-red-100"
                      }`}>
                        {valStatus["groq"].loading ? (
                          <Loader2 className="w-3.5 h-3.5 text-neutral-500 animate-spin shrink-0 mt-0.5" />
                        ) : valStatus["groq"].valid ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <span>{valStatus["groq"].message || (valStatus["groq"].loading ? "Connecting to Groq..." : "Key is invalid.")}</span>
                      </div>
                    )}
                  </div>

                  {/* OpenRouter Key */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-neutral-500 font-mono tracking-wider">OpenRouter API Key</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleValidateKey("OpenRouter", apiKeyOpenRouter, "openrouter")}
                          className="text-xs font-extrabold text-violet-600 hover:text-violet-800 bg-transparent border-0 cursor-pointer p-0"
                          disabled={valStatus["openrouter"]?.loading}
                        >
                          {valStatus["openrouter"]?.loading ? "Verifying..." : "Validate"}
                        </button>
                        <span className="text-neutral-300 text-xs">|</span>
                        <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-violet-600 hover:underline">Get Key ↗</a>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type={showKeys["openrouter"] ? "text" : "password"}
                        placeholder="sk-or-..."
                        value={apiKeyOpenRouter}
                        onChange={(e) => handleSaveOpenRouterKey(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-3 pr-8 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility("openrouter")}
                        className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                      >
                        {showKeys["openrouter"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {valStatus["openrouter"] && (
                      <div className={`text-xs p-2 rounded-lg font-semibold leading-snug flex items-start gap-1.5 ${
                        valStatus["openrouter"].loading
                          ? "bg-neutral-50 text-neutral-600"
                          : valStatus["openrouter"].valid
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            : "bg-red-50 text-red-800 border border-red-100"
                      }`}>
                        {valStatus["openrouter"].loading ? (
                          <Loader2 className="w-3.5 h-3.5 text-neutral-500 animate-spin shrink-0 mt-0.5" />
                        ) : valStatus["openrouter"].valid ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <span>{valStatus["openrouter"].message || (valStatus["openrouter"].loading ? "Connecting to OpenRouter..." : "Key is invalid.")}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span className="text-xs text-neutral-400 font-bold tracking-tight">
                    Saved locally in browser
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowKeySettings(false)}
                    className="px-3 py-1.5 text-xs font-bold bg-[#8B5CF6] hover:bg-[#7c3aed] text-white rounded-lg cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs">
            <span className={`w-2 h-2 rounded-full ${serverStatus === "online" ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`}></span>
            <span className="font-mono text-xs uppercase font-bold tracking-wider text-neutral-500">
              {serverStatus === "online" ? "System Live" : "Offline Mode"}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl border border-neutral-200 text-neutral-500 hover:bg-neutral-100 transition-all flex items-center justify-center cursor-pointer"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            id="header_theme_toggle_btn"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-violet-600" />}
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Purge session memory and leave battleground"
            id="header_logout_btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Leave Arena</span>
          </button>

          {view === "draft" && activeSession && (
            <button
              onClick={() => {
                setView(activeSession.status === "completed" ? "report" : "arena");
                setActiveTab(activeSession.status === "completed" ? "report" : "arena");
              }}
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                activeSession.status === "completed"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100 animate-pulse"
                  : "bg-[#8B5CF6] hover:bg-[#7c3aed] text-white shadow-violet-100"
              }`}
            >
              {activeSession.status === "completed" ? (
                <>
                  <Award className="w-3.5 h-3.5 text-white" /> View Final Consensus
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5 text-white" /> Back to Debate
                </>
              )}
            </button>
          )}
          {(view === "arena" || view === "report") && (
            <button
              onClick={() => setView("draft")}
              className="px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Adjust Council
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Content Views */}

      {/* VIEW B: DRAFT / BUILDER PAGE */}
      {view === "draft" && (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* LEFT: Draft inputs (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Draft your prompt
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 text-sm font-medium">
                Assemble the AI minds for battle. What do you want them to figure out?
              </p>
            </div>

            {/* Quick Presets Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setTopic("Compare PostgreSQL vs MongoDB for a new SaaS app")}
                className="px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] hover:bg-neutral-50 dark:bg-[#1A1A1F] hover:border-neutral-300 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 font-semibold transition-all cursor-pointer"
              >
                Compare PostgreSQL vs MongoDB for a new SaaS app
              </button>
              <button
                onClick={() => setTopic("Give me a roadmap to learn machine learning in 3 months")}
                className="px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] hover:bg-neutral-50 dark:bg-[#1A1A1F] hover:border-neutral-300 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 font-semibold transition-all cursor-pointer"
              >
                Give me a roadmap to learn machine learning in 3 months
              </button>
              <button
                onClick={() => setTopic("How should I architect a real-time collaborative editing system?")}
                className="px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] hover:bg-neutral-50 dark:bg-[#1A1A1F] hover:border-neutral-300 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 font-semibold transition-all cursor-pointer"
              >
                How should I architect a real-time collaborative editing system?
              </button>
            </div>

            {/* Prompt Textarea */}
            <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm dark:shadow-none relative focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500 transition-all space-y-3">
              <textarea
                rows={6}
                maxLength={6000}
                placeholder="Type your complex problem, question, or research topic here..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 text-sm leading-relaxed resize-none h-36 focus:ring-0"
              />

              {/* Hidden input file element */}
              <input
                type="file"
                ref={draftFileInputRef}
                onChange={handleDraftFileChange}
                multiple
                accept="image/*,application/pdf,text/*"
                className="hidden"
              />

              {/* Attachment chips right above the bottom bar */}
              {draftAttachments.length > 0 && (
                <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-50 dark:bg-[#1A1A1F] rounded-xl border border-neutral-200 dark:border-neutral-800/65 animate-fade-in max-h-24 overflow-y-auto">
                  {draftAttachments.map((att, idx) => {
                    const isImg = att.type.startsWith("image/");
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-lg bg-white dark:bg-[#121215] text-xs text-neutral-700 dark:text-neutral-300 border border-neutral-250 shadow-sm dark:shadow-none"
                      >
                        {isImg ? (
                          <img
                            src={att.base64}
                            alt={att.name}
                            className="w-5 h-5 rounded object-cover flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : att.type === "application/pdf" ? (
                          <FileText className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        ) : (
                          <FileCode className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                        )}
                        <span className="font-semibold max-w-[150px] truncate">{att.name}</span>
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">({(att.size / 1024).toFixed(0)}kb)</span>
                        <button
                          type="button"
                          onClick={() => removeDraftAttachment(idx)}
                          className="p-0.5 rounded-full hover:bg-neutral-100 dark:bg-[#25252B] text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 transition-colors cursor-pointer border-0"
                          title="Remove file"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom bar inside the input block */}
              <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-3">
                {/* Plus (+) icon to trigger upload */}
                <button
                  type="button"
                  onClick={() => draftFileInputRef.current?.click()}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-[#25252B] text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 hover:text-[#8B5CF6] hover:bg-violet-50 transition-all cursor-pointer border-0"
                  title="Upload image, PDF, or document"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <div className="text-xs font-mono font-semibold text-neutral-400 dark:text-neutral-500">
                  {topic.length} / 6,000 characters
                </div>
              </div>
            </div>

            {/* Web Research Options */}
            <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm dark:shadow-none space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">Web Research</h3>
                <div className="flex bg-neutral-100 dark:bg-[#25252B] p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  {(["auto", "always", "off"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setWebResearch(mode)}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all cursor-pointer ${
                        webResearch === mode
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 leading-relaxed font-medium">
                Auto mode allows the council to search the web if they feel they need recent facts. Note: Even if set to Off, certain critical high-stakes queries may still trigger minimal fact-checking.
              </p>
            </div>

            {/* Launch Action */}
            <div className="pt-2">
              <button
                onClick={handleLaunchDebate}
                disabled={!topic.trim() || selectedModelIds.length === 0 || isAnyKeyMissing}
                className="w-full px-4 sm:px-6 py-4 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-bold text-sm shadow-md shadow-violet-200 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-neutral-300 disabled:shadow-none disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {isAnyKeyMissing ? "Configure API Keys to Start" : "Deploy Clash"} <Sparkles className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* RIGHT: Config panel */}
          <div className="space-y-6">
            
            {/* PAST DEBATES HISTORY & CONSENSUS REPORTS */}
            {sessions.length > 0 && (
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-sm dark:shadow-none space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-violet-500" />
                    <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
                      Debate & Consensus History
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-violet-100 text-violet-700 px-2 py-0.5 rounded font-extrabold">
                    {sessions.length} {sessions.length === 1 ? "Report" : "Reports"}
                  </span>
                </div>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      onClick={() => {
                        setActiveSessionId(sess.id);
                        if (sess.status === "completed") {
                          setActiveTab("report");
                          setView("report");
                        } else {
                          setActiveTab("arena");
                          setView("arena");
                        }
                      }}
                      className={`group w-full p-3 rounded-xl border text-left transition-all hover:border-violet-300 flex items-start justify-between gap-3 cursor-pointer ${
                        activeSessionId === sess.id
                          ? "bg-violet-50/40 border-violet-200 shadow-sm"
                          : "bg-neutral-50/40 border-neutral-100 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${
                            sess.status === "completed" ? "bg-emerald-500" :
                            sess.status === "running" ? "bg-amber-500 animate-pulse" : "bg-neutral-400"
                          }`} />
                          <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 font-bold">
                            {new Date(sess.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block truncate group-hover:text-[#8B5CF6] transition-colors" title={sess.topic}>
                          {sess.topic}
                        </span>
                        {sess.consensusReport && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono mt-1 font-bold">
                            <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
                            <span>{sess.consensusReport.consensusScore}% Consensus Reached</span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSession(sess.id, e)}
                        className="text-neutral-300 hover:text-red-500 p-1 rounded hover:bg-neutral-100 dark:bg-[#25252B] transition-colors cursor-pointer self-center"
                        title="Delete report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Horizontal presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-neutral-100 dark:bg-[#25252B] p-1 rounded-xl border border-neutral-200 dark:border-neutral-800">
              {(["quick", "balanced", "deep", "custom"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handlePresetChange(mode)}
                  className={`py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    presetMode === mode
                      ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/55"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Round Configuration */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-sm dark:shadow-none space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-neutral-400 dark:text-neutral-500 font-mono tracking-wider block">Dialectic Control</span>
                  <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
                    Debate & Critique Rounds
                  </span>
                </div>
                <span className="text-xs font-mono font-black bg-violet-100 text-[#8B5CF6] px-2.5 py-1 rounded-lg">
                  {maxRounds} Rounds
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[2, 3, 4, 5].map((roundNum) => (
                  <button
                    key={roundNum}
                    type="button"
                    onClick={() => {
                      setMaxRounds(roundNum);
                      setPresetMode("custom");
                    }}
                    className={`flex-1 py-2 text-xs font-extrabold rounded-lg border transition-all cursor-pointer text-center ${
                      maxRounds === roundNum
                        ? "bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-sm shadow-violet-100"
                        : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    {roundNum}
                  </button>
                ))}
              </div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium leading-normal">
                Choose the number of peer review iterations. More rounds yield an extremely detailed, deeper technical alignment but require extra synthesis time.
              </p>
            </div>

            {/* CURRENT COUNCIL CARD */}
            <div className="p-6 rounded-2xl bg-[#0E0E11] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex items-center gap-2 text-violet-400 mb-4">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-xs uppercase font-mono tracking-widest font-extrabold">Debate Council</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black font-sans leading-none">
                  {selectedModelIds.length} expert minds • {maxRounds} critique rounds
                </h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                  typically 1-3 minutes to debate and synthesize
                </p>
              </div>
            </div>

            {/* MODELS ACCORDION LIST */}
            <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm dark:shadow-none p-4 space-y-4">
              
              {/* Model Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#1A1A1F] border border-neutral-200 dark:border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* Group providers list */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {(Object.entries(modelsByProvider) as [string, ModelItem[]][]).map(([providerName, models]) => {
                  if (models.length === 0) return null;
                  const isExpanded = expandedProviders[providerName];
                  
                  return (
                    <div key={providerName} className="border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-[#1A1A1F]/50">
                      
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => toggleProvider(providerName)}
                        className="w-full px-4 py-3 hover:bg-neutral-100 dark:bg-[#25252B] flex items-center justify-between text-left cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200 tracking-wide uppercase font-mono">
                            {providerName}
                          </span>
                          {providerName === "Google AI (Gemini)" && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-mono font-bold border ${apiKeyGemini ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                              {apiKeyGemini ? "Key Loaded" : "Key Missing"}
                            </span>
                          )}
                          {providerName === "OpenAI" && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-mono font-bold border ${apiKeyOpenAI ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                              {apiKeyOpenAI ? "Key Loaded" : "Key Missing"}
                            </span>
                          )}
                          {providerName === "Anthropic" && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-mono font-bold border ${apiKeyAnthropic ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                              {apiKeyAnthropic ? "Key Loaded" : "Key Missing"}
                            </span>
                          )}
                          {providerName === "Groq" && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-mono font-bold border ${apiKeyGroq ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                              {apiKeyGroq ? "Key Loaded" : "Key Missing"}
                            </span>
                          )}
                          {providerName === "OpenRouter" && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-mono font-bold border ${apiKeyOpenRouter ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                              {apiKeyOpenRouter ? "Key Loaded" : "Key Missing"}
                            </span>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                        )}
                      </button>

                      {/* Accordion Content checkboxes */}
                      {isExpanded && (
                        <div className="px-4 pb-3 pt-1 space-y-2.5 bg-white dark:bg-[#121215] border-t border-neutral-100 dark:border-neutral-800">
                          {models.map((model) => {
                            const isChecked = selectedModelIds.includes(model.id);
                            return (
                              <label
                                key={model.id}
                                className="flex items-start gap-2.5 cursor-pointer hover:bg-neutral-50 dark:bg-[#1A1A1F] p-1.5 rounded-lg transition-all"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleModelSelection(model.id)}
                                  className="mt-1 rounded text-[#8B5CF6] focus:ring-[#8B5CF6] border-neutral-300 dark:border-neutral-700 cursor-pointer"
                                />
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                                    {model.name}
                                  </span>
                                  <span className="text-xs text-neutral-400 dark:text-neutral-500 block truncate font-medium">
                                    {model.role}
                                  </span>
                                </div>
                              </label>
                            );
                          })}

                          {/* Render custom model action if appropriate */}
                          {providerName === "OpenAI" && (
                            <button
                              type="button"
                              onClick={() => {
                                setCustomModelProvider("OpenAI");
                                setShowAddCustom(true);
                              }}
                              className="text-xs font-bold text-[#8B5CF6] hover:text-[#7c3aed] flex items-center gap-1 mt-1 cursor-pointer pl-1.5 py-1 text-left"
                            >
                              <Plus className="w-3 h-3" /> Add custom model
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Global Custom model addition button if not inside accordion */}
              {!showAddCustom && (
                <button
                  type="button"
                  onClick={() => setShowAddCustom(true)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-violet-300 text-xs text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 hover:text-[#8B5CF6] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add custom model
                </button>
              )}
            </div>

            {/* CUSTOM MODEL CREATION MODAL/INLINE */}
            {showAddCustom && (
              <form
                onSubmit={handleAddCustomModel}
                className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-md space-y-4 animate-fade-in text-left"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                  <h3 className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider font-mono">
                    Add Custom AI Mind
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddCustom(false)}
                    className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-mono tracking-wider">Model Name</label>
                    <input
                      type="text"
                      placeholder="E.g., DeepSeek R1"
                      required
                      value={customModelName}
                      onChange={(e) => setCustomModelName(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-[#1A1A1F] border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                    />
                  </div>

                  {/* Provider */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-mono tracking-wider">Provider group</label>
                    <select
                      value={customModelProvider}
                      onChange={(e) => setCustomModelProvider(e.target.value as any)}
                      className="w-full bg-neutral-50 dark:bg-[#1A1A1F] border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                    >
                      <option value="OpenAI">OpenAI</option>
                      <option value="Anthropic">Anthropic</option>
                      <option value="Google AI (Gemini)">Google AI (Gemini)</option>
                      <option value="Groq">Groq</option>
                      <option value="OpenRouter">OpenRouter</option>
                    </select>
                  </div>

                  {/* Role */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-mono tracking-wider">Role</label>
                    <input
                      type="text"
                      placeholder="E.g., Advanced Reasoning Thinker"
                      required
                      value={customModelRole}
                      onChange={(e) => setCustomModelRole(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-[#1A1A1F] border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                    />
                  </div>

                  {/* System Persona */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-mono tracking-wider">System Persona / Instructions</label>
                    <textarea
                      rows={3}
                      placeholder="E.g., You are DeepSeek R1. Speak in a highly analytical, deep-thinking format. Explain your chain-of-thought carefully before delivering crisp decisions."
                      required
                      value={customModelPersona}
                      onChange={(e) => setCustomModelPersona(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-[#1A1A1F] border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] leading-relaxed resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm dark:shadow-none"
                >
                  Create AI Mind
                </button>
              </form>
            )}

            {/* REQUIRED API KEYS PANEL */}
            <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm dark:shadow-none overflow-hidden">
              <button
                type="button"
                onClick={() => setShowApiKeysDraft(!showApiKeysDraft)}
                className={`w-full p-5 hover:bg-neutral-50 dark:bg-[#1A1A1F]/50 flex items-center justify-between text-left cursor-pointer transition-all ${
                  isAnyKeyMissing ? "bg-amber-50/45 hover:bg-amber-50/70" : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Key className={`w-4 h-4 ${isAnyKeyMissing ? "text-amber-500 animate-pulse" : "text-[#8B5CF6]"}`} />
                  <div>
                    <h3 className="text-xs font-black uppercase text-neutral-800 dark:text-neutral-200 tracking-wider font-mono">
                      Required API Keys
                    </h3>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                      Configure keys to unlock external AI minds
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAnyKeyMissing ? (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 font-sans flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" /> Attention Required
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-sans">
                      All Configured
                    </span>
                  )}
                  {showApiKeysDraft ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                  )}
                </div>
              </button>

              {showApiKeysDraft && (
                <div className="p-5 border-t border-neutral-100 dark:border-neutral-800 space-y-4 bg-neutral-50 dark:bg-[#1A1A1F]/10">
                  {activeProviders.size === 0 ? (
                    <div className="text-center py-4 space-y-2">
                      <Key className="w-8 h-8 text-neutral-300 mx-auto" />
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 dark:text-neutral-500 font-semibold">No Mind Chosen Yet</p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium leading-normal max-w-xs mx-auto">
                        Please select expert AI minds from the panel above to view their corresponding API key requirements.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {/* Google AI (Gemini) */}
                      {activeProviders.has("Google AI (Gemini)") && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 font-mono tracking-wider flex items-center gap-1.5">
                              Google AI (Gemini) API Key
                            </label>
                            <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#8B5CF6] hover:underline">Get a free key ↗</a>
                          </div>
                          <div className="relative">
                            <input
                              type={showKeys["gemini_panel"] ? "text" : "password"}
                              placeholder="Paste API key to unlock models"
                              value={apiKeyGemini}
                              onChange={(e) => handleSaveGeminiKey(e.target.value)}
                              className={`w-full bg-neutral-50 dark:bg-[#1A1A1F] border rounded-xl pl-3 pr-8 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] ${
                                !apiKeyGemini 
                                  ? "border-red-300 focus:ring-red-500 font-sans" 
                                  : "border-neutral-200"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => toggleKeyVisibility("gemini_panel")}
                              className="absolute right-2.5 top-2.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 cursor-pointer"
                            >
                              {showKeys["gemini_panel"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          {!apiKeyGemini && (
                            <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1 font-sans">
                              <AlertCircle className="w-3 h-3 text-red-500 shrink-0" /> Key required for selected Gemini models
                            </p>
                          )}
                        </div>
                      )}

                      {/* OpenAI */}
                      {activeProviders.has("OpenAI") && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 font-mono tracking-wider flex items-center gap-1.5">
                              OpenAI API Key
                            </label>
                            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#8B5CF6] hover:underline">Get a free key ↗</a>
                          </div>
                          <div className="relative">
                            <input
                              type={showKeys["openai_panel"] ? "text" : "password"}
                              placeholder="Paste API key to unlock models"
                              value={apiKeyOpenAI}
                              onChange={(e) => handleSaveOpenAIKey(e.target.value)}
                              className={`w-full bg-neutral-50 dark:bg-[#1A1A1F] border rounded-xl pl-3 pr-8 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] ${
                                !apiKeyOpenAI 
                                  ? "border-red-300 focus:ring-red-500 font-sans" 
                                  : "border-neutral-200"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => toggleKeyVisibility("openai_panel")}
                              className="absolute right-2.5 top-2.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 cursor-pointer"
                            >
                              {showKeys["openai_panel"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          {!apiKeyOpenAI && (
                            <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1 font-sans">
                              <AlertCircle className="w-3 h-3 text-red-500 shrink-0" /> Key required for selected OpenAI models
                            </p>
                          )}
                        </div>
                      )}

                      {/* Anthropic */}
                      {activeProviders.has("Anthropic") && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 font-mono tracking-wider flex items-center gap-1.5">
                              Anthropic API Key
                            </label>
                            <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#8B5CF6] hover:underline">Get a free key ↗</a>
                          </div>
                          <div className="relative">
                            <input
                              type={showKeys["anthropic_panel"] ? "text" : "password"}
                              placeholder="Paste API key to unlock models"
                              value={apiKeyAnthropic}
                              onChange={(e) => handleSaveAnthropicKey(e.target.value)}
                              className={`w-full bg-neutral-50 dark:bg-[#1A1A1F] border rounded-xl pl-3 pr-8 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] ${
                                !apiKeyAnthropic 
                                  ? "border-red-300 focus:ring-red-500 font-sans" 
                                  : "border-neutral-200"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => toggleKeyVisibility("anthropic_panel")}
                              className="absolute right-2.5 top-2.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 cursor-pointer"
                            >
                              {showKeys["anthropic_panel"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          {!apiKeyAnthropic && (
                            <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1 font-sans">
                              <AlertCircle className="w-3 h-3 text-red-500 shrink-0" /> Key required for selected Anthropic models
                            </p>
                          )}
                        </div>
                      )}

                      {/* Groq */}
                      {activeProviders.has("Groq") && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 font-mono tracking-wider flex items-center gap-1.5">
                              Groq API Key
                            </label>
                            <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#8B5CF6] hover:underline">Get a free key ↗</a>
                          </div>
                          <div className="relative">
                            <input
                              type={showKeys["groq_panel"] ? "text" : "password"}
                              placeholder="Paste API key to unlock models"
                              value={apiKeyGroq}
                              onChange={(e) => handleSaveGroqKey(e.target.value)}
                              className={`w-full bg-neutral-50 dark:bg-[#1A1A1F] border rounded-xl pl-3 pr-8 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] ${
                                !apiKeyGroq 
                                  ? "border-red-300 focus:ring-red-500 font-sans" 
                                  : "border-neutral-200"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => toggleKeyVisibility("groq_panel")}
                              className="absolute right-2.5 top-2.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 cursor-pointer"
                            >
                              {showKeys["groq_panel"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          {!apiKeyGroq && (
                            <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1 font-sans">
                              <AlertCircle className="w-3 h-3 text-red-500 shrink-0" /> Key required for selected Groq models
                            </p>
                          )}
                        </div>
                      )}

                      {/* OpenRouter */}
                      {activeProviders.has("OpenRouter") && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 font-mono tracking-wider flex items-center gap-1.5">
                              OpenRouter API Key
                            </label>
                            <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#8B5CF6] hover:underline">Get a free key ↗</a>
                          </div>
                          <div className="relative">
                            <input
                              type={showKeys["openrouter_panel"] ? "text" : "password"}
                              placeholder="Paste API key to unlock models"
                              value={apiKeyOpenRouter}
                              onChange={(e) => handleSaveOpenRouterKey(e.target.value)}
                              className={`w-full bg-neutral-50 dark:bg-[#1A1A1F] border rounded-xl pl-3 pr-8 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] ${
                                !apiKeyOpenRouter 
                                  ? "border-red-300 focus:ring-red-500 font-sans" 
                                  : "border-neutral-200"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => toggleKeyVisibility("openrouter_panel")}
                              className="absolute right-2.5 top-2.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 cursor-pointer"
                            >
                              {showKeys["openrouter_panel"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          {!apiKeyOpenRouter && (
                            <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1 font-sans">
                              <AlertCircle className="w-3 h-3 text-red-500 shrink-0" /> Key required for selected OpenRouter models
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* VIEW C & D: ARENA DISCUSSION & REPORT */}
      {(view === "arena" || view === "report") && (
        <main className="flex-1 min-h-0 flex flex-col bg-[#F9F9FB] dark:bg-[#0A0A0A] text-neutral-800 dark:text-neutral-200 overflow-hidden">
          
          {/* Subheader */}
          <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#121215]/80 backdrop-blur-md px-4 sm:px-6 py-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between z-10">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800/30 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest">
                  Battleground active
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono font-bold">
                  Assembled: {activeSession ? new Date(activeSession.createdAt).toLocaleTimeString() : ""}
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-neutral-900 dark:text-white mt-1.5 tracking-tight truncate leading-tight">
                Topic: {activeSession?.topic}
              </h2>
            </div>

            {/* Tab selector */}
            <div className="flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shrink-0 self-stretch md:self-auto justify-around">
              <button
                onClick={() => {
                  setActiveTab("arena");
                  setView("arena");
                }}
                className={`px-4 py-1.5 rounded-lg font-extrabold text-xs font-mono tracking-wide uppercase transition-all cursor-pointer ${
                  activeTab === "arena" && view === "arena" ? "bg-white dark:bg-[#1A1A1F] text-neutral-950 dark:text-white shadow border border-neutral-200/50 dark:border-neutral-700" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                }`}
              >
                Battlefield
              </button>
              <button
                onClick={() => {
                  setActiveTab("report");
                  setView("report");
                }}
                disabled={!activeSession?.consensusReport}
                className={`px-4 py-1.5 rounded-lg font-extrabold text-xs font-mono tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  (activeTab === "report" || view === "report") ? "bg-white dark:bg-[#1A1A1F] text-neutral-950 dark:text-white shadow border border-neutral-200/50 dark:border-neutral-700" : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                }`}
              >
                Consensus
              </button>
              <button
                onClick={() => {
                  setActiveTab("transcript");
                  setView("arena");
                }}
                className={`px-4 py-1.5 rounded-lg font-extrabold text-xs font-mono tracking-wide uppercase transition-all cursor-pointer ${
                  activeTab === "transcript" && view === "arena" ? "bg-white dark:bg-[#1A1A1F] text-neutral-950 dark:text-white shadow border border-neutral-200/50 dark:border-neutral-700" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                }`}
              >
                Transcript
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col xl:grid xl:grid-cols-12 overflow-y-auto xl:overflow-hidden h-full">
            
            {/* Left Column: Panelists Status Cards */}
            {activeTab !== "report" && (
              <div className="shrink-0 xl:col-span-3 border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] p-4 overflow-y-auto space-y-4 xl:h-full">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-mono tracking-widest uppercase text-neutral-400 dark:text-neutral-500 font-extrabold flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-violet-500" /> Active Roster
                  </h3>
                  {activeSession && (
                    <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 font-bold">
                      Round {activeSession.status === "completed" ? activeSession.maxRounds : Math.min(activeSession.currentRound, activeSession.maxRounds)} / {activeSession.maxRounds}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
                  {activeSession?.speakers.map((spk, idx) => {
                    const isCurrent = activeSession.currentSpeakerIndex === idx && activeSession.status === "running";
                    const count = activeSession.turns.filter((t) => t.speakerId === spk.id).length;
                    return (
                      <SpeakerCard
                        key={spk.id}
                        speaker={spk}
                        isCurrent={isCurrent}
                        status={activeSession.status}
                        isThinking={isThinking}
                        speechCount={count}
                      />
                    );
                  })}
                </div>

                {activeSession?.status === "error" && (
                  <div className="p-4 rounded-2xl border border-red-100 bg-red-50/50 flex flex-col items-center text-center gap-2 animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600 font-bold font-mono leading-relaxed uppercase tracking-wider">
                      {activeSession.error.toLowerCase().includes("quota") || activeSession.error.toLowerCase().includes("429") || activeSession.error.toLowerCase().includes("exhausted") || activeSession.error.toLowerCase().includes("limit") ? "Quota Exhausted" : "Simulation Error"}
                    </p>
                    <p className="text-xs text-neutral-500 font-semibold leading-normal">
                      {activeSession.error}
                    </p>
                    {(activeSession.error.toLowerCase().includes("quota") || activeSession.error.toLowerCase().includes("429") || activeSession.error.toLowerCase().includes("exhausted") || activeSession.error.toLowerCase().includes("limit")) && (
                      <button
                        onClick={() => setShowKeySettings(true)}
                        className="mt-1 w-full py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs tracking-wide uppercase cursor-pointer transition-all shadow-sm"
                      >
                        🔑 Enter API Key
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Left Chat Sidebar: Opens when showLeftChat is true */}
            {showLeftChat && (
              <div className="shrink-0 h-[60vh] xl:h-full xl:col-span-4 border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] overflow-hidden flex flex-col">
                {renderChatbotContent(true)}
              </div>
            )}

            {/* Right/Main Column: Render Stream or Reports */}
            <div className={`${
              activeTab === "report"
                ? (showLeftChat ? "xl:col-span-8" : "xl:col-span-12")
                : (showLeftChat ? "xl:col-span-5" : "xl:col-span-9")
            } shrink-0 min-h-[80vh] xl:min-h-0 xl:h-full flex flex-col overflow-hidden bg-neutral-50 dark:bg-[#0A0A0A] relative`}>
              
              {/* Top Main Pane: Contains active tabs (Arena, Report, Transcript) */}
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
                
                {/* TAB 1: ARENA STREAM */}
                {activeTab === "arena" && view === "arena" && (
                  <div className="flex-1 flex flex-col overflow-hidden h-full">
                    
                    {/* Scrollable conversation bubble stream */}
                    <div ref={arenaMessagesContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 h-full">
                      

                      {/* Original Topic and Attachments Banner */}
                      {activeSession && (
                        <div className="max-w-3xl border-l-2 border-violet-500 pl-4 space-y-2 animate-fade-in mb-6">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-mono font-bold">
                              O
                            </div>
                            <span className="text-xs font-bold text-neutral-900 dark:text-white">
                              Original Research Prompt
                            </span>
                          </div>
                          
                          <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl rounded-tl-none border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
                            <p className="text-xs text-neutral-700 dark:text-neutral-300 font-semibold leading-relaxed whitespace-pre-wrap">
                              {activeSession.topic}
                            </p>

                            {activeSession.attachments && activeSession.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                {activeSession.attachments.map((att, idx) => {
                                  const isImg = att.type.startsWith("image/");
                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2 p-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 max-w-[240px] min-w-[140px] shadow-sm"
                                    >
                                      {isImg ? (
                                        <img
                                          src={att.base64}
                                          alt={att.name}
                                          className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : att.type === "application/pdf" ? (
                                        <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 flex items-center justify-center flex-shrink-0">
                                          <FileText className="w-4 h-4 text-red-500" />
                                        </div>
                                      ) : (
                                        <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-900/30 flex items-center justify-center flex-shrink-0">
                                          <FileCode className="w-4 h-4 text-[#8B5CF6]" />
                                        </div>
                                      )}
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold truncate leading-tight text-neutral-800 dark:text-neutral-200">
                                          {att.name}
                                        </p>
                                        <p className="text-[8px] text-neutral-400 dark:text-neutral-500 font-mono font-bold mt-0.5">
                                          {(att.size / 1024).toFixed(1)} KB
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {activeSession?.status === "error" && (
                        <div className="p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10 flex flex-col items-center text-center gap-3 animate-fade-in max-w-2xl mx-auto mb-6 shadow-sm">
                          <AlertCircle className="w-7 h-7 text-amber-500 animate-pulse flex-shrink-0" />
                          <p className="text-xs font-black font-mono leading-relaxed uppercase tracking-widest text-amber-800 dark:text-amber-400">
                            {activeSession.error.toLowerCase().includes("quota") || activeSession.error.toLowerCase().includes("429") || activeSession.error.toLowerCase().includes("exhausted") || activeSession.error.toLowerCase().includes("limit") ? "API Quota Exhausted" : "Debate Interrupted"}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold leading-relaxed max-w-lg">
                            {activeSession.error}
                          </p>
                          {(activeSession.error.toLowerCase().includes("quota") || activeSession.error.toLowerCase().includes("429") || activeSession.error.toLowerCase().includes("exhausted") || activeSession.error.toLowerCase().includes("limit")) ? (
                            <div className="mt-2 flex flex-col sm:flex-row gap-2.5 items-center justify-center">
                              <button
                                onClick={() => setShowKeySettings(true)}
                                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs transition-all shadow-md shadow-violet-100 dark:shadow-none flex items-center gap-1.5 cursor-pointer"
                              >
                                <Key className="w-3.5 h-3.5" />
                                Configure Personal API Key
                              </button>
                              <button
                                onClick={() => {
                                  setView("draft");
                                }}
                                className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 bg-white dark:bg-transparent text-neutral-700 dark:text-neutral-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <ArrowLeft className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                                Adjust Models & Roster
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setView("draft")}
                              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs transition-all cursor-pointer"
                            >
                              Go Back & Adjust Draft
                            </button>
                          )}
                        </div>
                      )}
                      
                      {activeSession && activeSession.turns.length === 0 && !isThinking && (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
                          <div className="p-4 rounded-xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 shadow-sm">
                            <Sparkles className="w-8 h-8 animate-pulse text-violet-500" />
                          </div>
                          <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
                            Ready for opening thesis statement
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
                            Press play below. Each AI panelist will deliver their argument, challenge other pitches, and synthesize consensus.
                          </p>
                        </div>
                      )}

                      {activeSession?.turns.map((turn) => (
                        <div
                          key={turn.id}
                          className={`flex flex-col space-y-2 max-w-3xl animate-fade-in border-l-2 pl-4 ${
                            turn.speakerColor === "indigo" ? "border-indigo-400" :
                            turn.speakerColor === "emerald" ? "border-emerald-400" :
                            turn.speakerColor === "amber" ? "border-amber-400" :
                            turn.speakerColor === "rose" ? "border-rose-400" :
                            turn.speakerColor === "sky" ? "border-sky-400" :
                            turn.speakerColor === "violet" ? "border-violet-400" : "border-neutral-300 dark:border-neutral-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900 dark:text-white">
                              {turn.speakerName}
                            </span>
                            <span className="text-xs font-mono font-bold text-neutral-400 dark:text-neutral-500">
                              {turn.speakerRole} • Round {turn.round}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl rounded-tl-none border border-neutral-200 dark:border-neutral-800 shadow-sm">
                            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-semibold whitespace-pre-wrap">
                              {turn.message}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isThinking && activeSession && (
                        <div className="flex flex-col space-y-2 max-w-3xl animate-pulse pl-4 border-l-2 border-neutral-400 dark:border-neutral-600">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                              {activeSession.speakers[activeSession.currentSpeakerIndex].name}
                            </span>
                            <span className="text-xs font-mono font-bold text-neutral-400 dark:text-neutral-500">
                              Synthesizing technical stance...
                            </span>
                          </div>
                          <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl rounded-tl-none border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                            <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                          </div>
                        </div>
                      )}

                      <div ref={transcriptEndRef} />
                    </div>

                    {/* BOTTOM ACTION BUTTONS BAR */}
                    <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] p-4 space-y-4 shadow-sm">
                      
                      <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex items-center gap-2">
                          {activeSession?.status === "paused" ? (
                            <button
                              onClick={handleStartResume}
                              className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-violet-100 dark:shadow-none cursor-pointer uppercase font-mono tracking-wider"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" /> Play Simulation
                            </button>
                          ) : activeSession?.status === "running" ? (
                            <button
                              onClick={handlePause}
                              className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1F] hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer uppercase font-mono tracking-wider border border-neutral-200 dark:border-neutral-700 shadow-sm"
                            >
                              <Pause className="w-3.5 h-3.5" /> Pause
                            </button>
                          ) : activeSession?.status === "synthesizing" ? (
                            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-4 py-2.5 rounded-xl border border-violet-100 dark:border-violet-900/30 text-xs font-mono font-bold">
                              <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping"></span>
                              Assembling Consensus Report...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-xs font-mono font-bold">
                              Synthesis Completed
                            </div>
                          )}

                          {activeSession && activeSession.turns.length > 0 && activeSession.status !== "completed" && activeSession.status !== "synthesizing" && (
                            <button
                              onClick={handleForceSynthesis}
                              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A1F] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-extrabold transition-all cursor-pointer font-mono uppercase tracking-wide shadow-sm"
                            >
                              Consolidate Consensus Now
                            </button>
                          )}
                        </div>

                        {activeSession && (
                          <div className="text-xs text-neutral-400 dark:text-neutral-500 font-mono flex items-center gap-4 font-bold">
                            <span>Round: <b className="text-neutral-700 dark:text-neutral-300">{Math.min(activeSession.currentRound, activeSession.maxRounds)}/{activeSession.maxRounds}</b></span>
                            <span>Turns: <b className="text-neutral-700 dark:text-neutral-300">{activeSession.turns.length}</b></span>
                          </div>
                        )}
                      </div>

                      {/* USER MODERATOR INPUT */}
                      {activeSession && activeSession.status !== "completed" && activeSession.status !== "synthesizing" && (
                        <form onSubmit={handleSendIntervention} className="relative flex items-center gap-2 bg-neutral-50 dark:bg-[#1A1A1F] p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 focus-within:border-violet-300 dark:focus-within:border-violet-700 focus-within:ring-2 focus-within:ring-violet-500/5 transition-all">
                          <span className="text-xs font-mono tracking-wider text-neutral-400 dark:text-neutral-500 uppercase font-bold pl-2 shrink-0 select-none">
                            Moderator Command
                          </span>
                          <input
                            type="text"
                            placeholder="Inject instructions, e.g. 'Let's focus strictly on implementation security.'"
                            value={interventionInput}
                            onChange={(e) => setInterventionInput(e.target.value)}
                            className="flex-1 bg-transparent border-0 text-xs text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0 font-sans font-semibold"
                          />
                          <button
                            type="submit"
                            disabled={!interventionInput.trim()}
                            className="p-1.5 rounded-lg bg-[#8B5CF6] text-white hover:bg-[#7c3aed] disabled:opacity-30 disabled:hover:bg-[#8B5CF6] transition-colors cursor-pointer shadow-sm"
                            title="Submit command to AI minds"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: CONSENSUS SYNTHESIS REPORT */}
                {(activeTab === "report" || view === "report") && (
                  <div id="report-scroll-container" className="flex-1 overflow-y-auto p-6 md:p-8 bg-neutral-50 dark:bg-[#0A0A0A] h-full">
                    {activeSession?.consensusReport ? (
                      <ConsensusReportView
                        report={activeSession.consensusReport}
                        topic={activeSession.topic}
                        speakersCount={activeSession.speakers.length}
                        roundsCount={activeSession.maxRounds}
                        totalSpeeches={activeSession.turns.length}
                        onExportTranscript={handleExportFullTranscript}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-12">
                        <AlertCircle className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mb-2 animate-pulse" />
                        <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200">Consensus under draft</h3>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm mt-1 font-semibold">
                          The executive report is structured automatically when all critique rounds are complete. Or, click 'Consolidate Consensus Now' to trigger it immediately.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: CHRONOLOGICAL TRANSCRIPT */}
                {activeTab === "transcript" && view === "arena" && (
                  <div className="flex-1 overflow-y-auto p-6 bg-neutral-50 dark:bg-[#0A0A0A] h-full">
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                      <div>
                        <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight">Chronological Debate Ledger</h3>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 font-semibold">Verbatim audit log of all panel inputs and moderator interventions.</p>
                      </div>
                      <button
                        onClick={handleExportFullTranscript}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-[#121215] hover:bg-neutral-50 dark:hover:bg-[#1A1A1F] text-neutral-700 dark:text-neutral-300 text-xs flex items-center gap-1 border border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer font-mono uppercase tracking-wider font-extrabold shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" /> Export Markdown
                      </button>
                    </div>

                    <div className="mt-6 space-y-4 max-w-3xl">
                      {activeSession && activeSession.turns.length === 0 ? (
                        <div className="text-center py-12 text-xs font-mono text-neutral-400 dark:text-neutral-600 font-bold">No logs generated yet. Initiate the battleground simulation.</div>
                      ) : (
                        activeSession?.turns.map((t) => (
                          <div key={t.id} className="space-y-1 bg-white dark:bg-[#121215] p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm animate-fade-in">
                            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500 font-mono font-bold">
                              <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{t.speakerName}</span>
                              <span>• {t.speakerRole} • Round {t.round}</span>
                              <span className="ml-auto text-xs text-neutral-400 dark:text-neutral-600">{new Date(t.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-300 font-semibold leading-relaxed pt-2 border-t border-neutral-100 dark:border-neutral-800/50 whitespace-pre-wrap">{t.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* BOTTOM PANEL: ChatGPT-style Interactive Consultation Chatbot */}
              {!showLeftChat && activeSession?.consensusReport && (
                renderChatbotContent(false)
              )}

            </div>

          </div>
        </main>
      )}

    </div>
  );
}
