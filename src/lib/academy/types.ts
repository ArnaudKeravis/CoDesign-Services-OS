export const SEGMENTS = ["WORK", "PLAY", "HEAL", "LEARN"] as const;
export type Segment = (typeof SEGMENTS)[number];

export const LEVELS = ["N0", "N1", "N2", "N3", "N4"] as const;
export type LevelCode = (typeof LEVELS)[number];

export const BLOCK_TYPES = [
  "foundation",
  "source_block",
  "proposed_extension",
] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export type LinkItem = { label: string; url: string };
export type AgentLink = { name: string; url: string };

export type MethodBlock = {
  id: string;
  name: string;
  phase: string;
  sub: string;
  lvl: LevelCode;
  primary: Segment;
  obj: string;
  who: string;
  acc: string;
  when: string;
  inputs: string;
  steps: string[];
  output: string;
  std: string;
  quality: string;
  mistakes: string;
  handoff: string;
  example: string;
  var: Partial<Record<Segment, string>>;
  cred: string;
  tools: string;
  deck: string;
  prompt: string;
  verify: string;
  fallback: string;
  l_obj: string;
  explain: string;
  type: BlockType;
  templates: LinkItem[];
  os_agents: AgentLink[];
  exercise: { situation: string; questions: string[] };
  answer_key: { sample_answer: string; success_criteria: string };
  miro_frame_url: string;
};

export type CampusSection = {
  code: string;
  name: string;
  subtitle: string;
};

export type CasePack = {
  name: string;
  client: string;
  challenge: string;
  users: string;
  constraints: string;
  evidence: string[];
  persona: string;
  journey: string[];
  insights: string[];
  hmw: string[];
  workshop_inputs: string;
  ideas: string[];
  priorities: string;
  test: string;
  credentials: string;
};

export type AgendaItem = {
  start: string;
  end: string;
  activity: string;
  minutes: number;
};

export type LearningRoute = {
  study: string[];
  practise: string[];
  observe: string[];
  defer: string[];
};

export type WorkshopFormat = {
  name: string;
  agenda: AgendaItem[];
  learning_route: LearningRoute;
};

export type Conflict = {
  topic: string;
  sources_say: string;
  proposed_resolution: string;
  owner: string;
};

export type Source = {
  id: string;
  name: string;
  version: string;
  status: string;
  parts: string;
  reused: string;
  url: string;
  gap: string;
  owner: string;
};

export type Campus = {
  meta: {
    name: string;
    version: string;
    date: string;
    owner: string;
    status: string;
    note: string;
  };
  taxonomy: string;
  sections: CampusSection[];
  lanes: { code: string; name: string }[];
  levels: { code: LevelCode; label: string }[];
  segments: Segment[];
  blocks: MethodBlock[];
  case_packs: Record<Segment, CasePack>;
  workshop_formats: Record<"A" | "B", WorkshopFormat>;
  rehearsal_template: { segment: string; minutes: number }[];
  maturity_scale: { step: number; title: string; text: string; maps_to: string }[];
  rubric_dimensions: string[];
  proposed_calendar: { when: string; what: string; owner: string; status: string }[];
  sources: Source[];
  conflicts: Conflict[];
  miro_board: string;
};
