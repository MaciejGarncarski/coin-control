import { createFileRoute } from "@tanstack/react-router";
import { jakisTest } from "@shared/zod-schemas";
import { useLoginMutation } from "@/features/auth/login/api/login";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const mutation = useLoginMutation();

  return (
    <div className="text-center">
      {jakisTest}
      <button type="button" onClick={() => mutation.mutate()}>
        Mutat
      </button>
    </div>
  );
}
