import { z } from "zod";
import i18n from "@/i18n";

const t = (key: string) => {
  const translations: Record<string, Record<string, string>> = {
    ru: {
      "login.emailInvalid": "Введите корректный email",
      "login.passwordRequired": "Введите пароль",
    },
    be: {
      "login.emailInvalid": "Увядзіце карэктны email",
      "login.passwordRequired": "Увядзіце пароль",
    },
    en: {
      "login.emailInvalid": "Enter a valid email",
      "login.passwordRequired": "Enter your password",
    },
    pl: {
      "login.emailInvalid": "Wprowadź poprawny email",
      "login.passwordRequired": "Wprowadź hasło",
    },
  };
  const lang = i18n.language as keyof typeof translations;
  return translations[lang]?.[key] ?? translations.ru[key];
};

export const loginSchema = z.object({
  email: z.string().trim().email(t("login.emailInvalid")),
  password: z.string().min(1, t("login.passwordRequired")),
});

export type LoginInput = z.infer<typeof loginSchema>;
