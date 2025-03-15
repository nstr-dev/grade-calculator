"use client";
import { useCategory } from "@/components/category-provider";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Category } from "@/db/schema";
import { cn, truncateText } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { isMobile } from "react-device-detect";

export function CategoryComboBox({ className }: { className?: string }) {
  const categoryState = useCategory();
  const [open, setOpen] = useState(false);
  const session = useSession();
  const isDesktop = !isMobile;

  if (session.status !== "authenticated") return null;

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-[150px] justify-between", className)}
          >
            {categoryState.loading ? (
              <LoadingSpinner />
            ) : (
              truncateText(categoryState.category?.name ?? "", 20).text
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <CategoryList
            selected={categoryState.category}
            categories={categoryState.categories}
            setOpen={setOpen}
            setSelectedCategory={categoryState.setCategory}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer repositionInputs={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        asChild
        className={cn("w-[150px] justify-between", className)}
      >
        <Button variant="outline">
          {categoryState.loading ? (
            <LoadingSpinner />
          ) : (
            truncateText(categoryState.category?.name ?? "", 15).text
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <CategoryList
            selected={categoryState.category}
            categories={categoryState.categories}
            setOpen={setOpen}
            setSelectedCategory={categoryState.setCategory}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CategoryList({
  categories,
  selected,
  setOpen,
  setSelectedCategory: setSelectedCategory,
}: {
  categories: Category[];
  selected: Category | undefined;
  setOpen: (open: boolean) => void;
  setSelectedCategory: (category: Category) => void;
}) {
  const t = useTranslations();
  const sortedCategories = () => {
    return categories.sort((a, b) => {
      return a.name!.localeCompare(b.name!);
    });
  };
  return (
    <Command>
      <CommandInput placeholder={t("filters.filter-by-category")} />
      <CommandList>
        <CommandEmpty>{t("errors.no-results")}</CommandEmpty>
        <CommandGroup>
          {sortedCategories().map((category) => (
            <CommandItem
              key={category.name}
              value={category.name ?? ""}
              onSelect={() => {
                setSelectedCategory(category);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  category.id === selected?.id ? "opacity-100" : "opacity-0"
                )}
              />

              {truncateText(category.name ?? "", 15).text}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
