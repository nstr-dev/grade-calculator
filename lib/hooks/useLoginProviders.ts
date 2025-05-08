import { getProvidersByEnvironment } from "@/lib/loginProviderRoute";
import { useQuery } from "@tanstack/react-query";

async function fetchProviders() {
  const res = await fetch("/api/providers");
  if (!res.ok) throw new Error("Failed to fetch providers");
  return res.json();
}

export function useLoginProviders() {
  return useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
    staleTime: 1000 * 60 * 5,
  });
}

export function getServerLoginProviders() {
  return getProvidersByEnvironment();
}
