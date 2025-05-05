"use client";
import { CreateGradeForm } from "@/components/create-grade-form";
import { EditGradeForm } from "@/components/edit-grade-form";
import { PassingStatus } from "@/components/passing-filter-combobox";
import { usePreferences } from "@/components/preferences-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grade, GradeWithSubject } from "@/db/schema";
import { MediaQueries, useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { doesGradePass } from "@/lib/services/notAsyncLogic";
import { Bird, FilterX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export function AllGrades({
  data,
  setData,
  refresh,
}: Readonly<{
  data: GradeWithSubject[];
  setData: Function;
  refresh: Function;
}>) {
  const t = useTranslations();
  const preferences = usePreferences().preferences!;
  const colTranslations = {
    grades: {
      date: t("grades.date"),
      grade: t("grades.grade"),
      subject: t("grades.subject"),
      description: t("grades.description"),
      actions: {
        title: t("grades.actions.title"),
        edit: t("grades.actions.edit"),
        delete: t("grades.actions.delete"),
      },
    },
  };

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const isDesktop = useMediaQuery(MediaQueries.xxl);

  const [originalGrade, setOriginalGrade] = useState<Grade | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<PassingStatus | null>({
    value: "all",
    label: t("filters.show-all"),
    icon: <FilterX className="size-4 mr-2" />,
  });

  const getGradesForStatus = (status: PassingStatus | null) => {
    if (status?.value === "passing") {
      return data.filter((grade) =>
        doesGradePass(grade.grades.value!, preferences)
      );
    }

    if (status?.value === "failing") {
      return data.filter(
        (grade) => !doesGradePass(grade.grades.value!, preferences)
      );
    }

    return data;
  };

  if (isDesktop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("grades.all-grades")}</CardTitle>
          <CardDescription>{t("grades.all-grades-desc")}</CardDescription>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>{t("grades.add")}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t("grades.add")}</DialogTitle>
                <DialogDescription>{t("grades.add-desc")}</DialogDescription>
              </DialogHeader>
              <CreateGradeForm refresh={refresh} setDrawerOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <Alert>
              <Bird className="h-4 w-4" />
              <AlertTitle>{t("errors.not-enough-data-yet")}</AlertTitle>
              <AlertDescription>
                {t("errors.not-enough-data-yet-grade", { count: 1 })}
              </AlertDescription>
            </Alert>
          ) : (
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DataTable
                columns={columns(refresh, setOriginalGrade, colTranslations)}
                data={getGradesForStatus(selectedStatus)}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
              />
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t("grades.edit.title")}</DialogTitle>
                  <DialogDescription>{t("grades.edit.desc")}</DialogDescription>
                </DialogHeader>
                <EditGradeForm
                  refresh={refresh}
                  setDrawerOpen={setEditOpen}
                  originalGrade={originalGrade}
                />
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("grades.all-grades")}</CardTitle>
        <CardDescription>{t("grades.all-grades-desc")}</CardDescription>
        <Drawer repositionInputs={false} open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button>{t("grades.add")}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{t("grades.add")}</DrawerTitle>
              <DrawerDescription>{t("grades.add-desc")}</DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="h-[68vh]">
              <CreateGradeForm refresh={refresh} setDrawerOpen={setOpen} />
            </ScrollArea>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">{t("actions.cancel")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <Alert>
            <Bird className="h-4 w-4" />
            <AlertTitle>{t("errors.not-enough-data-yet")}</AlertTitle>
            <AlertDescription>
              {t("errors.not-enough-data-yet-grade", { count: 1 })}
            </AlertDescription>
          </Alert>
        ) : (
          <Drawer
            repositionInputs={false}
            open={editOpen}
            onOpenChange={setEditOpen}
          >
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>{t("grades.edit.title")}</DrawerTitle>
                <DrawerDescription>{t("grades.edit.desc")}</DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="h-[68vh]">
                <EditGradeForm
                  refresh={refresh}
                  setDrawerOpen={setEditOpen}
                  originalGrade={originalGrade}
                />
              </ScrollArea>
              <DrawerFooter className="pt-2">
                <DrawerClose asChild>
                  <Button variant="outline">{t("actions.cancel")}</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
            <DataTable
              columns={columns(refresh, setOriginalGrade, colTranslations)}
              data={getGradesForStatus(selectedStatus)}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
          </Drawer>
        )}
      </CardContent>
    </Card>
  );
}
