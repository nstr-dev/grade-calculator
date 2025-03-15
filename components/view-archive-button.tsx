"use client";

import { RelativeTimeFormatted } from "@/components/relative-time-formatted";
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
  DialogClose,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/ui/spinner";
import { ArchiveData } from "@/db/schema";
import { MediaQueries, useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { catchProblem } from "@/lib/problem";
import {
  deleteArchivedata,
  getAllArchivedata,
} from "@/lib/services/archive-service";
import { unarchiveCategory } from "@/lib/services/export-service";
import { exportToJSONFile } from "@/lib/services/notAsyncLogic";
import { getDateOrTime, truncateText } from "@/lib/utils";
import { Archive, Bird, DownloadIcon, FolderIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function ViewArchiveButton() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isDesktop = useMediaQuery(MediaQueries.xxl);
  const isTablet = useMediaQuery(MediaQueries.xl) && !isDesktop;
  const isMobile = !isTablet && !isDesktop;
  const isTiny = !useMediaQuery(MediaQueries.xs);

  const [archiveData, setArchiveData] = useState<ArchiveData[]>([]);
  const [refresher, setRefresher] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = (id: number) => {
    deleteArchivedata(id).then((result) => {
      refresh();
    });
  };

  const handleDownload = (id: number) => {
    let data = archiveData.find((data) => data.id === id);
    data &&
      unarchiveCategory(data.data).then((data) => {
        exportToJSONFile(data, data.category);
      });
  };

  const refresh = () => {
    setRefresher(Math.random());
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = catchProblem(await getAllArchivedata());
        if (data)
          setArchiveData([
            ...data.sort(
              (a: ArchiveData, b: ArchiveData) =>
                b.date.getTime() - a.date.getTime()
            ),
          ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresher]);

  return isMobile ? (
    <Drawer repositionInputs={false} open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          className="w-full flex-1 flex-shrink-0 gap-2"
          variant={"secondary"}
        >
          <Archive className="size-4" />
          <span>{t("semesters.archive.view")}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("semesters.archive.title")}</DrawerTitle>
          {archiveData.length ? (
            <DrawerDescription>
              {t("semesters.archive.description")}
            </DrawerDescription>
          ) : (
            <DrawerDescription>
              {t("semesters.archive.description-empty")}
            </DrawerDescription>
          )}
        </DrawerHeader>
        {archiveData.length ? (
          <div className="h-[50svh] mx-2 p-2 overflow-auto">
            <div className="flex flex-col gap-6">
              {archiveData.map((data) => (
                <Card key={data.id}>
                  <CardHeader>
                    <CardTitle className="inline-flex flex-row items-center gap-2">
                      <span className="text-muted-foreground">
                        <FolderIcon className="size-5" />
                      </span>
                      {truncateText(data.category, 20).text}
                    </CardTitle>
                    <CardDescription className="flex-row inline-flex gap-2">
                      {t.rich("semesters.archive.dates", {
                        absolutetime: () => getDateOrTime(data.date),
                        relativetime: () => (
                          <RelativeTimeFormatted date1={data.date} now />
                        ),
                      })}
                    </CardDescription>
                  </CardHeader>
                  {isTiny ? (
                    <CardContent className="flex flex-row-reverse gap-3">
                      <Button
                        data-umami-event="Download Archive"
                        size="icon"
                        onClick={() => handleDownload(data.id)}
                      >
                        <DownloadIcon className="size-4" />
                      </Button>
                      <Button
                        data-umami-event="Delete Archive"
                        size="icon"
                        variant="secondary"
                        onClick={() => handleDelete(data.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </CardContent>
                  ) : (
                    <CardContent className="flex flex-row-reverse gap-3">
                      <Button
                        data-umami-event="Download Archive"
                        onClick={() => handleDownload(data.id)}
                      >
                        <DownloadIcon className="size-4 mr-2" />
                        {t("semesters.archive.download")}
                      </Button>
                      <Button
                        data-umami-event="Delete Archive"
                        variant="secondary"
                        onClick={() => handleDelete(data.id)}
                      >
                        <Trash2 className="size-4 mr-2" />
                        {t("actions.delete.prompt")}
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ) : loading ? (
          <div className="m-auto">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="mx-4">
            <Alert>
              <Bird className="h-4 w-4" />
              <AlertTitle>{t("errors.woops")}</AlertTitle>
              <AlertDescription>
                {t("errors.no-archived-data")}
              </AlertDescription>
            </Alert>
          </div>
        )}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">{t("generic.back")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant={"secondary"}>
          <Archive className="size-4 mr-2" />
          {t("semesters.archive.view")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("semesters.archive.title")}</DialogTitle>
          {archiveData.length ? (
            <DialogDescription>
              {t("semesters.archive.description")}
            </DialogDescription>
          ) : (
            <DialogDescription>
              {t("semesters.archive.description-empty")}
            </DialogDescription>
          )}
        </DialogHeader>
        {archiveData.length ? (
          <ScrollArea className="h-[50svh] m-2 px-4">
            <div className="flex flex-col gap-6">
              {archiveData.map((data) => (
                <Card key={data.id}>
                  <CardHeader>
                    <CardTitle className="inline-flex flex-row items-center gap-2">
                      <span className="text-muted-foreground">
                        <FolderIcon className="size-5" />
                      </span>
                      {truncateText(data.category, 20).text}
                    </CardTitle>
                    <CardDescription className="flex-row inline-flex gap-2">
                      {t.rich("semesters.archive.dates", {
                        absolutetime: () => getDateOrTime(data.date),
                        relativetime: () => (
                          <RelativeTimeFormatted date1={data.date} now />
                        ),
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-row-reverse gap-3">
                    <Button
                      data-umami-event="Download Archive"
                      onClick={() => handleDownload(data.id)}
                    >
                      <DownloadIcon className="size-4 mr-2" />
                      {t("semesters.archive.download")}
                    </Button>
                    <Button
                      data-umami-event="Delete Archive"
                      variant="secondary"
                      onClick={() => handleDelete(data.id)}
                    >
                      <Trash2 className="size-4 mr-2" />
                      {t("actions.delete.prompt")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : loading ? (
          <LoadingSpinner className={"justify-self-center"} />
        ) : (
          <Alert>
            <Bird className="h-4 w-4" />
            <AlertTitle>{t("errors.woops")}</AlertTitle>
            <AlertDescription>{t("errors.no-archived-data")} </AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">{t("generic.back")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
