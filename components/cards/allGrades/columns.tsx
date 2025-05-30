"use client";
import { ColoredGrade } from "@/components/colored-grade";
import { GradeWeightBadge } from "@/components/grade-weight-badge";
import { RelativeTimeFormatted } from "@/components/relative-time-formatted";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GradeWithSubject } from "@/db/schema";
import { deleteGradeByGrade } from "@/lib/services/grade-service";
import { deleteGradeToast } from "@/lib/toasts";
import { getSortedColumnIcon, truncateText } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { isMobile } from "react-device-detect";

export function columns(
  refresh: Function,
  setGradeToEdit: Function,
  translations: any
): ColumnDef<GradeWithSubject>[] {
  return [
    {
      id: "subjectName",
      accessorKey: "subjects.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {translations.grades.subject}
            {getSortedColumnIcon(column)}
          </Button>
        );
      },
      cell: ({ row }) => {
        let subject: string = row.original.subjects.name!;
        let truncated: boolean = truncateText(
          subject,
          isMobile ? 16 : 20
        ).truncated;
        let truncatedSubject: string = truncateText(
          subject,
          isMobile ? 16 : 20
        ).text;

        if (truncated) {
          return (
            <Popover>
              <PopoverTrigger className="text-left ml-2 text-wrap break-words max-w-40">
                {truncatedSubject}
              </PopoverTrigger>
              <PopoverContent className="w-fit max-w-80 text-wrap break-words">
                <p>{subject}</p>
              </PopoverContent>
            </Popover>
          );
        }
        return <p className="ml-2">{subject}</p>;
      },
    },
    {
      accessorKey: "grades.value",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {translations.grades.grade}
            {getSortedColumnIcon(column)}
          </Button>
        );
      },
      cell: ({ row }) => {
        let value: number = row.original.grades.value!;
        let weight: number = row.original.grades.weight!;
        return (
          <div className="flex flex-row">
            <ColoredGrade grade={value} className="ml-2 mr-2" />
            <GradeWeightBadge weight={weight} />
          </div>
        );
      },
    },
    {
      accessorKey: "grades.description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {translations.grades.description}
            {getSortedColumnIcon(column)}
          </Button>
        );
      },
      cell: ({ row }) => {
        let description: string = row.original.grades.description!;
        let truncated = truncateText(description, 20);

        if (truncated.truncated) {
          return (
            <Popover>
              <PopoverTrigger className="text-left ml-2">
                {truncated.text}
              </PopoverTrigger>
              <PopoverContent className="w-fit max-w-80 text-wrap break-words">
                <p>{description}</p>
              </PopoverContent>
            </Popover>
          );
        }

        return description ? (
          <p className="ml-2">{description}</p>
        ) : (
          <p className="ml-2 text-muted-foreground">-</p>
        );
      },
    },
    {
      id: "date",
      sortingFn: "datetime",
      accessorKey: "grades.date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {translations.grades.date}
            {getSortedColumnIcon(column)}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <RelativeTimeFormatted date1={row.original.grades.date!} now />;
        // let date = formatDistanceToNow(row.original.grades.date!, {
        //   addSuffix: true,
        // });

        // return <p className="ml-2">{date}</p>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const grade = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {translations.grades.actions.title}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setGradeToEdit(grade.grades);
                }}
              >
                <DialogTrigger asChild>
                  <div className="w-full flex flex-row items-center justify-start gap-3">
                    <Edit className="size-4 text-muted-foreground" />
                    <span>{translations.grades.actions.edit}</span>
                  </div>
                </DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  let gradeCopy = grade.grades;
                  deleteGradeByGrade(grade.grades);
                  deleteGradeToast(
                    gradeCopy,
                    grade.subjects.name ?? "",
                    refresh
                  );
                  refresh();
                }}
              >
                <div className="w-full flex flex-row items-center justify-start gap-3">
                  <Trash className="size-4 text-muted-foreground" />
                  <span>{translations.grades.actions.delete}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
