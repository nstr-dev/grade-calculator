"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronsUpDown,
  MessageCircleQuestion,
  Wrench,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LanguageSelection } from "@/components/language-selection";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
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
import { cn } from "@/lib/utils";
import { PreferenceTemplate, templates } from "@/templates";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

const preferenceTemplates: PreferenceTemplate[] = templates;

export function TemplateSelector({
  setSelectedTemplate,
}: {
  setSelectedTemplate: (template: string) => void;
}) {
  const t = useTranslations();

  const FormSchema = z.object({
    preferenceTemplate: z.string({
      required_error: t("errors.select-template"),
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [open, setOpen] = useState(false);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setSelectedTemplate(data.preferenceTemplate);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormItem className="flex flex-col">
          <FormLabel>{t("generic.language")}</FormLabel>
          <LanguageSelection autoRefresh />
        </FormItem>

        <FormField
          control={form.control}
          name="preferenceTemplate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("onboarding.templates.title")}</FormLabel>
              <FormDescription>
                {t("onboarding.templates.description")}
              </FormDescription>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        <span className="flex gap-2 items-center">
                          <span className="text-muted-foreground flex items-center">
                            {
                              preferenceTemplates.find(
                                (template) => template.id === field.value
                              )?.icon
                            }
                          </span>

                          <span>
                            {
                              preferenceTemplates.find(
                                (template) => template.id === field.value
                              )?.title
                            }
                          </span>
                        </span>
                      ) : (
                        t("onboarding.templates.select-prompt")
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder={t("filters.filter-by-template")}
                    />
                    <CommandEmpty>{t("errors.no-template")}</CommandEmpty>
                    <ScrollArea className="h-fit max-h-[30vh] overflow-auto">
                      <CommandGroup>
                        {preferenceTemplates.map((template) => (
                          <CommandItem
                            value={template.title}
                            key={template.id}
                            onSelect={() => {
                              form.setValue("preferenceTemplate", template.id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                template.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <span className="flex gap-2 items-center">
                              <span className="text-muted-foreground flex items-center justify-center">
                                {template.icon}
                              </span>
                              <span>{template.title}</span>
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </ScrollArea>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col justify-between md:flex-row gap-2">
          <Button
            data-umami-event="Apply Template"
            data-umami-event-template={form.getValues().preferenceTemplate}
            variant={"secondary"}
            type="submit"
          >
            <Wrench className="size-4 text-muted-foreground mr-2" />
            {t("onboarding.templates.apply")}
          </Button>
          <Link
            target="_blank"
            href="https://github.com/nstr-dev/grade-calculator/issues/new/choose"
          >
            <Button
              data-umami-event="Request template"
              variant={"outline"}
              type="button"
              className="w-full"
            >
              <MessageCircleQuestion className="size-4 text-muted-foreground mr-2" />
              {t("onboarding.templates.request")}
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
