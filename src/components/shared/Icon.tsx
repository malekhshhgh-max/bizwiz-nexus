import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconMap = Record<string, React.ComponentType<LucideProps>>;
type IconProps = Omit<LucideProps, "name"> & { name?: string | null | undefined };

export function Icon({ name, ...props }: IconProps) {
  const map = LucideIcons as unknown as IconMap;
  const Cmp = (name && map[name]) || LucideIcons.Sparkles;
  return <Cmp {...props} />;
}
