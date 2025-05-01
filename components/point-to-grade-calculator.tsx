"use client";
import { usePreferences } from "@/components/preferences-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getGradeFromPointsWithBestGradeAtPercentage } from "@/lib/services/notAsyncLogic";
import { CalculatorIcon, XIcon, ZapIcon } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Asterisk } from "./ui/asterisk";
import { Input } from "./ui/input";

type GradeFormField =
  | ControllerRenderProps<
      {
        grade: number;
        subject: number;
        description?: string | undefined;
        weight?: number | undefined;
        date?: Date | undefined;
      },
      "grade"
    >
  | ControllerRenderProps<
      {
        date: Date;
        weight: number;
        grade: number;
        subject: number;
        description?: string | undefined;
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
        points!,
        maxPoints!,
        bestGradeAtPercentage ?? 100,
        preferences!
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
            Achieved Points
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
            placeholder="Points"
          />
        </div>
        <div>
          <Label htmlFor="point_calc_max_points">
            Maximum Points
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
            placeholder="Max Points"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="point_calc_percentage">
          Percentage needed for best grade
        </Label>
        <div className="w-full flex flex-row gap-2 items-center">
          <Input
            value={bestGradeAtPercentage}
            onChange={(e) => {
              if (e.target.value === "") setBestGradeAtPercentage(undefined);
              else setBestGradeAtPercentage(Number(e.target.value));
            }}
            type="number"
            step="5"
            placeholder="Defaults to 100%"
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
          Calculate
        </Button>
        <Button
          onClick={() => setShowPointCalc(false)}
          type="button"
          variant="outline"
        >
          <XIcon className="mr-2 size-4" />
          Close
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
        Point Calculator
      </Button>
    </div>
  );
}
