import AppShell from "@/components/AppShell";
import { Suspense, type ReactNode } from "react";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-slate-400">
          Loading…
        </div>
      }
    >
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
