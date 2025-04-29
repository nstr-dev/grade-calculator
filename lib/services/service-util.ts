"use server";
import { NewGrade, NewPreferences, NewSubject } from "@/db/schema";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const getUser = async () => {
  const session = await auth();
  return session?.user;
};

export const getUserId = async (): Promise<string> => {
  const uid = (await getUser())?.uid;
  if (uid) return uid;

  const error: any = new Error("Not authorized");
  logger.error("Not authorized");
  error.code = "GC401";
  throw error;
};

export const setUserId = async (
  object: NewSubject | NewGrade | NewPreferences
) => {
  object.userId = (await getUser())?.uid!;
  return object;
};
