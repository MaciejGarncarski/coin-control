import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <form>
        siema
        <Button type="submit">Siema</Button>
      </form>
    </main>
  );
}
