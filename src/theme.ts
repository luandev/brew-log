export const colors = {
  bg: "#0E0F10",
  text: "#F2EBD9",
  orchard: "#6C7C44",
  brass: "#AD9753",
  panel: "#14161a",
  border: "rgba(173, 151, 83, 0.45)",
  muted: "#c4bba8",
  dim: "#8f8779",
};

export const site = {
  title: "The Lone Tree Orchard",
  journal: "Brew Log",
  tagline: "Record the process. Refine the craft.",
  description: "Small batches. Seasonal ingredients. Thoughtful experiments.",
  heroTagline: "They didn't expect we'd vibecode alcohol as well.",
  heroSubtagline: "Personal blog about the journey of learning how to brew.",
  github: "https://github.com/luandev/brew-log",
};

export const statusColors: Record<string, { background: string; color: string; border: string }> = {
  "primary-fermentation": {
    background: "rgba(108, 124, 68, 0.2)",
    color: "#a8c070",
    border: "rgba(108, 124, 68, 0.4)",
  },
  secondary: {
    background: "rgba(108, 124, 68, 0.2)",
    color: "#a8c070",
    border: "rgba(108, 124, 68, 0.4)",
  },
  clearing: {
    background: "rgba(108, 124, 68, 0.2)",
    color: "#a8c070",
    border: "rgba(108, 124, 68, 0.4)",
  },
  conditioning: {
    background: "rgba(108, 124, 68, 0.2)",
    color: "#a8c070",
    border: "rgba(108, 124, 68, 0.4)",
  },
  bottled: {
    background: "rgba(173, 151, 83, 0.15)",
    color: "#AD9753",
    border: "rgba(173, 151, 83, 0.35)",
  },
  aging: {
    background: "rgba(173, 151, 83, 0.15)",
    color: "#AD9753",
    border: "rgba(173, 151, 83, 0.35)",
  },
  finished: {
    background: "rgba(108, 124, 68, 0.25)",
    color: "#b8d080",
    border: "rgba(108, 124, 68, 0.5)",
  },
  failed: {
    background: "rgba(180, 80, 70, 0.15)",
    color: "#d08078",
    border: "rgba(180, 80, 70, 0.35)",
  },
  planned: {
    background: "rgba(140, 120, 180, 0.12)",
    color: "#b0a0d0",
    border: "rgba(140, 120, 180, 0.3)",
  },
  preparing: {
    background: "rgba(140, 120, 180, 0.12)",
    color: "#b0a0d0",
    border: "rgba(140, 120, 180, 0.3)",
  },
};

export const navItems = [
  { href: "/", label: "Brew Log" },
  { href: "/pages/batches", label: "Batches" },
  { href: "/pages/schedule", label: "Schedule" },
  { href: "/wiki", label: "Wiki" },
] as const;
