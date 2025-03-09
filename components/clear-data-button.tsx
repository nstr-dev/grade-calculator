"use client";
import { useCategory } from "@/components/category-provider";
import { Button } from "@/components/ui/button";
import {
  clearUserGradesByCategory,
  clearUserSubjectsGradesByCategory,
} from "@/lib/services/user-service";
import { ClearDataTranslations } from "@/lib/translationObjects";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export function ClearDataButton({
  translations,
  children,
}: {
  translations: ClearDataTranslations;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const categoryState = useCategory();

  function clearData() {
    clearUserSubjectsGradesByCategory(categoryState.category?.id!);
    window.location.reload();
  }
  function clearGrades() {
    clearUserGradesByCategory(categoryState.category?.id!);
    window.location.reload();
  }
  const session = useSession();

  return session.status === "authenticated" ? (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{translations.prompt}</AlertDialogTitle>
            <AlertDialogDescription>
              {translations.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse gap-3">
            <Button onClick={() => setOpen(false)}>
              {translations.cancel}
            </Button>
            <Button
              data-umami-event="Clear Grades Only"
              onClick={clearGrades}
              variant="secondary"
            >
              {translations.actions.clearGradesOnly}
            </Button>
            <Button
              data-umami-event="Clear All Data"
              variant="destructive"
              onClick={clearData}
            >
              {translations.dangerContinue}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ) : null;
}
