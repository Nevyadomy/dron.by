import { z } from "zod";
import i18n from "@/i18n";

const t = (key: string) => {
  const translations: Record<string, Record<string, string>> = {
    ru: {
      "register.nameMin": "Имя должно содержать минимум 2 символа",
      "register.nameMax": "Имя не должно превышать 50 символов",
      "register.emailInvalid": "Введите корректный email",
      "register.emailMax": "Email слишком длинный",
      "register.passwordMin": "Пароль должен быть минимум 6 символов",
      "register.passwordMax": "Пароль слишком длинный",
      "register.consentRequired": "Необходимо согласие на обработку данных",
      "register.passwordMismatch": "Пароли не совпадают",
    },
    be: {
      "register.nameMin": "Імя павінна ўтрымліваць мінімум 2 сімвалы",
      "register.nameMax": "Імя не павінна перавышаць 50 сімвалаў",
      "register.emailInvalid": "Увядзіце карэктны email",
      "register.emailMax": "Email занадта доўгі",
      "register.passwordMin": "Пароль павінен быць мінімум 6 сімвалаў",
      "register.passwordMax": "Пароль занадта доўгі",
      "register.consentRequired": "Неабходна згода на апрацоўку даных",
      "register.passwordMismatch": "Паролі не супадаюць",
    },
    en: {
      "register.nameMin": "Name must contain at least 2 characters",
      "register.nameMax": "Name must not exceed 50 characters",
      "register.emailInvalid": "Enter a valid email",
      "register.emailMax": "Email is too long",
      "register.passwordMin": "Password must be at least 6 characters",
      "register.passwordMax": "Password is too long",
      "register.consentRequired": "Consent to data processing is required",
      "register.passwordMismatch": "Passwords do not match",
    },
    pl: {
      "register.nameMin": "Imię musi zawierać co najmniej 2 znaki",
      "register.nameMax": "Imię nie może przekraczać 50 znaków",
      "register.emailInvalid": "Wprowadź poprawny email",
      "register.emailMax": "Email jest za długi",
      "register.passwordMin": "Hasło musi mieć co najmniej 6 znaków",
      "register.passwordMax": "Hasło jest za długie",
      "register.consentRequired": "Wymagana zgoda na przetwarzanie danych",
      "register.passwordMismatch": "Hasła nie są zgodne",
    },
  };
  const lang = i18n.language as keyof typeof translations;
  return translations[lang]?.[key] ?? translations.ru[key];
};

export const registrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, t("register.nameMin"))
      .max(50, t("register.nameMax")),
    email: z
      .string()
      .trim()
      .email(t("register.emailInvalid"))
      .max(255, t("register.emailMax")),
    password: z
      .string()
      .min(6, t("register.passwordMin"))
      .max(100, t("register.passwordMax")),
    confirmPassword: z.string(),
    consent: z.literal(true, {
      message: t("register.consentRequired"),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: t("register.passwordMismatch"),
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;
