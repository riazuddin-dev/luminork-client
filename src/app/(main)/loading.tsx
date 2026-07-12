import { PageLoader } from "@/components/ui/Spinner";

export default function MainLoading() {
  return <PageLoader message="Loading page…" className="min-h-[50vh]" />;
}
