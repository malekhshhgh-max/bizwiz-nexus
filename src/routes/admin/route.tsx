import { useEffect } from "react";
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@/components/shared/Icon";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "لوحة التحكم | المستشار العزي" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminGuard,
});

function AdminGuard() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { loading, session, isStaff } = useAuth();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (loading || isLogin) return;
    if (!session) void navigate({ to: "/admin/login", replace: true });
  }, [loading, session, isLogin, navigate]);

  if (isLogin) return <Outlet />;

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <Icon name="Loader2" className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-muted/40 p-6 text-center">
        <Icon name="ShieldAlert" className="size-10 text-destructive" />
        <h1 className="font-heading text-xl">لا تملك صلاحية الوصول</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          حسابك مسجّل لكنه غير مرتبط بأي دور إداري. يرجى التواصل مع مدير النظام لمنحك الصلاحية المناسبة.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
