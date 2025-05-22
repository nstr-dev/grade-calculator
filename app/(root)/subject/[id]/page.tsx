"use client";

import { CardSkeleton } from "@/components/cards/card-skeleton";
import { GradeOverviewForSubject } from "@/components/cards/grade-overview";
import { GradesForSubject } from "@/components/cards/gradesForSubject/gradesForSubject";
import { RequiredGradesForSubject } from "@/components/cards/required-grades";
import { usePreferences } from "@/components/preferences-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardBoard } from "@/components/ui/cardboard";
import { DetailRow, DetailRowBoolean } from "@/components/ui/detail-row";
import { GradeWithSubject, Subject } from "@/db/schema";
import { useDevice } from "@/lib/hooks/useMediaQuery";
import { catchProblem } from "@/lib/problem";
import {
  getGradeAverageBySubject,
  getGradesBySubjectWithSubject,
} from "@/lib/services/grade-service";
import { doesGradePass } from "@/lib/services/notAsyncLogic";
import { getSubjectById } from "@/lib/services/subject-service";
import { round, truncateText } from "@/lib/utils";
import { Average } from "@/types/types";
import { Bird, HomeIcon, LogInIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SubjectPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  return <SubjectDetails subjectId={params.id} />;
}

function SubjectDetails({ subjectId }: Readonly<{ subjectId: string }>) {
  const session = useSession();
  const router = useRouter();
  const { isMobile, isTablet, isDesktop } = useDevice();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [grades, setGrades] = useState<GradeWithSubject[]>([]);
  const [average, setAverage] = useState<Average | null>(null);
  const [dataState, setDataState] = useState<
    "loading" | "loaded" | "notfound" | "empty"
  >("loading");
  const userPreferences = usePreferences();
  const t = useTranslations();

  const fetchData = async () => {
    try {
      const id = Number(subjectId);
      const subject = catchProblem(await getSubjectById(id));
      const newGrades = catchProblem(
        await getGradesBySubjectWithSubject(subject)
      );
      const newAverage = catchProblem(await getGradeAverageBySubject(subject));
      if (subject) {
        setSubject(subject);
        setGrades([...newGrades]);
        setAverage(newAverage);
        setDataState("loaded");
      } else {
        setDataState("notfound");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setDataState("loading");
    const fetchData = async () => {
      try {
        const id = Number(subjectId);
        const subject = catchProblem(await getSubjectById(id));
        const newGrades = catchProblem(
          await getGradesBySubjectWithSubject(subject)
        );
        const newAverage = catchProblem(
          await getGradeAverageBySubject(subject)
        );
        if (subject && newGrades && newAverage) {
          setSubject(subject);
          setGrades([...newGrades]);
          setAverage(newAverage);
          setDataState("loaded");
        } else {
          subject && newGrades.length === 0
            ? setDataState("empty")
            : setDataState("notfound");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [subjectId, router, session]);

  if (session.status === "unauthenticated")
    return (
      <div>
        <meta name="robots" content="noindex,nofollow" />
        <Breadcrumb className="pl-2 pb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">{t("generic.home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{t("subjects.subject")}</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {subject ? truncateText(subject.name!, 20).text : subjectId}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Alert>
          <Bird className="h-4 w-4" />
          <AlertTitle className="font-bold">{t("errors.woops")}</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <>{t("errors.unauthenticated-subject-details")}</>
            <Button asChild>
              <Link
                href={"/login"}
                className="flex flex-row gap-2 justify-center items-center"
              >
                <LogInIcon className="size-4 text-muted-foreground" />
                {t("auth.login-now")}
              </Link>
            </Button>
            <Button variant={"outline"} asChild>
              <Link
                href={"/"}
                className="flex flex-row gap-2 justify-center items-center"
              >
                <HomeIcon className="size-4 text-muted-foreground" />
                {t("auth.return-home")}
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  if (dataState === "empty" || (grades.length === 0 && dataState === "loaded"))
    return (
      <div>
        <meta name="robots" content="noindex,nofollow" />
        <Breadcrumb className="pl-2 pb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">{t("generic.home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{t("subjects.subject")}</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {subject ? truncateText(subject.name!, 20).text : subjectId}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Alert>
          <Bird className="h-4 w-4" />
          <AlertTitle className="font-bold">{t("errors.woops")}</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <>{t("errors.not-enough-data-yet-subject-detail")}</>
            <Button variant={"outline"} asChild>
              <Link
                href={"/"}
                className="flex flex-row gap-2 justify-center items-center"
              >
                <HomeIcon className="size-4 text-muted-foreground" />
                {t("auth.return-home")}
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  if (dataState === "notfound")
    return (
      <div>
        <meta name="robots" content="noindex,nofollow" />
        <Breadcrumb className="pl-2 pb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">{t("generic.home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{t("subjects.subject")}</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {subject ? truncateText(subject.name!, 20).text : subjectId}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Alert>
          <Bird className="h-4 w-4" />
          <AlertTitle className="font-bold">{t("errors.woops")}</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <>{t("errors.subject-not-found")}</>
            <Button variant={"outline"} asChild>
              <Link
                href={"/"}
                className="flex flex-row gap-2 justify-center items-center"
              >
                <HomeIcon className="size-4 text-muted-foreground" />
                {t("auth.return-home")}
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  if (
    session.status === "loading" ||
    dataState === "loading" ||
    subject === null ||
    subject === undefined ||
    grades === null ||
    grades === undefined ||
    average === null ||
    average === undefined ||
    (!isMobile && !isTablet && !isDesktop)
  )
    return (
      <>
        <CardBoard className="flex xl:hidden">
          <CardSkeleton wide variant="medium" />
          <CardSkeleton wide variant="large" />
          <CardSkeleton wide variant="small" />
          <CardSkeleton wide variant="small" />
        </CardBoard>
        <CardBoard row className="hidden xl:flex">
          <CardBoard>
            <CardSkeleton variant="small" />
            <CardSkeleton variant="small" />
            <CardSkeleton variant="medium" />
          </CardBoard>
          <CardBoard>
            <CardSkeleton variant="medium" />
            <CardSkeleton variant="medium" />
          </CardBoard>
          <CardBoard>
            <CardSkeleton variant="large" />
            <CardSkeleton variant="medium" />
          </CardBoard>
        </CardBoard>
      </>
    );
  if (session.status === "authenticated")
    return (
      dataState === "loaded" && (
        <>
          <Breadcrumb className="pl-2 pb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">{t("generic.home")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{t("subjects.subject")}</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {subject ? truncateText(subject.name!, 20).text : subjectId}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <CardBoard row={isDesktop}>
            {subject ? (
              <>
                <CardBoard>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {truncateText(subject.name!, 20).text}
                      </CardTitle>
                      <CardDescription>
                        {t("subject-details.title")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DetailRow title={t("generic.id")} value={subject.id} />
                      <DetailRow
                        title={t("generic.name")}
                        value={truncateText(subject.name!, 40).text}
                      />
                      <DetailRowBoolean
                        variant="yes-no"
                        title={t("filters.passing")}
                        value={doesGradePass(
                          average.gradeAverage!,
                          userPreferences.preferences!
                        )}
                      />
                      <DetailRowBoolean
                        variant="yes-no"
                        title={t("grades.academic-relevance-title")}
                        value={subject.weight === 1}
                      />
                      {average.gradeAmount === average.gradeWeightedAmount ? (
                        <DetailRow
                          title={t("subjects.grade-count")}
                          value={round(average.gradeAmount, 5)}
                        />
                      ) : (
                        <>
                          <DetailRow
                            title={t("subjects.grade-count")}
                            value={round(average.gradeAmount, 5)}
                          />
                          <DetailRow
                            title={t("subjects.grade-count-weighted")}
                            value={round(average.gradeWeightedAmount, 5)}
                          />
                        </>
                      )}

                      {average.gradeSum === average.gradeWeightedSum ? (
                        <DetailRow
                          title={t("subjects.grade-sum")}
                          value={round(average.gradeSum!, 5)}
                        />
                      ) : (
                        <>
                          <DetailRow
                            title={t("subjects.grade-sum")}
                            value={round(average.gradeSum!, 5)}
                          />
                          <DetailRow
                            title={t("subjects.grade-sum-weighted")}
                            value={round(average.gradeWeightedSum!, 5)}
                          />
                        </>
                      )}
                    </CardContent>
                  </Card>
                  <GradesForSubject
                    data={grades}
                    setData={setGrades}
                    refresh={fetchData}
                    subject={subject}
                  />
                </CardBoard>
                {average && (
                  <>
                    <GradeOverviewForSubject
                      data={grades}
                      averageData={average}
                    />
                    <RequiredGradesForSubject
                      subject={subject}
                      averageData={average}
                    />
                  </>
                )}
              </>
            ) : (
              <div>{t("errors.subject-not-found")}</div>
            )}
          </CardBoard>
        </>
      )
    );
}
