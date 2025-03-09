"use client";
import { columns } from "@/components/cards/allSubjects/columns";
import { DataTable } from "@/components/cards/allSubjects/data-table";
import { FailingGradesContent } from "@/components/cards/failingGradesCard/failingGradesContent";
import { CreateSubjectForm } from "@/components/create-subject-form";
import { EditSubjectForm } from "@/components/edit-subject-form";
import { PassingStatus } from "@/components/passing-filter-combobox";
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
  DialogFooter,
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
import { Subject } from "@/db/schema";
import { MediaQueries, useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { catchProblem } from "@/lib/problem";
import { deleteSubject } from "@/lib/services/subject-service";
import { deleteSubjectToast } from "@/lib/toasts";
import { AverageWithSubject } from "@/types/types";
import { DialogClose } from "@radix-ui/react-dialog";
import { Bird, FilterX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function AllSubjects({
  data,
  failingData,
  passingData,
  setData,
  refresh,
}: {
  data: AverageWithSubject[];
  failingData: AverageWithSubject[];
  passingData: AverageWithSubject[];
  setData: Function;
  refresh: Function;
}) {
  const t = useTranslations();

  const isDesktop = useMediaQuery(MediaQueries.xxl);
  const isTablet = useMediaQuery(MediaQueries.xl) && !isDesktop;
  const isMobile = !isTablet && !isDesktop;

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [currentData, setCurrentData] = useState<AverageWithSubject[]>(data);
  const [originalSubject, setOriginalSubject] = useState<Subject | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<PassingStatus | null>({
    value: "all",
    label: t("filters.show-all"),
    icon: <FilterX className="size-4 mr-2" />,
  });

  const colTranslations = {
    grades: {
      grade: t("grades.grade"),
      subject: t("grades.subject"),
    },
    screenreader: {
      openMenu: t("screenreader.open-menu"),
    },
    subjects: {
      actions: {
        title: t("subjects.actions.title"),
        edit: t("subjects.actions.edit"),
        delete: t("subjects.actions.delete"),
        view: t("subjects.actions.view"),
      },
    },
  };

  useEffect(() => {
    if (selectedStatus?.value === "all") {
      setCurrentData(data);
    } else if (selectedStatus?.value === "passing") {
      setCurrentData(passingData);
    } else if (selectedStatus?.value === "failing") {
      setCurrentData(failingData);
    }
  }, [selectedStatus, data, passingData, failingData, currentData]);

  if (isDesktop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("subjects.all-subjects")}</CardTitle>
          <CardDescription>{t("subjects.all-subjects-desc")}</CardDescription>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">{t("subjects.add")}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t("subjects.add")}</DialogTitle>
                <DialogDescription>{t("subjects.add-desc")}</DialogDescription>
              </DialogHeader>
              <CreateSubjectForm refresh={refresh} setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t("subjects.delete.prompt")}</DialogTitle>
                <DialogDescription>
                  {t("subjects.delete.message")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t("actions.cancel")}</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    data-umami-event="Delete Subject"
                    onClick={async () => {
                      if (subjectToDelete) {
                        let subjectName = catchProblem(
                          await deleteSubject(subjectToDelete)
                        );
                        deleteSubjectToast(subjectName);
                        setSubjectToDelete(null);
                      }
                      refresh();
                    }}
                    variant="destructive"
                  >
                    {t("actions.danger-continue")}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
            {data.length === 0 ? (
              <Alert>
                <Bird className="h-4 w-4" />
                <AlertTitle>{t("errors.not-enough-data-yet")}</AlertTitle>
                <AlertDescription>
                  {t("errors.not-enough-data-yet-subject", { count: 1 })}
                </AlertDescription>
              </Alert>
            ) : (
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {t("subjects.actions.edit-title")}
                    </DialogTitle>
                    <DialogDescription>
                      {t("subjects.actions.edit-desc")}
                    </DialogDescription>
                  </DialogHeader>
                  <EditSubjectForm
                    originalSubject={originalSubject}
                    refresh={refresh}
                    setOpen={setEditOpen}
                  />
                </DialogContent>
                <DataTable
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  columns={columns(
                    setSubjectToDelete,
                    setOriginalSubject,
                    setDeleteConfirmOpen,
                    setEditOpen,
                    colTranslations
                  )}
                  data={currentData}
                />
              </Dialog>
            )}
          </Dialog>
        </CardContent>
        {failingData.length > 0 && <FailingGradesContent data={failingData} />}
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("subjects.all-subjects")}</CardTitle>
        <CardDescription>{t("subjects.all-subjects-desc")}</CardDescription>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="secondary">{t("subjects.add")}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{t("subjects.add")}</DrawerTitle>
              <DrawerDescription>{t("subjects.add-desc")}</DrawerDescription>
            </DrawerHeader>
            <CreateSubjectForm refresh={refresh} setOpen={setOpen} />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">{t("actions.cancel")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardHeader>
      <CardContent>
        <Drawer open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{t("subjects.delete.prompt")}</DrawerTitle>
              <DrawerDescription>
                {t("subjects.delete.message")}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button
                  data-umami-event="Delete Subject"
                  onClick={async () => {
                    if (subjectToDelete) {
                      let subjectName = catchProblem(
                        await deleteSubject(subjectToDelete)
                      );
                      deleteSubjectToast(subjectName);
                      setSubjectToDelete(null);
                    }
                    refresh();
                  }}
                  variant="destructive"
                >
                  {t("actions.danger-continue")}
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline">{t("actions.cancel")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
          {data.length === 0 ? (
            <Alert>
              <Bird className="h-4 w-4" />
              <AlertTitle>{t("errors.not-enough-data-yet")}</AlertTitle>
              <AlertDescription>
                {t("errors.not-enough-data-yet-subject", { count: 1 })}
              </AlertDescription>
            </Alert>
          ) : (
            <Drawer open={editOpen} onOpenChange={setEditOpen}>
              <DrawerContent className="sm:max-w-[425px]">
                <DrawerHeader>
                  <DrawerTitle>{t("subjects.actions.edit-title")}</DrawerTitle>
                  <DrawerDescription>
                    {t("subjects.actions.edit-desc")}
                  </DrawerDescription>
                </DrawerHeader>
                <EditSubjectForm
                  originalSubject={originalSubject}
                  refresh={refresh}
                  setOpen={setEditOpen}
                />
              </DrawerContent>
              <DataTable
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                columns={columns(
                  setSubjectToDelete,
                  setOriginalSubject,
                  setDeleteConfirmOpen,
                  setEditOpen,
                  colTranslations
                )}
                data={currentData}
              />
            </Drawer>
          )}
        </Drawer>
      </CardContent>
      {failingData.length > 0 && <FailingGradesContent data={failingData} />}
    </Card>
  );
}
