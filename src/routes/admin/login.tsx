import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/shared/Icon";
import { AppLink } from "@/components/shared/AppLink";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

const schema = z.object({
  email: z.string().trim().email("بريد إلكتروني غير صحيح").max(255),
  password: z.string().min(6, "كلمة المرور 6 أحرف على الأقل").max(72),
});

function AdminLogin() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) void navigate({ to: "/admin", replace: true });
  }, [session, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "بيانات غير صحيحة");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw new Error(error.message);
        toast.success("مرحباً بعودتك");
      } else {
        const { error } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw new Error(error.message);
        toast.success("تم إنشاء الحساب. تحقق من بريدك إن طُلب التأكيد.");
      }
      void navigate({ to: "/admin", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Icon name="ShieldCheck" className="size-6" />
          </span>
          <h1 className="mt-4 font-heading text-xl">
            {mode === "signin" ? "تسجيل دخول لوحة التحكم" : "إنشاء حساب إداري"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">المستشار العزي للمشروع — نظام إدارة المحتوى</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "جارٍ المعالجة…" : mode === "signin" ? "دخول" : "إنشاء الحساب"}
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between text-xs">
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "إنشاء حساب جديد" : "لدي حساب بالفعل"}
          </button>
          <AppLink to="/" className="text-muted-foreground hover:text-foreground">
            العودة للموقع
          </AppLink>
        </div>
      </Card>
    </div>
  );
}
