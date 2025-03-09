"use client";
import { AverageOverview } from "@/components/cards/average-overview";
import { GradeOverview } from "@/components/cards/grade-overview";
import { RequiredGrades } from "@/components/cards/required-grades";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardStack, Highlight } from "@/components/ui/card-stack";
import { CardBoard } from "@/components/ui/cardboard";
import { Separator } from "@/components/ui/separator";
import { Tabs } from "@/components/ui/tabs";
import { useDevice } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { MOCKDATA } from "@/mockdata-export";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { motion } from "framer-motion";
import {
  CalculatorIcon,
  ExternalLinkIcon,
  Globe,
  GroupIcon,
  Info,
  LineChartIcon,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isMobile } = useDevice();
  const t = useTranslations();

  const PAGE_TABS = [
    {
      title: (
        <div className="flex flex-row items-center gap-2">
          <Sparkles className="size-4" />
          {t("landing-page.tabs.getting-started")}
        </div>
      ),
      value: "start",
      content: <GettingStartedTab />,
    },
    {
      title: (
        <div className="flex flex-row items-center gap-2">
          <Info className="size-4" />
          {t("landing-page.tabs.learn-more")}
        </div>
      ),
      value: "about",
      content: (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t("landing-page.about.title")}</CardTitle>
            <CardDescription>
              {t("landing-page.about.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="hidden lg:flex flex-col">
              <CardBoard>
                <CardBoard row>
                  <CardBoard>
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle>
                          {t("landing-page.about.description-label")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="gap-5 flex flex-col">
                        <p>
                          {t.rich("landing-page.about.short-description", {
                            green: (text) => (
                              <Highlight colorName="green">{text}</Highlight>
                            ),
                            red: (text) => (
                              <Highlight colorName="red">{text}</Highlight>
                            ),
                          })}
                        </p>
                        <p>
                          {t.rich("landing-page.about.credit-description", {
                            shadcn: (text) => (
                              <Highlight colorName="blue">
                                <a target="_blank" href="https://ui.shadcn.com">
                                  {text}
                                </a>
                              </Highlight>
                            ),
                            aceternity: (text) => (
                              <Highlight colorName="blue">
                                <a
                                  target="_blank"
                                  href="https://ui.aceternity.com/components"
                                >
                                  {text}
                                </a>
                              </Highlight>
                            ),
                          })}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-xl">
                      <CardHeader>
                        <CardTitle>
                          {t("landing-page.getting-started-about.title")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-5">
                        <p>
                          {t.rich(
                            "landing-page.getting-started-about.cloud-desc",
                            {
                              yellow: (text) => (
                                <Highlight colorName="yellow">{text}</Highlight>
                              ),
                            }
                          )}
                        </p>
                        <p>
                          {t.rich(
                            "landing-page.getting-started-about.cloud-desc-link",
                            {
                              link: (text) => (
                                <Highlight colorName="blue">
                                  <a
                                    target="_blank"
                                    href="https://legacy.grades.nstr.dev"
                                  >
                                    {text}
                                  </a>
                                </Highlight>
                              ),
                            }
                          )}
                          <div className="flex justify-center gap-5 mt-5 xl:flex-row flex-col">
                            <Button className="w-full shadow-md" asChild>
                              <Link href={"/login"}>
                                <Sparkles className="size-4 mr-2 flex-shrink-0" />
                                {isMobile
                                  ? t(
                                      "landing-page.getting-started-about.to-the-app-short"
                                    )
                                  : t(
                                      "landing-page.getting-started-about.to-the-app-long"
                                    )}
                              </Link>
                            </Button>
                            <Button
                              data-umami-event="Navigate to Legacy Version"
                              className="w-full shadow-md"
                              variant={"secondary"}
                              asChild
                            >
                              <Link href={"https://legacy.grades.nstr.dev"}>
                                <Globe className="size-4 mr-2 flex-shrink-0" />
                                {isMobile
                                  ? t(
                                      "landing-page.getting-started-about.to-legacy-short"
                                    )
                                  : t(
                                      "landing-page.getting-started-about.to-legacy-long"
                                    )}
                              </Link>
                            </Button>
                          </div>
                        </p>
                      </CardContent>
                    </Card>
                  </CardBoard>
                  <CardBoard>
                    <CardStack items={REVIEW_CARDS} offset={7} />
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle>
                          {t("landing-page.about.source-code-label")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="gap-5 flex flex-col">
                        <p>{t("landing-page.about.source-code-description")}</p>
                        <Button
                          data-umami-event="Navigate to GitHub"
                          variant={"secondary"}
                          className="shadow-lg"
                          asChild
                        >
                          <Link
                            href={
                              "https://github.com/noahstreller/grade-calculator"
                            }
                          >
                            <SiGithub className="size-4 m-2" />
                            {t("landing-page.about.source-code-link")}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </CardBoard>
                </CardBoard>
              </CardBoard>
            </div>
            <div className="flex flex-col gap-10 w-full self-center m-auto">
              <div className="flex lg:hidden flex-col">
                <CardBoard>
                  <Card className="shadow-xl">
                    <CardHeader>
                      <CardTitle>
                        {t("landing-page.getting-started-about.title")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                      <p>
                        {t.rich(
                          "landing-page.getting-started-about.cloud-desc",
                          {
                            yellow: (text) => (
                              <Highlight colorName="yellow">{text}</Highlight>
                            ),
                          }
                        )}
                      </p>
                      <p>
                        {t.rich(
                          "landing-page.getting-started-about.cloud-desc-link",
                          {
                            link: (text) => (
                              <Highlight colorName="blue">
                                <a
                                  target="_blank"
                                  href="https://legacy.grades.nstr.dev"
                                >
                                  {text}
                                </a>
                              </Highlight>
                            ),
                          }
                        )}
                        <div className="flex justify-center gap-5 mt-5 xl:flex-row flex-col">
                          <Button className="w-full shadow-md" asChild>
                            <Link href={"/login"}>
                              <Sparkles className="size-4 mr-2 flex-shrink-0" />
                              {isMobile
                                ? t(
                                    "landing-page.getting-started-about.to-the-app-short"
                                  )
                                : t(
                                    "landing-page.getting-started-about.to-the-app-long"
                                  )}
                            </Link>
                          </Button>
                          <Button
                            data-umami-event="Navigate to Legacy Version"
                            className="w-full shadow-md"
                            variant={"secondary"}
                            asChild
                          >
                            <Link href={"https://legacy.grades.nstr.dev"}>
                              <Globe className="size-4 mr-2 flex-shrink-0" />
                              {isMobile
                                ? t(
                                    "landing-page.getting-started-about.to-legacy-short"
                                  )
                                : t(
                                    "landing-page.getting-started-about.to-legacy-long"
                                  )}
                            </Link>
                          </Button>
                        </div>
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>{t("landing-page.about.title")}</CardTitle>
                    </CardHeader>
                    <CardContent className="gap-5 flex flex-col">
                      <p>
                        {t.rich("landing-page.about.short-description", {
                          green: (text) => (
                            <Highlight colorName="green">{text}</Highlight>
                          ),
                          red: (text) => (
                            <Highlight colorName="red">{text}</Highlight>
                          ),
                        })}
                      </p>
                      <p>
                        {t.rich("landing-page.about.credit-description", {
                          shadcn: (text) => (
                            <Highlight colorName="blue">
                              <a target="_blank" href="https://ui.shadcn.com">
                                {text}
                              </a>
                            </Highlight>
                          ),
                          aceternity: (text) => (
                            <Highlight colorName="blue">
                              <a
                                target="_blank"
                                href="https://ui.aceternity.com/components"
                              >
                                {text}
                              </a>
                            </Highlight>
                          ),
                        })}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-md mb-5">
                    <CardHeader>
                      <CardTitle>
                        {t("landing-page.about.source-code-label")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="gap-5 flex flex-col">
                      <p>{t("landing-page.about.source-code-description")}</p>
                      <Button
                        data-umami-event="Navigate to GitHub"
                        variant={"secondary"}
                        className="shadow-lg"
                        asChild
                      >
                        <Link
                          href={
                            "https://github.com/noahstreller/grade-calculator"
                          }
                        >
                          <SiGithub className="size-4 m-2" />
                          {t("landing-page.about.source-code-link")}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <CardStack items={REVIEW_CARDS} offset={7} />
                </CardBoard>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];
  return (
    <div className="w-full h-fit">
      <div className="[perspective:1000px] h-full relative b flex flex-col mx-auto w-11/12">
        <Tabs tabs={PAGE_TABS} />
      </div>
    </div>
  );
}

const REVIEW_CARDS = [
  {
    id: 0,
    name: "Noah",
    designation: "Project Creator",
    content: (
      <div className="flex flex-col gap-3">
        <CardTitle>Real review</CardTitle>
        <Separator />
        <p>
          It sure is{" "}
          <Highlight colorName="yellow">one of the grade calculators</Highlight>{" "}
          of all times.
        </p>
      </div>
    ),
  },
  {
    id: 1,
    name: "Noah",
    designation: "User",
    content: (
      <div className="flex flex-col gap-3">
        <CardTitle>Real review</CardTitle>
        <Separator />
        <p>There is no way to review this bruh</p>
      </div>
    ),
  },
  {
    id: 2,
    name: "Noah",
    designation: "Tester",
    content: (
      <div className="flex flex-col gap-3">
        <CardTitle>Real review</CardTitle>
        <Separator />
        <p>Sorry, nobody has reviewed yet, so this will have to do.</p>
      </div>
    ),
  },
  {
    id: 3,
    name: "Noah",
    designation: "Lead Developer",
    content: (
      <div className="flex flex-col gap-3">
        <CardTitle>Real review</CardTitle>
        <Separator />
        <p>
          Believe it or not, this calculator also doubles as a{" "}
          <Highlight colorName="yellow">weather forecaster</Highlight>.
          Predicted rain on my exam day, and it poured.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    name: "Noah",
    designation: "Project Manager",
    content: (
      <div className="flex flex-col gap-3">
        <CardTitle>Real review</CardTitle>
        <Separator />
        <p>
          After using this grade calculator, I achieved{" "}
          <Highlight colorName="yellow">instant enlightenment</Highlight>. Now
          pondering the mysteries of the universe instead of my homework.
        </p>
      </div>
    ),
  },
];

function GettingStartedTab() {
  const { isMobile } = useDevice();
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations();
  return (
    <CardBoard row={!isMobile}>
      <CardBoard>
        <Card>
          <CardHeader>
            <CardTitle>{t("landing-page.getting-started-tab.title")}</CardTitle>
            <CardDescription>
              {t("landing-page.getting-started-tab.description")}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            <p>
              {t.rich("landing-page.getting-started-about.cloud-desc", {
                yellow: (text) => (
                  <Highlight colorName="yellow">{text}</Highlight>
                ),
              })}
            </p>
            <p>
              {t.rich("landing-page.getting-started-about.cloud-desc-link", {
                link: (text) => (
                  <Highlight colorName="blue">
                    <a target="_blank" href="https://legacy.grades.nstr.dev">
                      {text}
                    </a>
                  </Highlight>
                ),
              })}
              <div className="flex justify-center gap-5 mt-5 xl:flex-row flex-col">
                <Button className="w-full shadow-md" asChild>
                  <Link href={"/login"}>
                    <Sparkles className="size-4 mr-2 flex-shrink-0" />
                    {isMobile
                      ? t("landing-page.getting-started-about.to-the-app-short")
                      : t("landing-page.getting-started-about.to-the-app-long")}
                  </Link>
                </Button>
                <Button
                  data-umami-event="Navigate to Legacy Version"
                  className="w-full shadow-md"
                  variant={"secondary"}
                  asChild
                >
                  <Link href={"https://legacy.grades.nstr.dev"}>
                    <Globe className="size-4 mr-2 flex-shrink-0" />
                    {isMobile
                      ? t("landing-page.getting-started-about.to-legacy-short")
                      : t("landing-page.getting-started-about.to-legacy-long")}
                  </Link>
                </Button>
              </div>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("landing-page.screenshot-title")}</CardTitle>
            <CardDescription>
              {t("landing-page.screenshot-desc")}
            </CardDescription>
            <CardContent className="flex flex-col gap-4 p-3">
              {theme.resolvedTheme === "dark" ? (
                <>
                  <Image
                    src={"/screenshot-dark.png"}
                    alt={t("landing-page.screenshot-dark-mode")}
                    className="w-full border-2 border-muted rounded-md"
                    width="2213"
                    height="1941"
                  />
                  <Link
                    href={"/screenshot-dark.png"}
                    target="_blank"
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "flex flex-row gap-2 w-fit justify-center"
                    )}
                  >
                    {t("landing-page.open-image")}
                    <ExternalLinkIcon className="size-4" />
                  </Link>
                </>
              ) : (
                <>
                  <Image
                    src={"/screenshot-light.png"}
                    alt={t("landing-page.screenshot-light-mode")}
                    className="w-full border-2 border-muted rounded-md"
                    width="2213"
                    height="1941"
                  />
                  <Link
                    href={"/screenshot-light.png"}
                    target="_blank"
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "flex flex-row gap-2 w-fit justify-center"
                    )}
                  >
                    {t("landing-page.open-image")}
                    <ExternalLinkIcon className="size-4" />
                  </Link>
                </>
              )}
            </CardContent>
          </CardHeader>
        </Card>
      </CardBoard>
      <Demos />
    </CardBoard>
  );
}

type DemoType = {
  title: ReactNode;
  value: string;
};

const Demos = () => {
  const t = useTranslations();
  const demos: DemoType[] = [
    {
      title: (
        <span className="flex flex-row gap-2 justify-center items-center">
          <LineChartIcon className="size-4 text-muted-foreground" />
          {t("landing-page.demo-card.demo-grades")}
        </span>
      ),
      value: "grade-overview",
    },
    {
      title: (
        <span className="flex flex-row gap-2 justify-center items-center">
          <GroupIcon className="size-4 text-muted-foreground" />
          {t("landing-page.demo-card.demo-averages")}
        </span>
      ),
      value: "average-overview",
    },
    {
      title: (
        <span className="flex flex-row gap-2 justify-center items-center">
          <CalculatorIcon className="size-4 text-muted-foreground" />
          {t("landing-page.demo-card.demo-calculator")}
        </span>
      ),
      value: "required-grades",
    },
  ];

  const [selected, setSelected] = useState<string>("grade-overview");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("landing-page.demo-card.title")}</CardTitle>
        <CardDescription>
          {t("landing-page.demo-card.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <DemoSwitcher
          demos={demos}
          selected={selected}
          setSelected={setSelected}
        />
        <motion.div layout>
          {selected === "required-grades" && (
            <RequiredGrades
              className="select-none"
              averageData={MOCKDATA.averageData}
              showPassingGrades
            />
          )}
          {selected === "grade-overview" && (
            <GradeOverview
              className="select-none"
              data={MOCKDATA.data}
              failingData={MOCKDATA.failingData(MOCKDATA.averageData)}
              passingData={MOCKDATA.passingData(MOCKDATA.averageData)}
              animate={false}
            />
          )}
          {selected === "average-overview" && (
            <AverageOverview
              className="select-none"
              data={MOCKDATA.data}
              averageData={MOCKDATA.averageData}
              animate={false}
            />
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

const DemoSwitcher = ({
  demos,
  selected,
  setSelected,
}: {
  demos: DemoType[];
  selected: string;
  setSelected: Function;
}) => {
  const { isMobile } = useDevice();

  if (isMobile)
    return (
      <div className="flex flex-row items-center justify-center [perspective:1000px]">
        <div className="relative overflow-hidden no-visible-scrollbar max-w-full w-fit bg-transparent">
          {demos.map((demo) => (
            <button
              key={demo.value}
              onClick={() => {
                setSelected(demo.value);
              }}
              className={"mx-1 my-1 px-4 py-1.5 rounded-full bg-muted/[0.3]"}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {selected === demo.value && (
                <motion.div
                  layoutId="clickedbutton-demos"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  className={"absolute inset-0 bg-muted rounded-full "}
                />
              )}

              <span className="relative block text-foreground">
                {demo.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <div className="flex flex-row items-center justify-center [perspective:1000px]">
      <div className="relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-fit border-muted border-2 rounded-full p-1.5 shadow-md">
        {demos.map((demo) => (
          <button
            key={demo.value}
            onClick={() => {
              setSelected(demo.value);
            }}
            className={"px-4 py-1.5 rounded-full"}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {selected === demo.value && (
              <motion.div
                layoutId="clickedbutton-demos"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={"absolute inset-0 bg-muted shadow-lg rounded-full "}
              />
            )}

            <span className="relative block text-foreground">{demo.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
