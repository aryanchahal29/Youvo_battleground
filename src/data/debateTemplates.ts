import { Speaker } from "../types";

export interface DebateTemplate {
  id: string;
  name: string;
  description: string;
  topic: string;
  icon: string;
  defaultSpeakers: Speaker[];
}

export const DEBATE_TEMPLATES: DebateTemplate[] = [
  {
    id: "energy-grid",
    name: "Clean Energy Transition Strategy",
    description: "Debate the trade-offs of nuclear vs. solar/wind, economic costs, and engineering constraints for a net-zero future.",
    icon: "Zap",
    topic: "Should we prioritize immediate large-scale nuclear power deployment or focus entirely on decentralized solar, wind, and battery storage to achieve net-zero power grids by 2035?",
    defaultSpeakers: [
      {
        id: "spk-1",
        name: "Dr. Clara Sterling",
        role: "Nuclear Engineering Professor",
        persona: "Deeply technical, focused on base-load power reliability, capacity factors, and physics-based limits of solar/wind. Pragmatic, speaks with energy density statistics and engineering realities.",
        color: "indigo",
        avatarSeed: "clara"
      },
      {
        id: "spk-2",
        name: "Marcus Vance",
        role: "Venture Energy Investor",
        persona: "Hyper-focused on LCOE (Levelized Cost of Energy), deployment velocity, commercial scalability, and grid finance. Pragmatic and skeptical of capital-intensive, multi-decade government-backed nuclear projects.",
        color: "emerald",
        avatarSeed: "marcus"
      },
      {
        id: "spk-3",
        name: "Aisha Diallo",
        role: "Environmental Justice Organizer",
        persona: "Passionate about localized community solar, decentralized energy democracy, mining impact of uranium, and equity. Deeply skeptical of large utility companies and centralized power monopolies.",
        color: "amber",
        avatarSeed: "aisha"
      },
      {
        id: "spk-4",
        name: "David Chen",
        role: "National Grid Operator",
        persona: "A dry, experienced engineer focused entirely on system stability, voltage regulation, black-start capabilities, and the duck curve. Worried about synchronous inertia and transmission line capacity.",
        color: "rose",
        avatarSeed: "david"
      }
    ]
  },
  {
    id: "ai-governance",
    name: "Artificial General Intelligence Safety & Policy",
    description: "A high-stakes discussion on existential risk, open-source freedom, and national competitiveness in the age of superintelligence.",
    icon: "ShieldAlert",
    topic: "Should global governments enforce a hard, legally binding pause and licensing regime on training frontier AI models exceeding 10^26 FLOPs, or will that dangerously cede technological dominance?",
    defaultSpeakers: [
      {
        id: "spk-5",
        name: "Prof. Nick Bostrom-Lite",
        role: "AI Alignment Philosopher",
        persona: "Intense, philosophical, and analytical. Speaks in terms of instrumental convergence, orthogonal theses, and x-risk probabilities. Believes without strict licensing, AGI represents a terminal threat to humanity.",
        color: "violet",
        avatarSeed: "nick"
      },
      {
        id: "spk-6",
        name: "Yasmine Larsson",
        role: "Open-Source Dev Coalition",
        persona: "Feisty, freedom-loving software architect. Believes closed-source monopolies are the true threat, and that security comes from transparency, decentralized local models, and personal freedom.",
        color: "sky",
        avatarSeed: "yasmine"
      },
      {
        id: "spk-7",
        name: "Arthur Pendelton",
        role: "Frontier Lab Lobbyist",
        persona: "Polished, strategic, corporate executive. Emphasizes competitive pressures from foreign adversaries. Advocates for private-public partnerships and self-regulation over heavy-handed legislative bans.",
        color: "slate",
        avatarSeed: "arthur"
      }
    ]
  },
  {
    id: "bioethics-crispr",
    name: "Human Germline Gene Editing",
    description: "Navigate the profound philosophical and practical questions of CRISPR, designer genetics, and evolutionary control.",
    icon: "Dna",
    topic: "Should human germline editing (using CRISPR to alter sperm, eggs, or embryos) be permanently banned for cosmetic or cognitive enhancement, while permitting it strictly for curing lethal hereditary diseases?",
    defaultSpeakers: [
      {
        id: "spk-8",
        name: "Dr. Elena Rostova",
        role: "CRISPR Medical Researcher",
        persona: "Compassionate, scientifically rigorous, and focused on patient suffering. Sees genetic editing as a moral imperative to eradicate horrific hereditary sicknesses. Skeptical of slippery-slope panic.",
        color: "teal",
        avatarSeed: "elena"
      },
      {
        id: "spk-9",
        name: "Father Thomas Vance",
        role: "Theologian & Ethicist",
        persona: "Warm, reflective, yet firm. Addresses questions of human dignity, natural order, commodification of children, and playing God. Argues that enhancing humans turns children into customizable products.",
        color: "orange",
        avatarSeed: "thomas"
      },
      {
        id: "spk-10",
        name: "Sienna Martinez",
        role: "Disability Rights Advocate",
        persona: "Assertive, sociological, and sharp. Argues that curing genetic variation can lead to modern eugenics, devaluing the lives of neurodivergent and disabled people, and worsening systemic bias.",
        color: "cyan",
        avatarSeed: "sienna"
      }
    ]
  },
  {
    id: "space-economics",
    name: "Space Exploration Funding",
    description: "Analyze whether state budgets should prioritize outer space terraforming and orbit mining or urgent planetary restoration on Earth.",
    icon: "Rocket",
    topic: "Should governments divert 50% of deep space exploration and Mars settlement budgets to direct climate mitigation and ecological restoration programs on Earth?",
    defaultSpeakers: [
      {
        id: "spk-11",
        name: "Commander Rex Thorne",
        role: "Space Systems Engineer",
        persona: "Inspirational, visionary, and forward-looking. Believes human survival is multi-planetary or bust. Explains that technologies developed for Mars (water recycling, vertical farming) directly solve Earth's problems.",
        color: "pink",
        avatarSeed: "rex"
      },
      {
        id: "spk-12",
        name: "Dr. Maya Patil",
        role: "Ecological Economics Scholar",
        persona: "Grounded, data-driven, and highly focused on planetary boundaries. Argues that escaping a dying Earth is a billionaire's fantasy, and that the return-on-investment of climate restoration on Earth is infinitely higher.",
        color: "green",
        avatarSeed: "maya"
      }
    ]
  }
];
