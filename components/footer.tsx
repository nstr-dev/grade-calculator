import { FooterItem } from "@/components/footer-item";
import { Separator } from "@/components/ui/separator";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Cookie, GitBranch, Globe, Scale } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations();
  return (
    <footer className="mt-5 bottom-0 w-11/12 p-2 flex flex-col gap-2">
      <Separator />
      <div className="flex flex-col justify-center gap-0 lg:gap-10 lg:flex-row">
        <FooterItem href="/privacy">
          <Scale className="mr-2 size-4" />
          {t("external.privacy-policy")}
        </FooterItem>
        <FooterItem href="/cookies">
          <Cookie className="mr-2 size-4" />
          {t("external.cookie-policy")}
        </FooterItem>
        <FooterItem href="https://legacy.grades.nstr.dev">
          <Globe className="mr-2 size-4" />
          {t("external.legacy-version")}
        </FooterItem>
        <FooterItem
          newTab
          href="https://github.com/nstr-dev/grade-calculator"
        >
          <SiGithub className="mr-2 size-4" />
          {t("external.source-code")}
        </FooterItem>
        <FooterItem
          newTab
          href={
            process.env.npm_package_version
              ? "https://github.com/nstr-dev/grade-calculator/tree/v" +
                process.env.npm_package_version
              : "https://github.com/nstr-dev/grade-calculator"
          }
        >
          <GitBranch className="mr-2 size-4" />
          {process.env.VERCEL_ENV === "production"
            ? process.env.npm_package_version || t("generic.env.production")
            : process.env.npm_package_version || t("generic.env.development")}
        </FooterItem>
      </div>
    </footer>
  );
}
