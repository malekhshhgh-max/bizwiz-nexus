import { Link, type LinkComponentProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

type AppLinkProps = Omit<LinkComponentProps<"a">, "to"> & { to: string; children?: ReactNode };

/** Link wrapper that accepts CMS-managed (runtime) URLs. */
export function AppLink({ to, ...rest }: AppLinkProps) {
  const isExternal = /^(https?:)?\/\//.test(to) || to.startsWith("mailto:") || to.startsWith("tel:");
  if (isExternal) {
    return <a href={to} target="_blank" rel="noreferrer noopener" {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }
  return <Link to={to as LinkComponentProps<"a">["to"]} {...rest} />;
}
