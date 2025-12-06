import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

const STATUS_ENDPOINT = "/api/status"; 
// Worker returns { status: "ok" | "error", latency: number }

async function fetchStatus(): Promise<{ status: string; latency: number }> {
  const start = performance.now();
  try {
    const res = await fetch(STATUS_ENDPOINT, { method: "GET" });
    if (!res.ok) throw new Error("Status check failed");
    const data = await res.json();
    const latency = Math.round(performance.now() - start);
    return { ...data, latency };
  } catch (_) {
    return { status: "error", latency: 0 };
  }
}

// -------------------------------------------------------------
// BADGE (Header)
// -------------------------------------------------------------
export function ApiStatusBadge() {
  const { data, isFetching } = useQuery({
    queryKey: ["api-status"],
    queryFn: fetchStatus,
    refetchInterval: 5000,
  });

  const status = data?.status;

  if (isFetching) {
    return (
      <Badge variant="outline" className="flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        Checking…
      </Badge>
    );
  }

  if (status === "ok") {
    return (
      <Badge variant="secondary" className="flex items-center gap-1 text-xs">
        <CheckCircle className="h-3 w-3 text-chart-4" />
        Online ({data?.latency}ms)
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="flex items-center gap-1 text-xs">
      <AlertCircle className="h-3 w-3" />
      Offline
    </Badge>
  );
}

// -------------------------------------------------------------
// BANNER (Shown below header if error)
// -------------------------------------------------------------
export function ApiStatusBanner() {
  const { data } = useQuery({
    queryKey: ["api-status"],
    queryFn: fetchStatus,
    refetchInterval: 5000,
  });

  if (!data || data.status === "ok") return null;

  return (
    <div className="w-full bg-destructive/15 border-b border-destructive p-3 text-sm flex items-center gap-2 text-destructive">
      <AlertCircle className="h-4 w-4" />
      Cloudflare Worker is offline — the AI features may not work.
    </div>
  );
}
