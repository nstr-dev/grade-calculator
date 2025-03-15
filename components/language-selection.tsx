"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SheetDescription } from "@/components/ui/sheet";
import { cn, truncateText } from "@/lib/utils";
import { Check, ChevronsUpDown, LanguagesIcon, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

type Language = {
  name: string;
  key: string;
};

const languages: Language[] = [
  { name: "English", key: "en" },
  { name: "Deutsch", key: "de" },
];

const findByKey = (key: string) => languages.find((l) => l.key === key);

export function LanguageSelection({
  autoRefresh = false,
  className,
}: {
  autoRefresh?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Language>();
  const locale = useLocale();
  const router = useRouter();
  const isDesktop = !isMobile;

  useEffect(() => {
    setSelected(findByKey(locale) ?? findByKey("en"));
  }, [locale]);

  useEffect(() => {
    if (selected?.key === undefined) return;
    if (document.cookie.includes("locale=" + selected?.key)) return;

    document.cookie = `locale=${
      selected?.key ?? "en"
    }; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

    if (autoRefresh) {
      router.refresh();
    }
  }, [autoRefresh, router, selected]);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-between", className)}
          >
            <LanguagesIcon className="mr-2 size-4" />
            {selected?.name}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <LanguageList
            setOpen={setOpen}
            selected={selected}
            setSelected={setSelected}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer repositionInputs={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        asChild
        className={cn("w-full justify-between", className)}
      >
        <Button variant="outline">
          <LanguagesIcon className="mr-2 size-4" />
          {selected?.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <LanguageList
            setOpen={setOpen}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function LanguageList({
  selected,
  setSelected,
  setOpen,
}: {
  selected: Language | undefined;
  setSelected: (lang: Language) => void;
  setOpen: (open: boolean) => void;
}) {
  const t = useTranslations();
  return (
    <Command>
      <CommandInput placeholder={t("filters.filter-by-language")} />
      <CommandList>
        <CommandEmpty>{t("errors.no-results")}</CommandEmpty>
        <CommandGroup>
          {languages.map((lang) => (
            <CommandItem
              key={lang.name}
              value={lang.name ?? ""}
              onSelect={() => {
                setSelected(lang);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  lang.key === selected?.key ? "opacity-100" : "opacity-0"
                )}
              />

              {truncateText(lang.name ?? "", 15).text}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function LanguageGroup() {
  const t = useTranslations();
  const router = useRouter();
  return (
    <div className="flex flex-col gap-3 my-4">
      <Label>{t("generic.language")}</Label>
      <SheetDescription>
        {t("preferences.language.description")}
      </SheetDescription>
      <div className="flex-row flex w-full gap-3">
        <LanguageSelection />
        <Button
          className="w-1/2"
          variant={"secondary"}
          onClick={() => router.refresh()}
        >
          <RefreshCw className="size-4 mr-2" /> {t("generic.reload")}
        </Button>
      </div>
    </div>
  );
}

export function LanguageSelectionLandingPage() {
  const session = useSession();
  if (session.status === "loading") return null;
  if (session.status === "authenticated") return null;
  return <LanguageSelection autoRefresh />;
}
