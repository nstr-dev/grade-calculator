import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Highlight } from "@/components/ui/card-stack";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CookiePolicy() {
  const t = useTranslations();
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
              <Link href="/cookies">{t("external.cookie-policy")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-4xl font-bold leading-10">
        {t("cookie-policy.title")}
      </h1>
      <p>{t("cookie-policy.subtitle")}</p>
      <p className="text-sm text-muted-foreground">
        {t.rich("cookie-policy.legal-note", {
          maillink: () => (
            <Highlight colorName="blue">
              <Link href="mailto:dev@nstr.dev">dev@nstr.dev</Link>
            </Highlight>
          ),
        })}
      </p>

      <h2 className="text-2xl font-bold">
        {t("cookie-policy.what-is-saved.title")}
      </h2>
      <ul className="list-disc pl-6">
        <li>
          {t.rich("cookie-policy.what-is-saved.cookieConsent", {
            code: (children: any) => (
              <code className="text-muted-foreground font-bold">
                {children}
              </code>
            ),
          })}
        </li>
        <li>
          {t.rich("cookie-policy.what-is-saved.nextauth-callback-url", {
            code: (children: any) => (
              <code className="text-muted-foreground font-bold">
                {children}
              </code>
            ),
          })}
        </li>
        <li>
          {t.rich("cookie-policy.what-is-saved.session-and-csrf-tokens", {
            code: (children: any) => (
              <code className="text-muted-foreground font-bold">
                {children}
              </code>
            ),
          })}
        </li>
        <li>
          {t.rich("cookie-policy.what-is-saved.locale", {
            code: (children: any) => (
              <code className="text-muted-foreground font-bold">
                {children}
              </code>
            ),
          })}
        </li>
      </ul>

      <p>{t("cookie-policy.what-is-saved.justification")}</p>

      <h2 className="text-2xl font-bold">
        {t("cookie-policy.i-dont-want-cookies.title")}
      </h2>
      <p>{t("cookie-policy.i-dont-want-cookies.how-to-clear-cookies")} </p>
      <p>{t("cookie-policy.i-dont-want-cookies.legacy-ad")} </p>
      <Button
        data-umami-event="Navigate to Legacy Version"
        variant="secondary"
        className="w-fit self-center"
        asChild
      >
        <Link href="https://legacy.grades.nstr.dev">
          {t("external.legacy-version")}
        </Link>
      </Button>
    </div>
  );
}
