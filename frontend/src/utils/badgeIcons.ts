import {
  Hammer, Wrench, Cog, Boxes, Package, Rocket, Zap, Flame, Anchor, Pickaxe,
  Lightbulb, Search, Microscope, Telescope, Radar, BookOpen, GraduationCap,
  FlaskConical, Beaker, Brain, Puzzle, Map, Compass, Route, Milestone,
  Code, Code2, Terminal, Braces, GitBranch, GitMerge, Bug, Database, Server, Cloud,
  Cpu, CircuitBoard, Layers, Blocks, Component, Wand2, Sparkles, Palette, PenTool,
  Monitor, Smartphone, LayoutDashboard, Play, CheckCircle, CheckCheck, Target, Crosshair,
  Trophy, Medal, Crown, Star, Gem, Diamond, Award, Flag, Swords, Shield, ShieldCheck,
  Users, UserCheck, Handshake, MessageSquare, MessagesSquare, Megaphone, Radio, Bell,
  Mic, Presentation, Share2, Heart, HeartHandshake, ThumbsUp, Smile,
  TrendingUp, LineChart, BarChart3, Activity, Gauge, Timer, Clock, CalendarCheck,
  RefreshCw, Recycle, Repeat, ArrowUpRight, Move3d, Infinity as InfinityIcon,
  Eye, AlertTriangle, ShieldAlert, LifeBuoy, Lock, KeyRound, Bookmark, FileCheck,
  Mountain, Sunrise, Moon, Waves, Snowflake, Leaf, TreePine, Feather, Bird, Ghost,
  type LucideIcon
} from 'lucide-react';

export interface BadgeIconOption {
  key: string;
  label: string;
  group: string;
  Icon: LucideIcon;
}

/**
 * The catalogue an admin picks from when designing a badge. The `key` is what
 * gets stored in `Badge.icon`, so keys must stay stable once used.
 */
