"use server";

import { db } from "@/db";
import {
  Account,
  Grade,
  Subject,
  UserAccount,
  accounts,
  grades,
  subjects,
  users,
} from "@/db/schema";
import { catchProblem } from "@/lib/problem";
import { getAccount } from "@/lib/services/user-service";
import { Empty } from "@/types/types";
import { and, eq } from "drizzle-orm";

export async function deleteUserDataFromDb(
  userId: string
): Promise<UserAccount> {
  const account = catchProblem(await getAccount());
  const result = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning()
    .execute();
  return {
    user: result[0],
    account,
  };
}

export async function getAccountFromDb(userId: string): Promise<Account> {
  const account = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId))
    .execute();
  return account[0];
}

export async function clearUserSubjectsGradesFromDb(
  userId: string
): Promise<Subject[]> {
  const result = await db
    .delete(subjects)
    .where(eq(subjects.userId, userId))
    .returning()
    .execute();
  return result;
}

export async function clearUserSubjectsGradesByCategoryFromDb(
  userId: string,
  categoryId: number
): Promise<Subject[]> {
  const result = await db
    .delete(subjects)
    .where(
      and(eq(subjects.userId, userId), eq(subjects.category_fk, categoryId))
    )
    .returning()
    .execute();
  return result;
}

export async function clearUserGradesFromDb(userId: string): Promise<Grade[]> {
  const result = await db
    .delete(grades)
    .where(eq(grades.userId, userId))
    .returning()
    .execute();
  return result;
}

export async function clearUserGradesByCategoryFromDb(
  userId: string,
  categoryId: number
): Promise<Grade[]> {
  const result = await db
    .delete(grades)
    .where(and(eq(grades.userId, userId), eq(grades.category_fk, categoryId)))
    .returning()
    .execute();
  return result;
}

export async function saveRefreshTokenIntoDb(
  userId: string,
  refreshToken: string
): Promise<Account> {
  const result = await db
    .update(accounts)
    .set({ refresh_token: refreshToken })
    .where(eq(accounts.userId, userId))
    .returning()
    .execute();
  return result[0];
}

export async function getRefreshTokenFromDb(
  userId: string
): Promise<string | Empty> {
  const result = await db
    .select({ token: accounts.refresh_token })
    .from(accounts)
    .where(eq(accounts.userId, userId))
    .execute();

  if (result.length === 0) return null;
  return result[0].token;
}
