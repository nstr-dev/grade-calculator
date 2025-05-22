import { OfflinePage } from "@/components/pages/offline-page";

export const dynamic = "force-static";
export default function Offline() {
  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <OfflinePage />
    </>
  );
}
