"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCategory } from "@/components/category-provider";
import { usePreferences } from "@/components/preferences-provider";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { NewGrade, Subject } from "@/db/schema";
import { catchProblem } from "@/lib/problem";
import { addGrade } from "@/lib/services/grade-service";
import { getAllSubjects } from "@/lib/services/subject-service";
import { addGradeToast } from "@/lib/toasts";
import {
  cn,
  getDateOrDateTimeLong,
  getDefaultPreferences,
  truncateText,
} from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Asterisk } from "./ui/asterisk";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export function CreateGradeForm({
  refresh,
  setDrawerOpen,
}: {
  refresh: Function;
  setDrawerOpen: Function;
}) {
  const t = useTranslations();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const categoryState = useCategory();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const maxLengthDescription = 255;

  const preferences = usePreferences().preferences;
  const defaultPreferences = getDefaultPreferences();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = catchProblem(
          await getAllSubjects(categoryState.category?.id)
        );
        setSubjects([...data]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryState.category]);

  const FormSchema = z.object({
    subject: z.number({
      required_error: t("errors.required"),
    }),
    grade: z
      .number({
        invalid_type_error: t("errors.invalid-type.number"),
        required_error: t("errors.required"),
      })
      .gte(preferences?.minimumGrade ?? defaultPreferences.minimumGrade!)
      .lte(preferences?.maximumGrade ?? defaultPreferences.maximumGrade!),
    weight: z
      .number({
        invalid_type_error: t("errors.invalid-type.number"),
      })
      .gte(0)
      .optional(),
    date: z.date().optional(),
    description: z.string().trim().max(maxLengthDescription).optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSubmitting(true);
    const grade: NewGrade = {
      date: data.date,
      weight: data.weight,
      value: data.grade,
      subject_fk: data.subject,
      description: data.description,
      category_fk: categoryState.category?.id,
    };

    let newGradeId = catchProblem(await addGrade(grade));
    if (newGradeId) {
      setSubmitting(false);
      addGradeToast(
        grade,
        subjects.find((subject) => subject.id === data.subject)?.name ?? ""
      );
    }
    refresh();
    if (!preferences?.newEntitySheetShouldStayOpen) setDrawerOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 m-5">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                {t("subjects.subject")}
                <Asterisk className="ml-1" />
              </FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger disabled asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={loading}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {loading && (
                        <div className="flex flex-row gap-2 items-center">
                          <LoadingSpinner />
                          Loading...
                        </div>
                      )}
                      {field.value
                        ? truncateText(
                            subjects.find(
                              (subject) => subject.id === field.value
                            )?.name ?? "",
                            35
                          ).text
                        : loading
                        ? null
                        : t("subjects.select-subject")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder={t("subjects.search")} />
                    <ScrollArea className="h-fit max-h-[50vh] overflow-auto">
                      <CommandGroup>
                        {subjects.length === 0 ? (
                          <CommandItem disabled>
                            {t("subjects.notfound")}
                          </CommandItem>
                        ) : (
                          subjects.map((subject) => (
                            <CommandItem
                              value={subject.name!}
                              key={subject.id}
                              onSelect={() => {
                                form.setValue("subject", subject.id!);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  subject.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {truncateText(subject.name!, 35).text}
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </ScrollArea>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("grades.grade")}
                <Asterisk className="ml-1" />
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder={t("grades.add-placeholder")}
                  {...field}
                  onChange={(e) => {
                    if (e.target.value === "") field.onChange("");
                    else field.onChange(Number(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-2">
                <FormLabel>{t("grades.description")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("grades.description-prompt")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <span className="text-sm text-right mr-2 text-muted-foreground">
                  {field.value?.length ?? 0} / {maxLengthDescription}
                </span>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("grades.weight")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder={t("grades.weight-placeholder")}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("grades.date")}</FormLabel>
              <br />
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {date ? (
                        getDateOrDateTimeLong(date)
                      ) : (
                        <span>{t("grades.date-prompt")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      {...field}
                      mode="single"
                      selected={date}
                      onSelect={(value) => {
                        setDate(value);
                        field.onChange(value);
                      }}
                    />
                    <div className="p-3 border-t border-border">
                      <TimePicker
                        {...field}
                        setDate={(value) => {
                          setDate(value);
                          field.onChange(value);
                        }}
                        date={date}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          data-umami-event="Create Grade"
          className="w-full"
          type="submit"
          disabled={submitting}
        >
          {submitting ? <LoadingSpinner /> : t("actions.submit")}
        </Button>
      </form>
    </Form>
  );
}