export const BADGE_ICONS: BadgeIconOption[] = [
  // Craft & Execution
  { key: 'hammer', label: 'Hammer', group: 'Craft', Icon: Hammer },
  { key: 'wrench', label: 'Wrench', group: 'Craft', Icon: Wrench },
  { key: 'pickaxe', label: 'Pickaxe', group: 'Craft', Icon: Pickaxe },
  { key: 'cog', label: 'Cog', group: 'Craft', Icon: Cog },
  { key: 'boxes', label: 'Boxes', group: 'Craft', Icon: Boxes },
  { key: 'package', label: 'Package', group: 'Craft', Icon: Package },
  { key: 'blocks', label: 'Blocks', group: 'Craft', Icon: Blocks },
  { key: 'component', label: 'Component', group: 'Craft', Icon: Component },
  { key: 'layers', label: 'Layers', group: 'Craft', Icon: Layers },
  { key: 'anchor', label: 'Anchor', group: 'Craft', Icon: Anchor },

  // Momentum
  { key: 'rocket', label: 'Rocket', group: 'Momentum', Icon: Rocket },
  { key: 'zap', label: 'Lightning', group: 'Momentum', Icon: Zap },
  { key: 'flame', label: 'Flame', group: 'Momentum', Icon: Flame },
  { key: 'activity', label: 'Pulse', group: 'Momentum', Icon: Activity },
  { key: 'gauge', label: 'Gauge', group: 'Momentum', Icon: Gauge },
  { key: 'arrow-up-right', label: 'Rising Arrow', group: 'Momentum', Icon: ArrowUpRight },
  { key: 'trending-up', label: 'Trending Up', group: 'Momentum', Icon: TrendingUp },
  { key: 'infinity', label: 'Infinity', group: 'Momentum', Icon: InfinityIcon },

  // Research & Insight
  { key: 'lightbulb', label: 'Lightbulb', group: 'Research', Icon: Lightbulb },
  { key: 'search', label: 'Search', group: 'Research', Icon: Search },
  { key: 'microscope', label: 'Microscope', group: 'Research', Icon: Microscope },
  { key: 'telescope', label: 'Telescope', group: 'Research', Icon: Telescope },
  { key: 'radar', label: 'Radar', group: 'Research', Icon: Radar },
  { key: 'flask', label: 'Flask', group: 'Research', Icon: FlaskConical },
  { key: 'beaker', label: 'Beaker', group: 'Research', Icon: Beaker },
  { key: 'brain', label: 'Brain', group: 'Research', Icon: Brain },
  { key: 'puzzle', label: 'Puzzle', group: 'Research', Icon: Puzzle },
  { key: 'book-open', label: 'Open Book', group: 'Research', Icon: BookOpen },
  { key: 'graduation-cap', label: 'Graduation Cap', group: 'Research', Icon: GraduationCap },
  { key: 'eye', label: 'Eye', group: 'Research', Icon: Eye },

  // Direction
  { key: 'compass', label: 'Compass', group: 'Direction', Icon: Compass },
  { key: 'map', label: 'Map', group: 'Direction', Icon: Map },
  { key: 'route', label: 'Route', group: 'Direction', Icon: Route },
  { key: 'milestone', label: 'Milestone', group: 'Direction', Icon: Milestone },
  { key: 'flag', label: 'Flag', group: 'Direction', Icon: Flag },
  { key: 'target', label: 'Target', group: 'Direction', Icon: Target },
  { key: 'crosshair', label: 'Crosshair', group: 'Direction', Icon: Crosshair },
  { key: 'mountain', label: 'Summit', group: 'Direction', Icon: Mountain },

  // Engineering
  { key: 'code', label: 'Code', group: 'Engineering', Icon: Code },
  { key: 'code-2', label: 'Code Block', group: 'Engineering', Icon: Code2 },
  { key: 'terminal', label: 'Terminal', group: 'Engineering', Icon: Terminal },
  { key: 'braces', label: 'Braces', group: 'Engineering', Icon: Braces },
  { key: 'git-branch', label: 'Git Branch', group: 'Engineering', Icon: GitBranch },
  { key: 'git-merge', label: 'Git Merge', group: 'Engineering', Icon: GitMerge },
  { key: 'bug', label: 'Bug', group: 'Engineering', Icon: Bug },
  { key: 'database', label: 'Database', group: 'Engineering', Icon: Database },
  { key: 'server', label: 'Server', group: 'Engineering', Icon: Server },
  { key: 'cloud', label: 'Cloud', group: 'Engineering', Icon: Cloud },
  { key: 'cpu', label: 'CPU', group: 'Engineering', Icon: Cpu },
  { key: 'circuit-board', label: 'Circuit Board', group: 'Engineering', Icon: CircuitBoard },

  // Product & Craft Polish
  { key: 'wand', label: 'Magic Wand', group: 'Product', Icon: Wand2 },
  { key: 'sparkles', label: 'Sparkles', group: 'Product', Icon: Sparkles },
  { key: 'palette', label: 'Palette', group: 'Product', Icon: Palette },
  { key: 'pen-tool', label: 'Pen Tool', group: 'Product', Icon: PenTool },
  { key: 'monitor', label: 'Monitor', group: 'Product', Icon: Monitor },
  { key: 'smartphone', label: 'Mobile', group: 'Product', Icon: Smartphone },
  { key: 'dashboard', label: 'Dashboard', group: 'Product', Icon: LayoutDashboard },
  { key: 'play', label: 'Play', group: 'Product', Icon: Play },
  { key: 'check-circle', label: 'Check Circle', group: 'Product', Icon: CheckCircle },
  { key: 'check-check', label: 'Double Check', group: 'Product', Icon: CheckCheck },
  { key: 'file-check', label: 'Verified Doc', group: 'Product', Icon: FileCheck },

  // Honours
  { key: 'trophy', label: 'Trophy', group: 'Honours', Icon: Trophy },
  { key: 'medal', label: 'Medal', group: 'Honours', Icon: Medal },
  { key: 'crown', label: 'Crown', group: 'Honours', Icon: Crown },
  { key: 'star', label: 'Star', group: 'Honours', Icon: Star },
  { key: 'gem', label: 'Gem', group: 'Honours', Icon: Gem },
  { key: 'diamond', label: 'Diamond', group: 'Honours', Icon: Diamond },
  { key: 'award', label: 'Award', group: 'Honours', Icon: Award },
  { key: 'swords', label: 'Swords', group: 'Honours', Icon: Swords },
  { key: 'shield', label: 'Shield', group: 'Honours', Icon: Shield },
  { key: 'shield-check', label: 'Shield Check', group: 'Honours', Icon: ShieldCheck },

  // People & Communication
  { key: 'users', label: 'Team', group: 'People', Icon: Users },
  { key: 'user-check', label: 'Reliable', group: 'People', Icon: UserCheck },
  { key: 'handshake', label: 'Handshake', group: 'People', Icon: Handshake },
  { key: 'message-square', label: 'Message', group: 'People', Icon: MessageSquare },
  { key: 'messages-square', label: 'Conversation', group: 'People', Icon: MessagesSquare },
  { key: 'megaphone', label: 'Megaphone', group: 'People', Icon: Megaphone },
  { key: 'radio', label: 'Signal', group: 'People', Icon: Radio },
  { key: 'bell', label: 'Bell', group: 'People', Icon: Bell },
  { key: 'mic', label: 'Microphone', group: 'People', Icon: Mic },
  { key: 'presentation', label: 'Presentation', group: 'People', Icon: Presentation },
  { key: 'share', label: 'Share', group: 'People', Icon: Share2 },
  { key: 'heart', label: 'Heart', group: 'People', Icon: Heart },
  { key: 'heart-handshake', label: 'Mentorship', group: 'People', Icon: HeartHandshake },
  { key: 'thumbs-up', label: 'Thumbs Up', group: 'People', Icon: ThumbsUp },
  { key: 'smile', label: 'Smile', group: 'People', Icon: Smile },

  // Growth & Discipline
  { key: 'line-chart', label: 'Line Chart', group: 'Growth', Icon: LineChart },
  { key: 'bar-chart', label: 'Bar Chart', group: 'Growth', Icon: BarChart3 },
  { key: 'refresh', label: 'Refresh', group: 'Growth', Icon: RefreshCw },
  { key: 'recycle', label: 'Iterate', group: 'Growth', Icon: Recycle },
  { key: 'repeat', label: 'Repeat', group: 'Growth', Icon: Repeat },
  { key: 'timer', label: 'Timer', group: 'Growth', Icon: Timer },
  { key: 'clock', label: 'Clock', group: 'Growth', Icon: Clock },
  { key: 'calendar-check', label: 'Calendar Check', group: 'Growth', Icon: CalendarCheck },
  { key: 'move-3d', label: 'Dimension', group: 'Growth', Icon: Move3d },

  // Risk & Care
  { key: 'alert-triangle', label: 'Warning', group: 'Risk', Icon: AlertTriangle },
  { key: 'shield-alert', label: 'Shield Alert', group: 'Risk', Icon: ShieldAlert },
  { key: 'life-buoy', label: 'Life Buoy', group: 'Risk', Icon: LifeBuoy },
  { key: 'lock', label: 'Lock', group: 'Risk', Icon: Lock },
  { key: 'key', label: 'Key', group: 'Risk', Icon: KeyRound },
  { key: 'bookmark', label: 'Bookmark', group: 'Risk', Icon: Bookmark },

  // Character
  { key: 'sunrise', label: 'Sunrise', group: 'Character', Icon: Sunrise },
  { key: 'moon', label: 'Moon', group: 'Character', Icon: Moon },
  { key: 'waves', label: 'Waves', group: 'Character', Icon: Waves },
  { key: 'snowflake', label: 'Snowflake', group: 'Character', Icon: Snowflake },
  { key: 'leaf', label: 'Leaf', group: 'Character', Icon: Leaf },
  { key: 'tree-pine', label: 'Pine', group: 'Character', Icon: TreePine },
  { key: 'feather', label: 'Feather', group: 'Character', Icon: Feather },
  { key: 'bird', label: 'Bird', group: 'Character', Icon: Bird },
  { key: 'ghost', label: 'Ghost', group: 'Character', Icon: Ghost }
];

