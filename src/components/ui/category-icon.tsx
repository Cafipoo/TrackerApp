"use client"

import { cn } from "@/lib/utils"
import { 
  Heart, 
  Brain, 
  Dumbbell, 
  BookOpen, 
  Coffee, 
  Moon, 
  Sun, 
  Music, 
  Gamepad2, 
  Car, 
  Home, 
  Briefcase, 
  Utensils, 
  TreePine, 
  Camera, 
  Palette,
  Laptop,
  Phone,
  ShoppingBag,
  Star,
  Target,
  Zap,
  Shield,
  Globe,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Download,
  Upload,
  Share,
  Settings,
  User,
  Users,
  MessageCircle,
  Mail,
  PhoneCall,
  Video,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Compass,
  Flag,
  Award,
  Trophy,
  Medal,
  Crown,
  Gem,
  Diamond,
  Sparkles,
  Flame,
  Snowflake,
  Droplets,
  Wind,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sunrise,
  Sunset,
  Thermometer,
  Gauge,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  HeartHandshake,
  HandHeart,
  HandCoins,
  Coins,
  Banknote,
  CreditCard,
  Wallet,
  PiggyBank,
  Receipt,
  Calculator,
  Percent,
  Hash,
  DollarSign,
  Euro,
  PoundSterling,
  IndianRupee,
  Bitcoin,
  type LucideIcon
} from "lucide-react"

export interface CategoryIconProps {
  iconName: string
  color?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const iconMap: Record<string, LucideIcon> = {
  // Santé & Bien-être
  heart: Heart,
  brain: Brain,
  dumbbell: Dumbbell,
  activity: Activity,
  handHeart: HandHeart,
  heartHandshake: HeartHandshake,
  
  // Apprentissage & Développement
  bookOpen: BookOpen,
  laptop: Laptop,
  target: Target,
  award: Award,
  trophy: Trophy,
  medal: Medal,
  crown: Crown,
  
  // Lifestyle & Quotidien
  coffee: Coffee,
  home: Home,
  car: Car,
  utensils: Utensils,
  shoppingBag: ShoppingBag,
  briefcase: Briefcase,
  phone: Phone,
  camera: Camera,
  
  // Nature & Environnement
  treePine: TreePine,
  sun: Sun,
  moon: Moon,
  sunrise: Sunrise,
  sunset: Sunset,
  cloud: Cloud,
  cloudRain: CloudRain,
  cloudSnow: CloudSnow,
  cloudLightning: CloudLightning,
  wind: Wind,
  droplets: Droplets,
  snowflake: Snowflake,
  flame: Flame,
  
  // Créativité & Arts
  palette: Palette,
  music: Music,
  sparkles: Sparkles,
  gem: Gem,
  diamond: Diamond,
  
  // Divertissement
  gamepad2: Gamepad2,
  video: Video,
  star: Star,
  
  // Productivité & Travail
  checkCircle: CheckCircle,
  clock: Clock,
  calendar: Calendar,
  settings: Settings,
  
  // Communication
  messageCircle: MessageCircle,
  mail: Mail,
  phoneCall: PhoneCall,
  users: Users,
  user: User,
  
  // Navigation & Localisation
  mapPin: MapPin,
  navigation: Navigation,
  compass: Compass,
  flag: Flag,
  globe: Globe,
  
  // Sécurité & Protection
  shield: Shield,
  lock: Lock,
  unlock: Unlock,
  
  // Statuts & Actions
  xCircle: XCircle,
  alertCircle: AlertCircle,
  info: Info,
  plus: Plus,
  minus: Minus,
  edit: Edit,
  trash2: Trash2,
  save: Save,
  download: Download,
  upload: Upload,
  share: Share,
  
  // Météo & Environnement
  thermometer: Thermometer,
  gauge: Gauge,
  barChart3: BarChart3,
  pieChart: PieChart,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  
  // Finance
  coins: Coins,
  banknote: Banknote,
  creditCard: CreditCard,
  wallet: Wallet,
  piggyBank: PiggyBank,
  receipt: Receipt,
  calculator: Calculator,
  percent: Percent,
  hash: Hash,
  dollarSign: DollarSign,
  euro: Euro,
  poundSterling: PoundSterling,
  indianRupee: IndianRupee,
  bitcoin: Bitcoin,
  handCoins: HandCoins,
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
  xl: "h-12 w-12"
}

export function CategoryIcon({ 
  iconName, 
  color = "#3b82f6", 
  size = "md", 
  className 
}: CategoryIconProps) {
  const IconComponent = iconMap[iconName] || Heart
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-lg p-2",
        className
      )}
      style={{ backgroundColor: `${color}20` }}
    >
      <IconComponent 
        className={cn(sizeMap[size], "text-current")}
        style={{ color }}
      />
    </div>
  )
}

// Liste des catégories prédéfinies avec leurs icônes et couleurs
export const CATEGORIES = [
  {
    id: "health",
    name: "Santé & Bien-être",
    icon: "heart",
    color: "#ef4444", // Rouge
    description: "Habitudes liées à la santé physique et mentale"
  },
  {
    id: "fitness",
    name: "Sport & Fitness", 
    icon: "dumbbell",
    color: "#f97316", // Orange
    description: "Exercices et activités physiques"
  },
  {
    id: "learning",
    name: "Apprentissage",
    icon: "bookOpen", 
    color: "#eab308", // Jaune
    description: "Développement personnel et éducation"
  },
  {
    id: "productivity",
    name: "Productivité",
    icon: "target",
    color: "#22c55e", // Vert
    description: "Amélioration de l'efficacité et organisation"
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    icon: "coffee",
    color: "#06b6d4", // Cyan
    description: "Habitudes de vie quotidienne"
  },
  {
    id: "creativity",
    name: "Créativité",
    icon: "palette",
    color: "#8b5cf6", // Violet
    description: "Arts, créativité et expression"
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    icon: "brain",
    color: "#ec4899", // Rose
    description: "Méditation et bien-être mental"
  },
  {
    id: "social",
    name: "Social",
    icon: "users",
    color: "#84cc16", // Lime
    description: "Relations et interactions sociales"
  },
  {
    id: "finance",
    name: "Finance",
    icon: "coins",
    color: "#f59e0b", // Ambre
    description: "Gestion financière et économies"
  },
  {
    id: "nature",
    name: "Nature",
    icon: "treePine",
    color: "#10b981", // Emeraude
    description: "Connexion avec la nature"
  }
]

export type CategoryId = typeof CATEGORIES[number]["id"]
