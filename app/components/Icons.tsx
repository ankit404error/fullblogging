'use client';
import {
  BookOpen,
  Calendar,
  Tag,
  Clock,
  ChevronRight,
  Heart,
  Search,
  Plus,
  TrendingUp,
  Users,
  Menu,
  X,
  Grid,
  List,
  ChevronDown,
  Send,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  Save,
  Filter,
  Check,
  type LucideIcon
} from 'lucide-react';

export const Icons = {
  book: BookOpen,
  menu: Menu,
  close: X,
  grid: Grid,
  list: List,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  search: Search,
  plus: Plus,
  send: Send,
  save: Save,
  eye: Eye,
  eyeOff: EyeOff,
  filter: Filter,
  check: Check,
  fileText: FileText,
  calendar: Calendar,
  tag: Tag,
  clock: Clock,
  heart: Heart,
  trendingUp: TrendingUp,
  users: Users,
  alertCircle: AlertCircle,
  checkCircle: CheckCircle2,
  loader: Loader2,
} as const;

export interface IconProps {
  icon: keyof typeof Icons;
  className?: string;
  size?: number;
}

export function Icon({ icon, className, size }: IconProps) {
  const IconComponent = Icons[icon];
  return <IconComponent className={className} size={size} />;
}

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
} as const;

export function AnimatedIcon({ 
  icon, 
  className = '', 
  size,
  animate = false,
  animationType = 'spin'
}: IconProps & { 
  animate?: boolean; 
  animationType?: 'spin' | 'pulse' | 'bounce';
}) {
  const IconComponent = Icons[icon];
  const animationClass = animate ? `animate-${animationType}` : '';
  
  return <IconComponent className={`${className} ${animationClass}`} size={size} />;
}

export default Icons;