export const BADGE_ICON_GROUPS = [...new Set(BADGE_ICONS.map(i => i.group))];

const ICONS_BY_KEY = new Map(BADGE_ICONS.map(i => [i.key, i]));

/**
 * Badges created before the catalogue existed store a PascalCase name derived
 * from the badge itself (e.g. "ClarityMaker"). Map those onto catalogue keys so
 * they keep rendering, and so editing one lands on a sensible pre-selection.
 */
const LEGACY_ICON_ALIASES: Record<string, string> = {
  Builder: 'hammer',
  Innovator: 'lightbulb',
  Collaborator: 'users',
  Pathfinder: 'compass',
  Pioneer: 'flag',
  Researcher: 'search',
  DeepDiver: 'microscope',
  TechScout: 'telescope',
  ClarityMaker: 'layers',
  RiskSpotter: 'alert-triangle',
  DemoMaker: 'play',
  POCFinisher: 'check-circle',
  ShowDontTell: 'monitor',
  PrototypePolisher: 'sparkles',
  FromIdeaToScreen: 'dashboard',
  ClearCommunicator: 'message-square',
  DailySignal: 'radio',
  NoGhosting: 'user-check',
  EarlyWarner: 'bell',
  FeedbackReceiver: 'thumbs-up',
  SelfAwareCube: 'brain',
  NoExcuses: 'shield',
  BetterNextTime: 'refresh',
  GrowthMindset: 'trending-up',
  OwnYourWork: 'award',
  MissionLead: 'crown',
  TeamOrganizer: 'calendar-check',
  InitiativeTaker: 'zap',
  MentorMindset: 'heart-handshake',
  FutureLead: 'star'
};

/** Resolves a stored icon value to a catalogue key, following legacy aliases. */
export const resolveIconKey = (stored?: string | null): string => {
  if (!stored) return 'award';
  if (ICONS_BY_KEY.has(stored)) return stored;
  const alias = LEGACY_ICON_ALIASES[stored];
  if (alias && ICONS_BY_KEY.has(alias)) return alias;
  // Tolerate case/spacing drift before giving up
  const normalized = stored.trim().toLowerCase().replace(/[\s_]+/g, '-');
  return ICONS_BY_KEY.has(normalized) ? normalized : 'award';
};

/** The icon component for a stored icon value. Never throws. */
export const getBadgeIcon = (stored?: string | null): LucideIcon =>
  ICONS_BY_KEY.get(resolveIconKey(stored))?.Icon || Award;

export const getBadgeIconLabel = (stored?: string | null): string =>
  ICONS_BY_KEY.get(resolveIconKey(stored))?.label || 'Award';
