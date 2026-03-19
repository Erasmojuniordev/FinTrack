import {
  Home, Utensils, Car, HeartPulse, GraduationCap, Gamepad2,
  TrendingUp, Briefcase, Laptop, Tag, type LucideIcon,
} from 'lucide-react';

/**
 * Mapeia os nomes de ícone armazenados no banco (kebab-case)
 * para os componentes Lucide React correspondentes (PascalCase).
 *
 * Ao adicionar novas categorias, basta inserir a entrada aqui.
 */
const iconMap: Record<string, LucideIcon> = {
  'home': Home,
  'utensils': Utensils,
  'car': Car,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'gamepad-2': Gamepad2,
  'trending-up': TrendingUp,
  'briefcase': Briefcase,
  'laptop': Laptop,
  'tag': Tag,
};

interface CategoryIconProps {
  name: string | null;
  size?: number;
  color?: string;
}

/**
 * Renderiza o ícone de uma categoria a partir do nome armazenado no banco.
 * Fallback para Tag se o nome não for encontrado.
 */
export const CategoryIcon = ({ name, size = 16, color }: CategoryIconProps) => {
  const Icon = (name ? iconMap[name] : null) ?? Tag;
  return <Icon size={size} color={color} strokeWidth={2} />;
};
