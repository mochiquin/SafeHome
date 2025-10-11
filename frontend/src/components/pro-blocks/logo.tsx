import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <span className="text-sm font-bold">SH</span>
      </div>
      <span className="text-xl font-bold text-foreground">SafeHome</span>
    </div>
  );
}
