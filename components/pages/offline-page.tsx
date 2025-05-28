"use client";
import { ConnectionStatusIndicator } from "@/components/connection-status-indicator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useConnectionChecks } from "@/lib/hooks/useConnectionCheck";
import { SiGithub } from "@icons-pack/react-simple-icons";
import {
  CalculatorIcon,
  GlobeIcon,
  RotateCcwIcon,
  SatelliteDish,
} from "lucide-react";
import Link from "next/link";

export const OfflinePage = () => {
  const connectionChecks = useConnectionChecks();
  return (
    <div className="w-screen">
      <div className="w-10/12 m-auto inset-0 flex flex-col items-center justify-center bg-background z-50">
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
              Right Now?
            </h2>
          </div>
          <div className="space-y-3 max-w-xs sm:max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Connection Checks</CardTitle>
                <CardDescription>
                  {connectionChecks.data?.backend
                    ? "Connection to the grade calculator server seems fine."
                    : "Connection to the grade calculator server has failed."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-row gap-3 justify-between items-center">
                  <div className="flex flex-row items-center gap-2">
                    <CalculatorIcon className="size-4 text-muted-foreground" />
                    <span className="">Grade Calculator</span>
                  </div>
                  {!connectionChecks.isFetched ? (
                    <ConnectionStatusIndicator status="loading" />
                  ) : connectionChecks.data?.backend ? (
                    <ConnectionStatusIndicator status="success" />
                  ) : (
                    <ConnectionStatusIndicator status="error" />
                  )}
                </div>
                <div className="flex flex-row gap-3 justify-between items-center">
                  <div className="flex flex-row items-center gap-2">
                    <GlobeIcon className="size-4 text-muted-foreground" />
                    <span>Internet</span>
                  </div>
                  {!connectionChecks.isFetched ? (
                    <ConnectionStatusIndicator status="loading" />
                  ) : connectionChecks.data?.internet ? (
                    <ConnectionStatusIndicator status="success" />
                  ) : (
                    <ConnectionStatusIndicator status="error" />
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex md:flex-row flex-col flex-wrap justify-center gap-3 w-full">
                  <Link href="/">
                    <Button variant="default" className="w-full md:w-fit">
                      <RotateCcwIcon className="mr-2 size-4" /> Retry
                    </Button>
                  </Link>
                  <Link
                    target="_blank"
                    href="https://status.cloud.nstr.dev/status/grades"
                  >
                    <Button
                      className="w-full md:w-fit"
                      data-umami-event="Navigate to Status Page"
                      variant="secondary"
                    >
                      <SatelliteDish className="size-4 mr-2" /> Status Page
                    </Button>
                  </Link>
                  <Link
                    target="_blank"
                    href="https://github.com/nstr-dev/grade-calculator/issues"
                  >
                    <Button
                      className="w-full md:w-fit"
                      data-umami-event="Navigate to GitHub Issues"
                      variant="secondary"
                    >
                      <SiGithub className="size-4 mr-2" />
                      Issues
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
