import { PageLoader } from "@/components/ui/Spinner";

export default function JobDetailLoading() {
  return <PageLoader message="Loading job details…" className="min-h-[60vh]" />;
}
