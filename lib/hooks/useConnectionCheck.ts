import { useQuery } from "@tanstack/react-query";

async function checkConnectionToBackend() {
  try {
    const res = await fetch("/api/status");
    if (!res.ok) return false;
    const data = await res.json();
    console.log(data.status === "UP");
    return data.status === "UP";
  } catch {
    return false;
  }
}

async function checkConnectionToInternet() {
  try {
    const res = await fetch("https://httpbin.org/status/200");
    if (!res.ok) return false;
    return true;
  } catch {
    return false;
  }
}

async function checkConnections() {
  return {
    backend: await checkConnectionToBackend(),
    internet: await checkConnectionToInternet(),
  };
}

export function useConnectionChecks() {
  return useQuery({
    queryKey: ["connectionChecks"],
    queryFn: checkConnections,
    staleTime: 1000 * 5,
  });
}
