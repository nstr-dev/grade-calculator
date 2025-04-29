// USAGE: node scripts/convertExportToMockData.js ./export.json > ./mockdata-export.ts

const fs = require("fs");
const path = require("path");

function buildMockData(exported) {
  // 1) build subjects with unique IDs
  const subjects = exported.subjects.map((s, i) => ({
    id: i + 1,
    name: s.name,
    weight: s.weight,
    category_fk: 0,
    userId: "0",
  }));
  const subjectByName = Object.fromEntries(subjects.map((s) => [s.name, s]));

  // 2) build data entries
  const data = exported.grades.map((g, idx) => {
    const subj = subjectByName[g.subjects.name];
    return {
      grades: {
        id: idx + 1,
        value: g.grades.value,
        subject_fk: subj.id,
        description: g.grades.description,
        weight: g.grades.weight,
        date: g.grades.date,
        category_fk: 0,
        userId: "0",
      },
      subjects: subj,
    };
  });

  // 3) compute averages per subject
  const stats = {};
  data.forEach(({ grades }) => {
    const key = grades.subject_fk;
    if (!stats[key]) {
      stats[key] = {
        gradeSum: 0,
        gradeWeightedSum: 0,
        gradeWeightedAmount: 0,
        gradeAmount: 0,
      };
    }
    stats[key].gradeSum += grades.value;
    stats[key].gradeWeightedSum += grades.value * grades.weight;
    stats[key].gradeWeightedAmount += grades.weight;
    stats[key].gradeAmount += 1;
  });

  const averageData = Object.entries(stats).map(([subjId, s]) => {
    const avgValue = s.gradeWeightedSum / s.gradeWeightedAmount;
    return {
      average: {
        subjectId: Number(subjId),
        gradeAverage: parseFloat(avgValue.toFixed(3)),
        gradeSum: parseFloat(s.gradeSum.toFixed(3)),
        gradeWeightedSum: parseFloat(s.gradeWeightedSum.toFixed(3)),
        gradeWeightedAmount: parseFloat(s.gradeWeightedAmount.toFixed(3)),
        gradeAmount: s.gradeAmount,
        passing: avgValue >= exported.preferences.passingGrade,
      },
      subject: subjects.find((x) => x.id === Number(subjId)),
    };
  });

  return { data, averageData };
}

if (require.main === module) {
  const [, , inputFile] = process.argv;
  if (!inputFile) {
    console.error("Usage: node convert.js exported.json");
    process.exit(1);
  }

  const exported = JSON.parse(fs.readFileSync(path.resolve(inputFile), "utf8"));
  const { data, averageData } = buildMockData(exported);

  // emit TS module
  console.log(
    `import { GradeWithSubject } from "@/db/schema";
import { AverageWithSubject } from "@/types/types";

export const MOCKDATA: {
  data: GradeWithSubject[];
  averageData: AverageWithSubject[];
  failingData: (data: AverageWithSubject[]) => AverageWithSubject[];
  passingData: (data: AverageWithSubject[]) => AverageWithSubject[];
} = {
  data: ${JSON.stringify(data, null, 2).replace(
    /"date":\s*"([^"]+)"/g,
    `"date": new Date("$1")`
  )},
  averageData: ${JSON.stringify(averageData, null, 2)},
  failingData: (data: AverageWithSubject[]) =>
    data.filter(
      (average: AverageWithSubject) => average.average?.passing === false
    ),
  passingData: (data: AverageWithSubject[]) =>
    data.filter((average: AverageWithSubject) => average.average?.passing)
};`
  );
}
