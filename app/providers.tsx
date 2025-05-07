"use client";
import { CategoryProvider } from "@/components/category-provider";
import { PreferencesProvider } from "@/components/preferences-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <PreferencesProvider>
            <CategoryProvider>{children}</CategoryProvider>
          </PreferencesProvider>
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
