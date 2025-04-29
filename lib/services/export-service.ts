"use server";

import {
  GradeWithSubject,
  NewGradeWithNewSubject,
  NewPreferences,
  NewSubject,
  Preferences,
  Subject,
} from "@/db/schema";
import { logger } from "@/lib/logger";
import { catchProblem } from "@/lib/problem";
import { insertArchivedata } from "@/lib/services/archive-service";
import {
  addGrade,
  getAllGradesWithSubject,
} from "@/lib/services/grade-service";
import {
  getPreferences,
  savePreferences,
} from "@/lib/services/preferences-service";
import {
  addSubject,
  getAllSubjects,
  getSubjectIdElseAdd,
} from "@/lib/services/subject-service";

import zlib from "zlib";

export type ExportableData = {
  preferences: NewPreferences | undefined;
  grades: NewGradeWithNewSubject[];
  subjects: NewSubject[];
  category: string;
};

export async function prepareDataForExport(
  categoryName: string,
  categoryId?: number | undefined
): Promise<ExportableData> {
  const preferences: Preferences = catchProblem(await getPreferences())[0];
  const grades: GradeWithSubject[] = catchProblem(
    await getAllGradesWithSubject(categoryId)
  );
  const subjects: Subject[] = catchProblem(await getAllSubjects(categoryId));

  const strippedPreferences = (): NewPreferences | undefined => {
    if (preferences)
      return {
        passingGrade: preferences.passingGrade,
        minimumGrade: preferences.minimumGrade,
        maximumGrade: preferences.maximumGrade,
        gradeDecimals: preferences.gradeDecimals,
        newEntitySheetShouldStayOpen: preferences.newEntitySheetShouldStayOpen,
        passingInverse: preferences.passingInverse,
      };

    return undefined;
  };

  const strippedGrades: NewGradeWithNewSubject[] = grades.map((grade) => {
    return {
      grades: {
        value: grade.grades.value,
        weight: grade.grades.weight,
        date: grade.grades.date,
        description: grade.grades.description,
      },
      subjects: {
        name: grade.subjects.name,
      },
    };
  });

  const strippedSubjects: NewSubject[] = subjects.map((subject) => {
    return {
      name: subject.name,
      weight: subject.weight,
    };
  });

  const exportableData = {
    preferences: strippedPreferences(),
    grades: strippedGrades,
    subjects: strippedSubjects,
    category: categoryName,
  };
  return exportableData;
}

export async function archiveCategory(data: ExportableData): Promise<string> {
  zlib.gzip(JSON.stringify(data), async (err, buffer) => {
    if (!err) {
      let result = buffer.toString("base64");
      await insertArchivedata(result, data.category);
    } else {
      logger.error(err);
    }
  });
  return "Category archived";
}

export async function unarchiveCategory(data: string): Promise<ExportableData> {
  let decodedData = Buffer.from(data, "base64");
  let result = zlib.gunzipSync(new Uint8Array(decodedData));
  return JSON.parse(result.toString());
}

export async function importData(
  data: ExportableData,
  purge: boolean,
  categoryId?: number | undefined
) {
  if (data.preferences) savePreferences(data.preferences);
  const nonUniqueSubjectsFromSubjects = data.subjects.map((subject) => {
    return { name: subject.name, weight: subject.weight };
  });
  const nonUniqueSubjects = [...nonUniqueSubjectsFromSubjects];
  const uniqueSubjects = [...new Set(nonUniqueSubjects)];
  const subjectWithIds = await Promise.all(
    uniqueSubjects.map(async (iteratingSubject) => {
      const subject = {
        name: iteratingSubject.name,
        weight: iteratingSubject.weight,
        category_fk: categoryId,
      };
      if (purge) {
        let result = catchProblem(await addSubject(subject));
        return { name: subject.name, id: result };
      } else {
        let result = catchProblem(await getSubjectIdElseAdd(subject));
        return { name: subject.name, id: result };
      }
    })
  );

  let results = data.grades.forEach(async (grade) => {
    let resultingSubject = subjectWithIds.find(
      (subject) => subject.name === grade.subjects.name
    )?.id;
    grade.grades.subject_fk = resultingSubject;
    grade.grades.category_fk = categoryId;
    grade.grades.date = new Date(grade.grades.date || Date.now());
    let result = catchProblem(await addGrade(grade.grades));
    return result;
  });
  return results;
}
