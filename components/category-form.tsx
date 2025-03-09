"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { useCategory } from "@/components/category-provider";
import { usePreferences } from "@/components/preferences-provider";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Category } from "@/db/schema";
import { catchProblem } from "@/lib/problem";
import {
  deleteCategory,
  insertCategory,
  updateCategory,
} from "@/lib/services/category-service";
import { addCategoryToast } from "@/lib/toasts";
import { cn, truncateText } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Asterisk } from "./ui/asterisk";
import { Input } from "./ui/input";

export function CreateCategoryForm({ setOpen }: { setOpen: Function }) {
  const t = useTranslations();
  const categoryState = useCategory();
  const preferences = usePreferences().preferences!;
  const [submitting, setSubmitting] = useState(false);

  type FormValues = {
    category: string;
  };

  const FormSchema = z.object({
    category: z
      .string({
        required_error: t("errors.required"),
      })
      .trim()
      .min(1, { message: t("errors.required") })
      .max(255),
  });

  const defaultValues: DefaultValues<FormValues> = {
    category: "",
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSubmitting(true);
    const category = data.category;
    try {
      let inserted: Category = catchProblem(
        await insertCategory(category, false),
        true
      );

      form.reset(defaultValues);
      form.setFocus("category");
      if (inserted) {
        categoryState.setCategories([...categoryState.categories, inserted]);
        addCategoryToast(category);
        setSubmitting(false);
      }
      if (!preferences.newEntitySheetShouldStayOpen) setOpen(false);
    } catch (e) {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 m-5">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("categories.name-label")} <Asterisk className="ml-1" />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("categories.enter-name-prompt")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          data-umami-event="Create Category"
          data-umami-event-category={form.getValues("category")}
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

export function EditCategoryForm({ setOpen }: { setOpen: Function }) {
  const t = useTranslations();
  const categoryState = useCategory();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selected, setSelected] = useState<Category | undefined>(
    categoryState.category
  );

  async function handleDelete() {
    setSubmitting(true);
    if (!selected) return;
    let deleted: Category = catchProblem(await deleteCategory(selected?.id));
    if (deleted) {
      categoryState.setCategories([
        ...categoryState.categories.filter(
          (category) => category.id !== selected?.id
        ),
      ]);
      setSubmitting(false);
    }
    setOpen(false);
  }

  type FormValues = {
    categoryName: string;
    category: number;
  };

  const FormSchema = z.object({
    category: z.number({
      required_error: t("errors.required"),
    }),
    categoryName: z
      .string({
        required_error: t("errors.required"),
      })
      .trim()
      .min(1, { message: t("errors.required") })
      .max(255),
  });

  const defaultValues: DefaultValues<FormValues> = {
    category: selected?.id!,
    categoryName: selected?.name ?? "",
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryState.category, selected]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.categoryName === selected?.name) {
      setOpen(false);
      return;
    }
    setSubmitting(true);
    const newCategory: Category = {
      ...selected!,
      name: data.categoryName,
    };
    let inserted: Category = catchProblem(await updateCategory(newCategory));
    if (inserted) {
      categoryState.setCategories([
        ...categoryState.categories.filter(
          (category) => category.id !== selected?.id
        ),
        inserted,
      ]);
      setSubmitting(false);
    }
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 m-5">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                {t("categories.to-change-label")} <Asterisk className="ml-1" />
              </FormLabel>
              <Popover open={selectorOpen} onOpenChange={setSelectorOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {loading && (
                        <div className="flex flex-row gap-2 items-center">
                          <LoadingSpinner />
                          {t("generic.loading")}
                        </div>
                      )}
                      {field.value
                        ? truncateText(
                            categoryState.categories.find(
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
                        {categoryState.categories.length === 0 ? (
                          <CommandItem disabled>
                            {t("errors.no-categories")}
                          </CommandItem>
                        ) : (
                          categoryState.categories.map((category) => (
                            <CommandItem
                              value={category.name!}
                              key={category.id}
                              onSelect={() => {
                                setSelected(category);
                                form.setValue("category", category.id!);
                                setSelectorOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  category.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {truncateText(category.name!, 35).text}
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
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("categories.name-label")} <Asterisk className="ml-1" />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("categories.enter-name-prompt")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <Button
            data-umami-event="Edit Category"
            data-umami-event-category={form.getValues("categoryName")}
            className="w-full"
            type="submit"
            disabled={submitting}
          >
            {submitting ? <LoadingSpinner /> : t("actions.submit")}
          </Button>

          <Button
            className="w-full"
            variant="destructive"
            disabled={
              categoryState.categories.length <= 1 ||
              submitting ||
              categoryState.category?.id === selected?.id
            }
            onClick={handleDelete}
          >
            {submitting ? <LoadingSpinner /> : t("categories.delete")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
