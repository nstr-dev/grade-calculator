"use client";
import { EmailLoginForm } from "@/components/email-login-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Highlight } from "@/components/ui/card-stack";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useLoginProviders } from "@/lib/hooks/useLoginProviders";
import {
  SiDiscord,
  SiGithub,
  SiGoogle,
  SiOpenid,
} from "@icons-pack/react-simple-icons";
import {
  Bird,
  Clock,
  Container,
  Globe,
  MailCheck,
  RotateCcwIcon,
  ShieldEllipsisIcon,
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SignInPageComponent() {
  const providerQuery = useLoginProviders();

  const session = useSession();
  const router = useRouter();
  const t = useTranslations();
  const params = useSearchParams();
  const [error] = useState<string | null>(params.get("error"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (session.status === "authenticated") router.push("/");
  }, [session, router]);

  useEffect(() => {
    if (
      providerQuery.isLoading ||
      error ||
      session.status !== "unauthenticated"
    )
      return;
    if (providerQuery.data?.selfhosted && providerQuery.data?.noAuth) {
      signIn("noAuth");
    }
  }, [providerQuery, error, session]);

  return (
    <div className="flex flex-col gap-5 h-fit w-5/6 md:w-1/2 lg:w-1/3 xl:w-1/4">
      <Breadcrumb className="pl-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">{t("generic.home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/login">{t("auth.login")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {session.status === "unauthenticated" && !providerQuery.isLoading ? (
        <>
          {error && <AuthError error={error} />}
          <Card className="transition-all">
            <CardHeader>
              <CardTitle>{t("auth.sign-in")}</CardTitle>
              <CardDescription>{t("auth.sign-in-desc")}</CardDescription>
            </CardHeader>
            <CardContent className="gap-4 flex flex-col">
              {!providerQuery.data.selfhosted && (
                <Button
                  className="w-full"
                  data-umami-event="Sign In"
                  data-umami-event-provider="nstr-keycloak"
                  onClick={() => {
                    signIn("nstr-auth");
                  }}
                >
                  <ShieldEllipsisIcon className="mr-2 size-4" />
                  {t("auth.providers.grades")}
                </Button>
              )}
              {providerQuery.data?.selfhosted &&
                providerQuery.data?.noAuth &&
                error && (
                  <Button
                    className="w-full"
                    data-umami-event="Sign In"
                    data-umami-event-provider="Retry Selfhosted"
                    onClick={() => {
                      signIn("noAuth");
                    }}
                  >
                    <RotateCcwIcon className="mr-2 size-4" />
                    {t("auth.providers.retry")}
                  </Button>
                )}
              {providerQuery.data.mockUrl && !providerQuery.data.noAuth && (
                <Button
                  variant={"secondary"}
                  className="w-full"
                  data-umami-event="Sign In"
                  data-umami-event-provider="Local"
                  onClick={() => {
                    signIn("local");
                  }}
                >
                  <Container className="mr-2 size-4" />
                  {t("auth.providers.local")}
                </Button>
              )}
              {providerQuery.data.oidcEnabled &&
                providerQuery.data.selfhosted && (
                  <Button
                    className="w-full"
                    data-umami-event="Sign In"
                    data-umami-event-provider={
                      providerQuery.data.oidcButtonName
                    }
                    onClick={() => {
                      signIn("custom");
                    }}
                  >
                    <SiOpenid className="mr-2 size-4" />
                    {providerQuery.data.oidcButtonName}
                  </Button>
                )}

              {providerQuery.data.discordEnabled && (
                <Button
                  className="w-full"
                  data-umami-event="Sign In"
                  data-umami-event-provider="Discord"
                  onClick={() => {
                    signIn("discord");
                  }}
                >
                  <SiDiscord className="mr-2 size-4" />
                  {t("auth.providers.discord")}
                </Button>
              )}
              {providerQuery.data.githubEnabled && (
                <Button
                  className="w-full"
                  data-umami-event="Sign In"
                  data-umami-event-provider="GitHub"
                  onClick={() => {
                    signIn("github");
                  }}
                >
                  <SiGithub className="mr-2 size-4" />
                  {t("auth.providers.github")}
                </Button>
              )}
              {providerQuery.data.googleEnabled && (
                <Button
                  className="w-full"
                  data-umami-event="Sign In"
                  data-umami-event-provider="Google"
                  onClick={() => {
                    signIn("google");
                  }}
                >
                  <SiGoogle className="mr-2 size-4" />
                  {t("auth.providers.google")}
                </Button>
              )}

              {!providerQuery.data.selfhosted && (
                <>
                  <Separator />
                  <EmailLoginForm />
                  <Separator />
                  <CardDescription>
                    {t("auth.legacy.description")}
                  </CardDescription>
                  <Button
                    data-umami-event="Navigate to Legacy Version"
                    variant={"secondary"}
                    asChild
                  >
                    <Link href="https://legacy.grades.nstr.dev">
                      <Globe className="size-4 mr-2" />
                      {t("external.legacy-version")}
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
          {providerQuery.data.oidcEnabled && !providerQuery.data.selfhosted && (
            <button
              className="text-muted-foreground text-sm"
              data-umami-event="Sign In"
              data-umami-event-provider={providerQuery.data.oidcButtonName}
              onClick={() => {
                signIn("custom");
              }}
            >
              Log in with <b>{providerQuery.data.oidcButtonName}</b>
            </button>
          )}
        </>
      ) : (
        <Card className="transition-all">
          <CardHeader>
            <CardTitle>{t("auth.sign-in")}</CardTitle>
            <CardDescription>{t("auth.sign-in-desc")} </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <LoadingSpinner />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function SentEmailComponent() {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-5 h-fit w-5/6 md:w-1/2 lg:w-1/3 xl:w-1/4">
      <Breadcrumb className="pl-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">{t("generic.home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/login">{t("auth.login")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/login/sent">{t("auth.sent-mail")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="transition-all">
        <CardHeader>
          <CardTitle>{t("auth.providers.email")}</CardTitle>
          <CardDescription>{t("auth.check-spam")} </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center gap-4">
          <div className="flex flex-row items-center gap-2">
            <MailCheck className="size-4 flex-shrink-0" />
            <p>
              {t.rich("auth.sent-mail-desc", {
                highlight: (children) => <Highlight>{children}</Highlight>,
              })}
            </p>
          </div>
          <p className="text-muted-foreground flex flex-row gap-2 items-center">
            <Clock className="size-4 flex-shrink-0" />
            {t("auth.sent-mail-might-take-a-moment")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AuthError({ error }: { error: string }) {
  const t = useTranslations();
  return (
    <Alert className="border-red-400 border-2 shadow-lg">
      <Bird className="size-4" />
      <div className="flex flex-col gap-2">
        <AlertTitle>{t("errors.something-broke")}</AlertTitle>
        <Separator />
        <AlertDescription className="space-y-1">
          {t.rich("errors.try-again-or-contact", {
            mailbutton: () => (
              <Button
                data-umami-event="Contact Support"
                asChild
                variant={"link"}
                className="m-0 p-0 h-fit font-bold"
              >
                <Link href="mailto:dev@nstr.dev">dev@nstr.dev</Link>
              </Button>
            ),
          })}
          <p className="text-muted-foreground font-mono">
            {t("errors.code")} {error}
          </p>
        </AlertDescription>
      </div>
    </Alert>
  );
}
