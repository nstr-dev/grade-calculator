"use client";
import {
  CreateCategoryForm,
  EditCategoryForm,
} from "@/components/category-form";
import { Button } from "@/components/ui/button";
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
import { FolderPen, FolderPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { isMobile } from "react-device-detect";

export function CategoryButton({ action }: { action: "create" | "edit" }) {
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();
  const t = useTranslations();

  if (session.status !== "authenticated") return null;

  if (action === "create")
    return isMobile ? (
      <Drawer repositionInputs={false} open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <FolderPlus className="size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{t("categories.add.title")}</DrawerTitle>
            <DrawerDescription>
              {t("categories.add.description")}
            </DrawerDescription>
          </DrawerHeader>
          <CreateCategoryForm setOpen={setOpen} />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">{t("actions.cancel")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    ) : (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <FolderPlus className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("categories.add.title")}</DialogTitle>
            <DialogDescription>
              {t("categories.add.description")}
            </DialogDescription>
          </DialogHeader>
          <CreateCategoryForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  if (action === "edit")
    return isMobile ? (
      <Drawer repositionInputs={false} open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size={"icon"} variant={"outline"}>
            <FolderPen className="size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{t("categories.edit.title")}</DrawerTitle>
            <DrawerDescription>
              {t("categories.edit.description")}
            </DrawerDescription>
          </DrawerHeader>
          <EditCategoryForm setOpen={setOpen} />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">{t("actions.cancel")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    ) : (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={"icon"} variant={"outline"}>
            <FolderPen className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("categories.edit.title")}</DialogTitle>
            <DialogDescription>
              {t("categories.edit.description")}
            </DialogDescription>
          </DialogHeader>
          <EditCategoryForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
}
