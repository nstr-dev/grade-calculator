"use server";
import { NewSubject, Subject } from "@/db/schema";
import { logger } from "@/lib/logger";
import { Problem, catchProblem, getProblem } from "@/lib/problem";
import {
  addSubjectToDb,
  deleteSubjectFromDb,
  getAllSubjectsFromDb,
  getSubjectByIdFromDb,
  getSubjectByNameFromDb,
  updateSubjectInDb,
} from "@/lib/repositories/subject-repo";
import { getUserId, setUserId } from "@/lib/services/service-util";

export async function getAllSubjects(
  categoryId?: number | undefined
): Promise<Subject[] | Problem> {
  try {
    const userId = await getUserId();
    logger.debug("Getting all subjects for user=" + userId);
    return await getAllSubjectsFromDb(userId, categoryId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getSubjectById(
  subjectId: number
): Promise<Subject | Problem> {
  try {
    const userId = await getUserId();
    logger.debug("Getting subject by id=" + subjectId + " for user=" + userId);
    return await getSubjectByIdFromDb(subjectId, userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getSubjectByName(
  subjectName: string,
  categoryId?: number | undefined
): Promise<Subject | Problem> {
  try {
    const userId = await getUserId();
    logger.debug(
      "Getting subject by name=" + subjectName + " for user=" + userId
    );
    return await getSubjectByNameFromDb(subjectName, userId, categoryId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function addSubject(
  newSubject: NewSubject
): Promise<number | Problem> {
  try {
    newSubject = await setUserId(newSubject);
    logger.info(
      "Adding subject=" +
        newSubject.name +
        " with weight=" +
        newSubject.weight +
        " for user=" +
        newSubject.userId
    );
    return await addSubjectToDb(newSubject);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getSubjectIdElseAdd(
  newSubject: NewSubject
): Promise<number | Problem> {
  try {
    const userId = await getUserId();
    newSubject = await setUserId(newSubject);
    const subject = await getSubjectByNameFromDb(
      newSubject.name!,
      userId,
      newSubject.category_fk!
    );
    if (subject) {
      logger.info(
        "Omitted adding subject=" +
          newSubject.name +
          " which already exists as subject=" +
          subject.id +
          " for user=" +
          userId
      );
      return subject.id;
    }
    logger.info(
      "Adding subject=" +
        newSubject.name +
        " with weight=" +
        newSubject.weight +
        " for user=" +
        userId
    );
    return await addSubjectToDb(newSubject);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function quickCreateSubject(
  name: string,
  weight: number,
  categoryId?: number | undefined
): Promise<number | Problem> {
  try {
    const userId = await getUserId();
    const newSubject: NewSubject = {
      name,
      weight: weight,
      userId,
      category_fk: categoryId,
    } satisfies NewSubject;
    return await addSubject(newSubject);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getSubjectByIdByNameBySubject(
  subject: string | number | Subject,
  categoryId?: number | undefined
): Promise<Subject | Problem> {
  try {
    if (typeof subject === "string") {
      logger.debug(
        "Getting subject by name=" +
          subject +
          " for user=" +
          (await getUserId())
      );
      return catchProblem(await getSubjectByName(subject, categoryId));
    }
    if (typeof subject === "number") {
      logger.debug(
        "Getting subject by id=" + subject + " for user=" + (await getUserId())
      );
      return catchProblem(await getSubjectById(subject));
    }
    logger.debug(
      "Getting subject by (self) subject=" +
        subject.id +
        " for user=" +
        (await getUserId())
    );
    return subject;
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function deleteSubject(
  subject: string | number | Subject
): Promise<string | Problem> {
  try {
    let resolvedSubject = catchProblem(
      await getSubjectByIdByNameBySubject(subject)
    );
    const userId = await getUserId();
    logger.info(
      "Deleting subject=" + resolvedSubject.id + " for user=" + userId
    );
    return await deleteSubjectFromDb(resolvedSubject, userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function updateSubject(
  subject: Subject
): Promise<string | Problem> {
  try {
    const userId = await getUserId();
    logger.info("Updating subject=" + subject.id + " for user=" + userId);
    return await updateSubjectInDb(subject, userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}
