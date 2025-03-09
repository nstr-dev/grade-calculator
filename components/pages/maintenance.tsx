import { Button } from "@/components/ui/button";
import { getDateOrDateTimeLong } from "@/lib/utils";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { CookieIcon, Globe, SatelliteDish } from "lucide-react";
import Link from "next/link";

export const Maintenance = ({
  maintenance,
}: {
  maintenance?: MaintenanceType;
}) => {
  return (
    <div className="w-screen">
      <div className="w-10/12 m-auto fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
        <div className="items-center gap-6 xs:gap-12 sm:gap-24 flex flex-col">
          <div className="items-start gap-4 flex flex-col">
            <h2 className="text-4xl font-bold tracking-tight text-muted-foreground sm:text-6xl">
              No
            </h2>
            <h1 className="text-6xl font-bold tracking-tight text-white-900 sm:text-8xl">
              Grade
              <br />
              Calculator
            </h1>
            <h2 className="text-4xl font-bold tracking-tight text-muted-foreground sm:text-6xl">
              Today
            </h2>
          </div>
          <div className="text-sm sm:text-lg text-muted-foreground space-y-3 font-mono max-w-xs sm:max-w-md">
            <p>
              {maintenance?.message ??
                "Fixing some bugs, we will be back soon!"}
            </p>
            <p>
              This might take a moment. Here is a cookie for now
              <CookieIcon className="size-4 inline ml-2" />
            </p>
            {maintenance?.until && (
              <p>
                Please check back:{" "}
                <span className="text-foreground">
                  {getDateOrDateTimeLong(maintenance.until)}
                </span>
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Link target="_blank" href="https://legacy.grades.nstr.dev">
              <Button
                data-umami-event="Navigate to Legacy Version"
                variant="default"
              >
                <Globe className="mr-2 size-4" /> Legacy
              </Button>
            </Link>
            <Link
              target="_blank"
              href="https://status.cloud.nstr.dev/status/grades"
            >
              <Button
                data-umami-event="Navigate to Status Page"
                variant="secondary"
              >
                <SatelliteDish className="size-4 mr-2" /> Status Page
              </Button>
            </Link>
            <Link
              target="_blank"
              href="https://github.com/noahstreller/grade-calculator"
            >
              <Button data-umami-event="Navigate to GitHub" variant="secondary">
                <SiGithub className="size-4 mr-2" />
                Source Code
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export type MaintenanceType = {
  maintenance: boolean;
  until?: Date;
  message?: string;
};
