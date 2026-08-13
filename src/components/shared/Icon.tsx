import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconMap = Record<string, React.ComponentType<LucideProps>>;

export function Icon({ name, ...props }: { name?: string | null } & LucideProps) {
  const map = LucideIcons as unknown as IconMap;
  const Cmp = (name && map[name]) || LucideIcons.Sparkles;
  return <Cmp {...props} />;
}
