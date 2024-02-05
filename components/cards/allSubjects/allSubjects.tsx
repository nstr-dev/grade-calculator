"use client";
import { CreateSubjectForm } from "@/components/create-subject-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
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
import { GradeAverage } from "@/lib/entities/gradeAverage";
import Subjects from "@/lib/entities/subject";
import { deleteSubjectToast } from "@/lib/toasts";
import { isMobileDevice } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { columns } from "./columns";

export function AllSubjects({
  data,
  setData,
  refresh,
}: {
  data: GradeAverage[];
  setData: Function;
  refresh: Function;
}) {
  const { t, lang } = useTranslation("common");
  const isDesktop = !isMobileDevice();
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);

  if (isDesktop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("subjects.all-subjects")}</CardTitle>
          <CardDescription>{t("subjects.all-subjects-desc")}</CardDescription>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">{t("subjects.add")}</Button>
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
                    onClick={() => {
                      if (subjectToDelete) {
                        Subjects.remove(subjectToDelete);
                        deleteSubjectToast(subjectToDelete);
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
            <DataTable columns={columns(setSubjectToDelete)} data={data} />
          </Dialog>
        </CardContent>
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
            <Button variant="outline">{t("subjects.add")}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{t("grades.add")}</DrawerTitle>
              <DrawerDescription>{t("grades.add-desc")}</DrawerDescription>
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
                  onClick={() => {
                    if (subjectToDelete) {
                      Subjects.remove(subjectToDelete);
                      deleteSubjectToast(subjectToDelete);
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
          <DataTable columns={columns(setSubjectToDelete)} data={data} />
        </Drawer>
      </CardContent>
    </Card>
  );
}
