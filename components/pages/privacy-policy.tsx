import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Highlight } from "@/components/ui/card-stack";
import { getServerLoginProviders } from "@/lib/hooks/useLoginProviders";
import { GlobeIcon, ServerIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function PrivacyPolicy() {
  const t = useTranslations();
  const selfhosted = getServerLoginProviders().selfhosted;
  return (
    <div className="flex flex-col gap-6 w-5/6 lg:w-2/3 xl:w-2/5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">{t("generic.home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/privacy">{t("external.privacy-policy")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-4xl font-bold leading-10">
        {t("external.privacy-policy")}
      </h1>
      <p>{t("privacy-policy.subtitle")}</p>
      <p className="text-sm text-muted-foreground">
        {t.rich("privacy-policy.legal-note", {
          maillink: () => (
            <Highlight colorName="blue">
              <Link href="mailto:dev@nstr.dev">dev@nstr.dev</Link>
            </Highlight>
          ),
        })}
      </p>

      <h2 className="text-2xl font-bold">
        {t("privacy-policy.what-is-collected.title")}
      </h2>
      <ul className="list-disc pl-6">
        <li>
          {t.rich("privacy-policy.what-is-collected.username", {
            note: (children) => (
              <span className="text-muted-foreground">{children}</span>
            ),
          })}
        </li>
        <li>{t("privacy-policy.what-is-collected.email")}</li>
        <li>{t("privacy-policy.what-is-collected.avatar")}</li>
        <li>
          {t.rich("privacy-policy.what-is-collected.grades", {
            note: (children) => (
              <span className="text-muted-foreground">{children}</span>
            ),
          })}
        </li>
      </ul>

      <h2 className="text-2xl font-bold">
        {t("privacy-policy.data-usage.title")}
      </h2>
      {selfhosted ? (
        <p>{t("privacy-policy.data-usage.selfhosted-description")}</p>
      ) : (
        <p>{t("privacy-policy.data-usage.description")}</p>
      )}
      <h2 className="text-2xl font-bold">
        {t("privacy-policy.storage.title")}
      </h2>
      {selfhosted ? (
        <p>{t("privacy-policy.storage.selfhosted-description")}</p>
      ) : (
        <p>{t("privacy-policy.data-usage.description")}</p>
      )}

      <h2 className="text-2xl font-bold">
        {t("privacy-policy.deletion.title")}
      </h2>
      {selfhosted ? (
        <p>
          {t.rich("privacy-policy.deletion.selfhosted-description", {
            b: (children) => <b>{children}</b>,
          })}
        </p>
      ) : (
        <p>
          {t.rich("privacy-policy.deletion.description", {
            maillink: () => (
              <Highlight colorName="blue">
                <Link href="mailto:dev@nstr.dev">dev@nstr.dev</Link>
              </Highlight>
            ),
            b: (children) => <b>{children}</b>,
          })}
        </p>
      )}
      {!selfhosted && (
        <>
          <h2 className="text-2xl font-bold">
            {t("privacy-policy.security.title")}
          </h2>
          <p>{t("privacy-policy.security.description")}</p>
          <div className="flex flex-row gap-3">
            <Button
              data-umami-event="Navigate to Selfhost Guide"
              className="w-fit self-center"
              asChild
            >
              <Link
                target="_blank"
                href="https://links.nstr.dev/projects-grades?page=selfhosting"
              >
                <ServerIcon className="mr-2 size-4" />
                {t("external.self-host")}
              </Link>
            </Button>
            <Button
              data-umami-event="Navigate to Legacy Version"
              variant="secondary"
              className="w-fit self-center"
              asChild
            >
              <Link href="https://legacy.grades.nstr.dev">
                <GlobeIcon className="mr-2 size-4" />
                {t("external.legacy-version")}
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
