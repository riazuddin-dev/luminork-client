import { PageLoader } from "@/components/ui/Spinner";

export default function AuthLoading() {
  return <PageLoader message="Loading…" className="min-h-[70vh]" />;
}
