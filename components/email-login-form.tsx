import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function EmailLoginForm() {
  const [submitting, setSubmitting] = useState(false);
  const t = useTranslations();

  type FormValues = {
    email: string;
  };

  const FormSchema = z.object({
    email: z
      .string({
        required_error: t("errors.invalid-email-prompt"),
      })
      .email({ message: t("errors.invalid-email-prompt") })
      .trim()
      .min(1, { message: t("errors.invalid-email-prompt") })
      .max(255),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSubmitting(true);
    const email = data.email;
    if (email) signIn("email", { email });
  }

  return (
    <>
      <CardDescription>{t("auth.magic-link")}</CardDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={t("auth.enter-email")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            data-umami-event="Sign In"
            data-umami-event-provider="E-Mail"
            className="w-full"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <LoadingSpinner />
            ) : (
              <>
                <Mail className="m-2 size-4" /> {t("auth.request-link")}
              </>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
