"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserAccount } from "@/db/schema";
import { deleteKeycloakAccount } from "@/lib/keycloak-deletion";
import { catchProblem } from "@/lib/problem";
import { clearUserData } from "@/lib/services/user-service";
import {
  getInitials,
  getInitialsFromEmail,
  truncateEmail,
  truncateText,
} from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function AccountSection() {
  const session = useSession();

  const [acknowledged, setAcknowledged] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const t = useTranslations();

  const clearData = async () => {
    const resultKeycloak: { success: boolean } = await deleteKeycloakAccount();
    const resultDbData: UserAccount = catchProblem(await clearUserData());
    if (resultDbData.account.userId && resultKeycloak.success === true)
      signOut();
  };

  useEffect(() => {
    setDisabled(!acknowledged);
  }, [acknowledged]);

  return (
    <div className="py-5 flex flex-col gap-3">
      <div className="flex flex-row gap-2 items-center">
        <Avatar>
          <AvatarImage src={session.data?.user.image || ""} />
          <AvatarFallback>
            {session.data?.user.name
              ? getInitials(session.data?.user.name)
              : getInitialsFromEmail(session.data?.user.email || "")}
          </AvatarFallback>
        </Avatar>
        <div>
          {session.data?.user.name && (
            <h2 className="text-lg font-semibold">
              {truncateText(session.data?.user.name, 20).text}
            </h2>
          )}
          <p className="text-gray-500">
            {truncateEmail(session.data?.user.email || "", 15)}
          </p>
        </div>
      </div>
      <Button
        data-umami-event="Sign Out"
        variant={"secondary"}
        onClick={() => signOut()}
      >
        {t("auth.logout")}
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            data-umami-event="Delete Account"
            variant={"destructive"}
            onClick={() => setAcknowledged(false)}
          >
            {t("actions.delete-account")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("actions.clear-account-data")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("actions.clear-account-data-warning")}
            </AlertDialogDescription>
            <div className="flex flex-row gap-4 items-center pt-4">
              <Checkbox
                id="account-deletion-acknowledge"
                checked={acknowledged}
                onCheckedChange={(checked) => {
                  setAcknowledged(checked === true);
                }}
              />
              <Label htmlFor="account-deletion-acknowledge">
                <b>{t("actions.acknowledge")}</b>
              </Label>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("generic.nevermind")}</AlertDialogCancel>
            <Button
              data-umami-event="Confirm Account Deletion"
              disabled={disabled}
              onClick={clearData}
              variant={"destructive"}
            >
              {t("generic.doit")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
