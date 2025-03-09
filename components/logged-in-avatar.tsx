"use client";
import { AccountSection } from "@/components/account-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getInitials, getInitialsFromEmail } from "@/lib/utils";
import { useSession } from "next-auth/react";

export function LoggedInAvatar({ className = "" }: { className?: string }) {
  const session = useSession();
  return session.status === "authenticated" ? (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          data-umami-event="View Profile"
          size={"icon"}
          variant={"ghost"}
          className="rounded-full"
        >
          <Avatar className={className}>
            <AvatarImage src={session.data?.user.image || ""} />
            <AvatarFallback>
              {session.data?.user.name
                ? getInitials(session.data?.user.name)
                : getInitialsFromEmail(session.data?.user.email || "")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <AccountSection />
      </PopoverContent>
    </Popover>
  ) : null;
}
