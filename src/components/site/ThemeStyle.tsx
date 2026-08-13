import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/cms/api";

const TOKEN_MAP: Record<string, string> = {
  primary: "--primary",
  secondary: "--secondary",
  accent: "--accent",
  background: "--background",
  surface: "--surface",
  foreground: "--foreground",
  muted: "--muted-foreground",
  border: "--border",
  radius: "--radius",
  container_width: "--container-width",
};

const SAFE = /^[a-zA-Z0-9()%.,\-#/ ]+$/;

export function ThemeStyle() {
  const { data } = useQuery(settingsQuery);
  const theme = (data?.["theme"] ?? {}) as Record<string, unknown>;

  const decls: string[] = [];
  for (const [key, token] of Object.entries(TOKEN_MAP)) {
    const value = theme[key];
    if (typeof value === "string" && value.trim() && SAFE.test(value)) {
      decls.push(`${token}: ${value.trim()};`);
    }
  }
  const heading = theme["heading_font"];
  const body = theme["body_font"];
  if (typeof heading === "string" && SAFE.test(heading) && heading.trim()) {
    decls.push(`--font-heading-family: "${heading.trim()}", system-ui, sans-serif;`);
  }
  if (typeof body === "string" && SAFE.test(body) && body.trim()) {
    decls.push(`--font-body-family: "${body.trim()}", system-ui, sans-serif;`);
  }
  if (decls.length === 0) return null;
  return <style dangerouslySetInnerHTML={{ __html: `:root{${decls.join("")}}` }} />;
}
