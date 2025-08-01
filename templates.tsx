import { ReactNode } from "react";
import Flag from "react-flagpack";

export type PreferenceTemplate = {
  id: string;
  icon: ReactNode;
  title: string;
  passingGrade: number | null;
  minimumGrade: number | null;
  maximumGrade: number | null;
  passingInverse: boolean | null;
};

const getFlag = (code: string) => (
  <Flag
    size="m"
    code={code}
    gradient="real-linear"
    hasDropShadow
    hasBorder={false}
    hasBorderRadius
  />
);

export const templates: PreferenceTemplate[] = [
  {
    id: "custom",
    icon: "✒️",
    title: "Custom",
    passingGrade: 5,
    minimumGrade: 1,
    maximumGrade: 10,
    passingInverse: false,
  },
  {
    id: "percentage",
    icon: "%",
    title: "Percentage",
    passingGrade: 60,
    minimumGrade: 0,
    maximumGrade: 100,
    passingInverse: false,
  },
  {
    id: "switzerland",
    icon: getFlag("CH"),
    title: "Switzerland",
    passingGrade: 4,
    minimumGrade: 1,
    maximumGrade: 6,
    passingInverse: false,
  },
  {
    id: "germany",
    icon: getFlag("DE"),
    title: "Germany",
    passingGrade: 4,
    minimumGrade: 1,
    maximumGrade: 6,
    passingInverse: true,
  },
  {
    id: "poland_hs",
    icon: getFlag("PL"),
    title: "Poland",
    passingGrade: 2,
    minimumGrade: 1,
    maximumGrade: 6,
    passingInverse: false,
  },
  {
    id: "poland_he",
    icon: getFlag("PL"),
    title: "Poland (Higher Ed.)",
    passingGrade: 3,
    minimumGrade: 2,
    maximumGrade: 5,
    passingInverse: false,
  },
  {
    id: "france",
    icon: getFlag("FR"),
    title: "France",
    passingGrade: 10,
    minimumGrade: 0,
    maximumGrade: 20,
    passingInverse: false,
  },
  {
    id: "italy_hs",
    icon: getFlag("IT"),
    title: "Italy",
    passingGrade: 6,
    minimumGrade: 0,
    maximumGrade: 10,
    passingInverse: false,
  },
  {
    id: "italy_he",
    icon: getFlag("IT"),
    title: "Italy (Higher Ed.)",
    passingGrade: 18,
    minimumGrade: 0,
    maximumGrade: 10,
    passingInverse: false,
  },
  {
    id: "chile",
    icon: getFlag("CL"),
    title: "Chile",
    passingGrade: 7,
    minimumGrade: 1,
    maximumGrade: 4,
    passingInverse: false,
  },
];
