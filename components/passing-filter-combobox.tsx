"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, FilterX, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { isMobile } from "react-device-detect";

export type PassingStatus = {
  value: string;
  label: string;
  icon?: React.ReactElement;
};

export function PassingFilterComboBox({
  selectedStatus,
  setSelectedStatus,
}: {
  selectedStatus: PassingStatus | null;
  setSelectedStatus: (status: PassingStatus | null) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = !isMobile;

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-fit">
            {selectedStatus?.icon && selectedStatus.icon}
            {selectedStatus!.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0" align="start">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer repositionInputs={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-fit justify-end">
          {selectedStatus?.icon && selectedStatus.icon}
          {selectedStatus!.label}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: PassingStatus | null) => void;
}) {
  const t = useTranslations();
  const statuses: PassingStatus[] = [
    {
      value: "all",
      label: t("filters.show-all"),
      icon: <FilterX className="size-4 mr-2" />,
    },
    {
      value: "passing",
      label: t("filters.passing"),
      icon: <Check className="size-4 mr-2" />,
    },
    {
      value: "failing",
      label: t("filters.failing"),
      icon: <X className="size-4 mr-2" />,
    },
  ];
  return (
    <Command>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              className="px-4"
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(
                  statuses.find((priority) => priority.value === value) || null
                );
                setOpen(false);
              }}
            >
              {status.icon && status.icon}
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
