import { cn } from "@/lib/utils";

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={cn(
        "block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5",
        props.className,
      )}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted",
        "focus:outline-none focus:ring-2 focus:ring-sand/60 focus:border-sand",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        props.className,
      )}
    />
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted",
        "focus:outline-none focus:ring-2 focus:ring-sand/60 focus:border-sand",
        props.className,
      )}
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-ink",
        "focus:outline-none focus:ring-2 focus:ring-sand/60 focus:border-sand",
        props.className,
      )}
    />
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1.5 text-sm text-danger">{children}</p>;
}
