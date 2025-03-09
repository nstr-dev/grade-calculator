"use client";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LoginButton({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const session = useSession();
  const t = useTranslations();
  const [contents, setContents] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (!children) setContents(<>{t("auth.sign-in")}</>);
    else setContents(children);
  }, [children, t]);

  return (
    <div className={cn("items-center justify-center flex", className)}>
      {session.status === "authenticated" ? (
        <Button data-umami-event="Log out" onClick={() => signOut()}>
          {t("auth.logout")}
        </Button>
      ) : session.status === "loading" ? (
        <LoadingSpinner />
      ) : (
        <Button className={className} asChild>
          <Link href="/login">{contents}</Link>
        </Button>
      )}
    </div>
  );
}
