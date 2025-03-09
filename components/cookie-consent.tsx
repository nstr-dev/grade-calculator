"use client";
import { Highlight } from "@/components/ui/card-stack";
import { cn } from "@/lib/utils";
import { CheckIcon, CookieIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
export default function CookieConsent({
  onAcceptCallback = () => {},
  onDeclineCallback = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hide, setHide] = useState(false);
  const t = useTranslations();

  const accept = () => {
    setIsOpen(false);
    document.cookie =
      "cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    setTimeout(() => {
      setHide(true);
    }, 700);
    onAcceptCallback();
  };

  const decline = () => {
    setIsOpen(false);
    setTimeout(() => {
      setHide(true);
    }, 700);
    onDeclineCallback();
  };

  useEffect(() => {
    try {
      setIsOpen(true);
      if (document.cookie.includes("cookieConsent=true")) {
        setIsOpen(false);
        setTimeout(() => {
          setHide(true);
        }, 700);
      }
    } catch (e) {
      // console.log("Error: ", e);
    }
  }, []);

  return (
    <div
      className={cn(
        "fixed z-[30] bottom-0 right-0 sm:right-4 sm:bottom-4 w-full sm:max-w-md transition-transform duration-700",
        !isOpen
          ? "transition-[opacity,transform] translate-y-8 opacity-0"
          : "transition-[opacity,transform] translate-y-0 opacity-100",
        hide && "hidden"
      )}
    >
      <div className="bg-secondary rounded-md m-2">
        <div className="grid gap-2">
          <div className="border-b border-border h-14 flex items-center justify-between p-4">
            <h1 className="text-lg font-medium">
              {t("cookie-policy.popup.title")}
            </h1>
            <CookieIcon className="h-[1.2rem] w-[1.2rem]" />
          </div>
          <div className="p-4">
            <p className="text-sm font-normal">
              {t.rich("cookie-policy.popup.description", {
                highlight: (text) => (
                  <Highlight colorName="yellow">{text}</Highlight>
                ),
                link: (text) => (
                  <Link href="/cookies" className="underline">
                    {text}
                  </Link>
                ),
              })}
            </p>
          </div>
          <div className="flex gap-2 p-4 py-5 border-t border-border bg-background/20">
            <Button
              data-umami-event="Accept Cookies"
              onClick={accept}
              className="w-full"
            >
              <CheckIcon className="size-4 mr-2" />
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
