"use server";
import { Grade, GradeWithSubject, NewGrade, Subject } from "@/db/schema";
import { logger } from "@/lib/logger";
import { Problem, catchProblem, getProblem } from "@/lib/problem";
import {
  addGradeToDb,
  deleteGradeByIdFromDb,
  deleteGradeFromDb,
  getAllGradesFromDb,
  getAllGradesWithSubjectFromDb,
  getGradesBySubjectFromDb,
  getGradesBySubjectWithSubjectFromDb,
  updateGradeInDb,
} from "@/lib/repositories/grade-repo";
import { doesGradePass } from "@/lib/services/notAsyncLogic";
import { getPreferencesElseGetDefault } from "@/lib/services/preferences-service";
import { getUserId, setUserId } from "@/lib/services/service-util";
import {
  getAllSubjects,
  getSubjectByIdByNameBySubject,
} from "@/lib/services/subject-service";
import { Average, AverageWithSubject } from "@/types/types";

export async function getAllGrades(
  categoryId?: number | undefined
): Promise<Grade[] | Problem> {
  try {
    const userId = await getUserId();
    logger.debug("Getting all grades for user=" + userId);
    return await getAllGradesFromDb(userId, categoryId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getAllGradesWithSubject(
  categoryId?: number | undefined
): Promise<GradeWithSubject[] | Problem> {
  try {
    const userId = await getUserId();
    logger.debug("Getting all grades with subjects for user=" + userId);
    return await getAllGradesWithSubjectFromDb(userId, categoryId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getGradesBySubject(
  subject: string | number | Subject,
  categoryId?: number | undefined
): Promise<Grade[] | Problem> {
  try {
    const userId = await getUserId();
    logger.debug(
      "Getting grades for subject=" + subject + " for user=" + userId
    );
    return await getGradesBySubjectFromDb(subject, userId, categoryId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getGradesBySubjectWithSubject(
  subject: string | number | Subject,
  categoryId?: number | undefined
): Promise<GradeWithSubject[] | Problem> {
  try {
    const userId = await getUserId();
    if (typeof subject === "object") {
      logger.debug(
        "Getting grades with subjects for subject=" +
          subject.id +
          " for user=" +
          userId
      );
    } else {
      logger.debug(
        "Getting grades with subjects for subject=" +
          subject +
          " for user=" +
          userId
      );
    }
    return await getGradesBySubjectWithSubjectFromDb(
      subject,
      userId,
      categoryId
    );
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getGradeAverageWithSubjectBySubject(
  subject: string | number | Subject,
  categoryId?: number | undefined
): Promise<AverageWithSubject | Problem> {
  try {
    const userId = await getUserId();
    const grades = await getGradesBySubjectWithSubjectFromDb(
      subject,
      userId,
      categoryId
    );
    const average = async (): Promise<AverageWithSubject> => {
      let sum = 0;
      let weightedSum = 0;
      let totalGradesWithWeight = 0;
      if (grades.length === 0) {
        return {
          subject: catchProblem(
            await getSubjectByIdByNameBySubject(subject, categoryId)
          ),
        };
      }
      grades.map((grade: GradeWithSubject) => {
        sum += grade.grades.value!;
        weightedSum += grade.grades.value! * grade.grades.weight!;
        totalGradesWithWeight += grade.grades.weight!;
      });

      if (totalGradesWithWeight === 0) {
        return {
          subject: catchProblem(
            await getSubjectByIdByNameBySubject(subject, categoryId)
          ),
        };
      }
      return {
        average: {
          subjectId: grades[0].grades.subject_fk!,
          gradeAverage: weightedSum / totalGradesWithWeight,
          gradeSum: sum,
          gradeWeightedSum: weightedSum,
          gradeWeightedAmount: totalGradesWithWeight,
          gradeAmount: grades.length,
          passing: doesGradePass(
            weightedSum / totalGradesWithWeight,
            catchProblem(await getPreferencesElseGetDefault()).preferences
          ),
        },
        subject: grades[0].subjects,
      };
    };

    if (typeof subject === "object") {
      logger.debug(
        "Getting grade average with subject for subject=" +
          subject.id +
          " for user=" +
          userId
      );
    } else {
      logger.debug(
        "Getting grade average with subject for subject=" +
          subject +
          " for user=" +
          userId
      );
    }
    return await average();
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getGradeAverageBySubject(
  subject: string | number | Subject,
  categoryId?: number | undefined
): Promise<Average | Problem> {
  try {
    const userId = await getUserId();
    const grades = await getGradesBySubjectFromDb(subject, userId, categoryId);
    const average = async (): Promise<Average> => {
      let sum = 0;
      let weightedSum = 0;
      let totalGradesWithWeight = 0;
      grades.map((grade: Grade) => {
        sum += grade.value!;
        weightedSum += grade.value! * grade.weight!;
        totalGradesWithWeight += grade.weight!;
      });
      return {
        subjectId: grades[0].subject_fk!,
        gradeAverage:
          weightedSum / totalGradesWithWeight > 0
            ? weightedSum / totalGradesWithWeight
            : 0,
        gradeAmount: grades.length,
        gradeWeightedAmount: totalGradesWithWeight,
        gradeWeightedSum: weightedSum,
        gradeSum: sum,
        passing: doesGradePass(
          weightedSum / totalGradesWithWeight,
          catchProblem(await getPreferencesElseGetDefault()).preferences
        ),
      };
    };
    if (typeof subject === "object") {
      logger.debug(
        "Getting grade average for subject=" +
          subject.id +
          " for user=" +
          userId
      );
    } else {
      logger.debug(
        "Getting grade average for subject=" + subject + " for user=" + userId
      );
    }
    return await average();
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getAllGradeAverages(
  categoryId?: number | undefined
): Promise<Average[] | Problem> {
  try {
    const subjects: Subject[] = catchProblem(await getAllSubjects(categoryId));
    const average = async () => {
      let promises = subjects.map((subject) =>
        getGradeAverageBySubject(subject, categoryId)
      );
      let resolved: (Average | Problem)[] = await Promise.all(promises);
      let averages: Average[] = resolved.map((res) => {
        return catchProblem(res);
      });
      return averages;
    };

    logger.debug("Getting all grade averages for category=" + categoryId);

    return average();
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getAllGradeAveragesWithSubject(
  categoryId?: number | undefined
): Promise<AverageWithSubject[] | Problem> {
  try {
    const subjects: Subject[] = catchProblem(await getAllSubjects(categoryId));
    const average = async () => {
      let promises = subjects.map((subject) =>
        getGradeAverageWithSubjectBySubject(subject, categoryId)
      );
      let resolved: (AverageWithSubject | Problem)[] = await Promise.all(
        promises
      );
      let averages: AverageWithSubject[] = resolved.map((res) => {
        return catchProblem(res);
      });
      return averages;
    };

    logger.debug(
      "Getting all grade averages with subjects for category=" + categoryId
    );

    return average();
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function addGrade(newGrade: NewGrade): Promise<number | Problem> {
  try {
    const userId = await getUserId();
    newGrade = await setUserId(newGrade);
    logger.info(
      "Adding grade=" +
        newGrade.value +
        " in subject=" +
        newGrade.subject_fk +
        " for user=" +
        userId
    );
    return await addGradeToDb(newGrade);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
      e: JSON.stringify(e),
    }) satisfies Problem;
  }
}

export async function deleteGradeByGrade(
  grade: Grade
): Promise<number | Problem> {
  try {
    const userId = await getUserId();
    logger.info("Deleting grade=" + grade.id + " for user=" + userId);
    return catchProblem(await deleteGradeFromDb(grade, userId));
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
      e: JSON.stringify(e),
    }) satisfies Problem;
  }
}

export async function deleteGradeById(
  gradeId: number
): Promise<number | Problem> {
  try {
    const userId = await getUserId();
    logger.info("Deleting grade by id=" + gradeId + " for user=" + userId);
    return catchProblem(await deleteGradeByIdFromDb(gradeId, userId));
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
      e: JSON.stringify(e),
    }) satisfies Problem;
  }
}

export async function updateGrade(grade: Grade): Promise<number | Problem> {
  try {
    const userId = await getUserId();
    logger.info("Updating grade=" + grade.id + " for user=" + userId);
    return catchProblem(await updateGradeInDb(grade, userId));
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
      e: JSON.stringify(e),
    }) satisfies Problem;
  }
}
