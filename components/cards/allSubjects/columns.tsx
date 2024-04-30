"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash } from "lucide-react";
import createTranslation from "next-translate/createTranslation";

import { ColoredGrade } from "@/components/colored-grade";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { DrawerTrigger } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { truncateText } from "@/lib/utils";
import { AverageWithSubject, Empty } from "@/types/types";
import { isMobile } from "react-device-detect";
;

export function columns(setSubjectToDelete: any): ColumnDef<AverageWithSubject>[] {
  const { t, lang } = createTranslation("common");

  return [
    {
      id: "subjectName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("grades.subject")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        let subject: string = row.original.subject.name || "";
        let truncated: boolean = truncateText(subject, 20).truncated;
        let truncatedSubject: string = truncateText(subject, 20).text;

        if (truncated) {
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="text-left ml-4">
                  {truncatedSubject}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{subject}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
        return <p className="ml-4">{subject}</p>;
      },
    },
    {
      accessorKey: "average.gradeAverage",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("grades.grade")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        let value: number | Empty = row.original.average?.gradeAverage;
        return <ColoredGrade grade={value} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        let average: AverageWithSubject = row.original;
        let isDesktop: boolean = !isMobile;

        if (isDesktop) {
          return (
            <DialogTrigger asChild>
              <Button
                onClick={() => setSubjectToDelete(average.subject)}
                className="h-8 w-8 p-0"
                variant="ghost"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          );
        }

        return (
          <DrawerTrigger asChild>
            <Button
              onClick={() => setSubjectToDelete(average.subject)}
              className="h-8 w-8 p-0"
              variant="ghost"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
        );
      },
    },
  ];
}
