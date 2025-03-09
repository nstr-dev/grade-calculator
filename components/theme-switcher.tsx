"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

export function ThemeSwitcher({ expanded = false }: { expanded?: boolean }) {
  const { setTheme } = useTheme();
  const t = useTranslations();

  if (expanded)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex-shrink-0 flex flex-row gap-2 "
          >
            <Sun className="size-4 block dark:hidden" />
            <Moon className="size-4 hidden dark:block" />
            {t("themes.toggle")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("themes.title")}</DropdownMenuLabel>
          <DropdownMenuItem
            data-umami-event="Change Theme"
            data-umami-event-theme="Light"
            onClick={() => setTheme("light")}
          >
            <Sun className="h-[1rem] w-[1rem] mr-[0.5rem]" />
            {t("themes.light")}
          </DropdownMenuItem>
          <DropdownMenuItem
            data-umami-event="Change Theme"
            data-umami-event-theme="Dark"
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-[1rem] w-[1rem] mr-[0.5rem]" />
            {t("themes.dark")}
          </DropdownMenuItem>
          <DropdownMenuItem
            data-umami-event="Change Theme"
            data-umami-event-theme="System"
            onClick={() => setTheme("system")}
          >
            <Laptop className="h-[1rem] w-[1rem] mr-[0.5rem]" />
            {t("themes.system")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="flex-shrink-0">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("themes.title")}</DropdownMenuLabel>
        <DropdownMenuItem
          data-umami-event="Change Theme"
          data-umami-event-theme="Light"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-[1rem] w-[1rem] mr-[0.5rem]" />
          {t("themes.light")}
        </DropdownMenuItem>
        <DropdownMenuItem
          data-umami-event="Change Theme"
          data-umami-event-theme="Dark"
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-[1rem] w-[1rem] mr-[0.5rem]" />
          {t("themes.dark")}
        </DropdownMenuItem>
        <DropdownMenuItem
          data-umami-event="Change Theme"
          data-umami-event-theme="System"
          onClick={() => setTheme("system")}
        >
          <Laptop className="h-[1rem] w-[1rem] mr-[0.5rem]" />
          {t("themes.system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
