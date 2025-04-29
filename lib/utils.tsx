import { NewPreferences, Preferences } from "@/db/schema";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function round(value: number, precision: number) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function truncateText(text: string, maxLength: number) {
  try {
    if (text.length > maxLength) {
      let truncated = text.substring(0, maxLength) + "...";
      return { text: truncated, truncated: true };
    } else {
      return { text, truncated: false };
    }
  } catch {
    return { text, truncated: false };
  }
}

export function truncateEmail(
  email: string,
  maxLengthBeforeDomain: number,
  maxLengthAfterDomain: number = maxLengthBeforeDomain
) {
  try {
    let [username, domain] = email.split("@");
    let truncatedUsername = truncateText(username, maxLengthBeforeDomain);
    let truncatedDomain = truncateText(domain, maxLengthAfterDomain);
    return truncatedUsername.text + "@" + truncatedDomain.text;
  } catch {
    return email;
  }
}

export function truncateTextWithoutDots(text: string, maxLength: number) {
  if (text.length > maxLength) {
    let truncated = text.substring(0, maxLength);
    return { text: truncated, truncated: true };
  } else {
    return { text: text, truncated: false };
  }
}

export function getSortedColumnIcon(column: any) {
  if (column.getIsSorted())
    return column.getIsSorted() === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
}

export function isToday(date: Date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function getDateOrTime(date: Date) {
  if (isToday(date)) {
    return date.toLocaleTimeString();
  } else {
    return date.toLocaleDateString();
  }
}

export function getDateOrDateTime(date: Date) {
  if (isToday(date)) {
    return date.toLocaleTimeString();
  } else {
    if (date.getHours() === 0 && date.getMinutes() === 0) {
      return date.toLocaleDateString();
    }
    return date.toLocaleString();
  }
}

export function getDateOrDateTimeLong(date: Date) {
  if (isToday(date)) {
    if (date.getHours() === 0 && date.getMinutes() === 0) {
      return "Today";
    }
    return `Today - ${format(date, "HH:mm:ss")}`;
  } else {
    if (date.getHours() === 0 && date.getMinutes() === 0) {
      return format(date, "PPP");
    }
    return format(date, "PPP - HH:mm:ss");
  }
}

export function secondsSinceMidnight() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = now.getTime() - midnight.getTime();
  return Math.floor(diff / 1000);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
}

export function getInitialsFromEmail(email: string) {
  return email.split("@")[0][0];
}

export function getDefaultPreferences(): Preferences {
  return {
    gradeDecimals: 3,
    newEntitySheetShouldStayOpen: false,
    passingInverse: false,
    passingGrade: 60,
    minimumGrade: 0,
    maximumGrade: 100,
    id: 0,
    userId: null,
  } satisfies NewPreferences;
}

export function getStringForAmount(
  amount: number,
  singular: string,
  plural: string
) {
  return amount === 1 ? singular : plural;
}
