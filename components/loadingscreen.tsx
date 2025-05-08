"use client";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useLoginProviders } from "@/lib/hooks/useLoginProviders";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

export function LoadingScreen() {
  const session = useSession();
  const providerQuery = useLoginProviders();

  const show =
    session.status === "loading" ||
    (providerQuery.isFetching && !providerQuery.data);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="items-center gap-8 flex flex-col">
            <h1 className="text-4xl font-bold tracking-tight text-white-900 sm:text-6xl">
              Grade
              <br />
              Calculator
            </h1>
            <LoadingSpinner size="50" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
