"use server";

import { Account, Grade, Subject, UserAccount } from "@/db/schema";
import { logger } from "@/lib/logger";
import { Problem, getProblem } from "@/lib/problem";
import {
  clearUserGradesByCategoryFromDb,
  clearUserGradesFromDb,
  clearUserSubjectsGradesByCategoryFromDb,
  clearUserSubjectsGradesFromDb,
  deleteUserDataFromDb,
  getAccountFromDb,
  getRefreshTokenFromDb,
  saveRefreshTokenIntoDb,
} from "@/lib/repositories/user-repo";
import { getUserId } from "@/lib/services/service-util";
import { Empty } from "@/types/types";

export async function clearUserSubjectsGrades(): Promise<Subject[] | Problem> {
  try {
    const userId = await getUserId();
    logger.warn("Clearing all subjects and grades for user=" + userId);
    return await clearUserSubjectsGradesFromDb(userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function clearUserSubjectsGradesByCategory(
  categoryId: number
): Promise<Subject[] | Problem> {
  try {
    const userId = await getUserId();
    logger.warn(
      "Clearing all subjects and grades for category=" +
        categoryId +
        " for user=" +
        userId
    );
    return await clearUserSubjectsGradesByCategoryFromDb(userId, categoryId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function clearUserGrades(): Promise<Grade[] | Problem> {
  try {
    const userId = await getUserId();
    logger.warn("Clearing all grades for user=" + userId);
    return await clearUserGradesFromDb(userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getAccount(): Promise<Account | Problem> {
  try {
    const userId = await getUserId();
    return await getAccountFromDb(userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function clearUserGradesByCategory(
  categoryId: number
): Promise<Grade[] | Problem> {
  try {
    const userId = await getUserId();
    logger.warn(
      "Clearing all grades for category=" + categoryId + " for user=" + userId
    );
    return await clearUserGradesByCategoryFromDb(userId, categoryId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function clearUserData(): Promise<UserAccount | Problem> {
  try {
    const userId = await getUserId();
    logger.warn("Clearing all user data for user=" + userId);
    return await deleteUserDataFromDb(userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function saveRefreshToken(
  userId: string,
  refreshToken: string
): Promise<Problem | Account> {
  try {
    logger.info("Saving refresh token for user=" + userId);
    return await saveRefreshTokenIntoDb(userId, refreshToken);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getRefreshToken(
  userId: string
): Promise<string | Empty | Problem> {
  try {
    logger.debug("Getting refresh token for user=" + userId);
    return await getRefreshTokenFromDb(userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}
