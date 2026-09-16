import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TechShell } from "@/components/shells";

export const Route = createFileRoute("/tech")({
  component: () => (
    <TechShell>
      <Outlet />
    </TechShell>
  ),
});
