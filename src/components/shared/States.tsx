import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/shared/Icon";
import type { ReactNode } from "react";

export function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface-card p-6">
          <Skeleton className="mb-4 h-11 w-11 rounded-xl" />
          <Skeleton className="mb-3 h-5 w-3/4" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon = "Inbox",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Icon name={icon} className="size-6" />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="surface-card flex flex-col items-center justify-center px-6 py-12 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <Icon name="TriangleAlert" className="size-6" />
      </span>
      <h3 className="text-lg font-semibold">تعذّر تحميل البيانات</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {message || "حدث خطأ غير متوقع أثناء الاتصال. يرجى المحاولة مرة أخرى."}
      </p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          إعادة المحاولة
        </button>
      ) : null}
    </div>
  );
}
