import { Link } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ComponentType } from "react";

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

const RouterLink = Link as unknown as ComponentType<AppLinkProps>;

/** Link wrapper that accepts CMS-managed (runtime) URLs and external links. */
export function AppLink({ to, ...rest }: AppLinkProps) {
  const isExternal =
    /^(https?:)?\/\//.test(to) || to.startsWith("mailto:") || to.startsWith("tel:") || to.startsWith("#");
  if (isExternal) return <a href={to} rel="noreferrer noopener" {...rest} />;
  return <RouterLink to={to} {...rest} />;
}
