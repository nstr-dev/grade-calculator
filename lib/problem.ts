import { logger } from "@/lib/logger";
import { toastProblem } from "@/lib/toasts";
import { Empty } from "@/types/types";
import { signOut } from "next-auth/react";

export type Problem = {
  errorMessage?: string | Empty;
  statusCode?: number | string | Empty;
  errorCode?: ErrorCode | number | string | Empty;
  solution?: string | Empty;
  detail?: string | Empty;
  finalMessage?: string | Empty;
  e?: string | Empty;
};

enum ErrorCode {
  UniqueConstraintViolation = "23505",
  ForeignKeyConstraintViolation = "23503",
  UnauthorizedViolation = "GC401",
}

const errorMessages: { [key in ErrorCode]?: string } = {
  [ErrorCode.UniqueConstraintViolation]: "You already added this item",
  [ErrorCode.ForeignKeyConstraintViolation]: "Some related data is missing",
  [ErrorCode.UnauthorizedViolation]: "You are not logged in",
};

export function getProblem(problem: Problem): Problem {
  const finalMessage = errorMessages[problem.errorCode as ErrorCode];
  problem = { ...problem, finalMessage };
  // console.warn(problem);
  logger.error(problem);

  return problem;
}

export function catchProblem(thingInQuestion: any, shouldThrow = false): any {
  if (
    thingInQuestion &&
    (thingInQuestion.errorMessage ||
      thingInQuestion.statusCode ||
      thingInQuestion.errorCode ||
      thingInQuestion.solution ||
      thingInQuestion.detail ||
      thingInQuestion.finalMessage ||
      thingInQuestion.e)
  ) {
    if (
      thingInQuestion.errorCode === ErrorCode.ForeignKeyConstraintViolation &&
      thingInQuestion.detail?.includes('is not present in table "user".')
    )
      signOut();

    if (thingInQuestion.finalMessage) toastProblem(thingInQuestion);
    if (shouldThrow) throw new Error(thingInQuestion.finalMessage);
  } else return thingInQuestion;
}
