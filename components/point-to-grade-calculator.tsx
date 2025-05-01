"use client";
import { usePreferences } from "@/components/preferences-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getGradeFromPointsWithBestGradeAtPercentage } from "@/lib/services/notAsyncLogic";
import { CalculatorIcon, XIcon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Asterisk } from "./ui/asterisk";
import { Input } from "./ui/input";

type GradeFormField =
  | ControllerRenderProps<
      {
        grade: number;
        subject: number;
        description?: string;
        weight?: number;
        date?: Date;
      },
      "grade"
    >
  | ControllerRenderProps<
      {
        date: Date;
        weight: number;
        grade: number;
        subject: number;
        description?: string;
      },
      "grade"
    >;

export function PointToGradeCalculator({
  field,
  showPointCalc,
  setShowPointCalc,
}: {
  field: GradeFormField;
  showPointCalc: boolean;
  setShowPointCalc: Function;
}) {
  const [points, setPoints] = useState<number | undefined>();
  const [maxPoints, setMaxPoints] = useState<number | undefined>();
  const [bestGradeAtPercentage, setBestGradeAtPercentage] = useState<
    number | undefined
  >();

  const preferences = usePreferences().preferences;

  function triggerPointCalculation(field: GradeFormField) {
    if (isPointCalculationInvalid()) return;
    field.onChange(
      getGradeFromPointsWithBestGradeAtPercentage(
        //@ts-expect-error
        points,
        maxPoints,
        bestGradeAtPercentage ?? 100,
        preferences
      )
    );
  }

  function isPointCalculationInvalid() {
    return (
      points == null ||
      maxPoints == null ||
      !preferences ||
      points > maxPoints ||
      points < 0 ||
      maxPoints < 0
    );
  }

  const t = useTranslations();

  return showPointCalc ? (
    <div
      className="flex flex-col gap-2 p-3 border-4 rounded-xl"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          triggerPointCalculation(field);
        }
      }}
    >
      <div className="flex flex-row gap-2">
        <div>
          <Label htmlFor="point_calc_points">
            {t("grades.point-calculator.achieved-points")}
            <Asterisk className="ml-1" />
          </Label>
          <Input
            id="point_calc_points"
            value={points}
            onChange={(e) => {
              if (e.target.value === "") setPoints(undefined);
              else setPoints(Number(e.target.value));
            }}
            type="number"
            step="any"
            placeholder={t("grades.point-calculator.enter-number")}
          />
        </div>
        <div>
          <Label htmlFor="point_calc_max_points">
            {t("grades.point-calculator.maximum-points")}
            <Asterisk className="ml-1" />
          </Label>
          <Input
            id="point_calc_max_points"
            value={maxPoints}
            onChange={(e) => {
              if (e.target.value === "") setMaxPoints(undefined);
              else setMaxPoints(Number(e.target.value));
            }}
            type="number"
            step="any"
            placeholder={t("grades.point-calculator.enter-number")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="point_calc_percentage">
          {t("grades.point-calculator.percentage-needed-for-best-grade")}
        </Label>
        <div className="w-full flex flex-row gap-2 items-center">
          <Input
            value={bestGradeAtPercentage}
            onChange={(e) => {
              if (e.target.value === "") setBestGradeAtPercentage(undefined);
              else if (Number(e.target.value) > 100)
                setBestGradeAtPercentage(100);
              else if (Number(e.target.value) < 0) setBestGradeAtPercentage(0);
              else setBestGradeAtPercentage(Number(e.target.value));
            }}
            type="number"
            step="5"
            placeholder={t("grades.point-calculator.defaults-to-100")}
          />{" "}
          %
        </div>
      </div>
      <div className="flex flex-row flex-1 gap-2">
        <Button
          type="button"
          className="w-full"
          variant="secondary"
          disabled={isPointCalculationInvalid()}
          onClick={() => {
            triggerPointCalculation(field);
          }}
        >
          <ZapIcon className="mr-2 size-4" />
          {t("actions.calculate")}
        </Button>
        <Button
          onClick={() => setShowPointCalc(false)}
          type="button"
          variant="outline"
        >
          <XIcon className="mr-2 size-4" />
          {t("actions.close")}
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex flex-1 pt-1">
      <Button
        className="w-full"
        onClick={() => setShowPointCalc(true)}
        type="button"
        variant="secondary"
      >
        <CalculatorIcon className="mr-2 size-4" />
        {t("grades.point-calculator.point-calculator")}
      </Button>
    </div>
  );
}
