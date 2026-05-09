import { z } from "zod";

export const registrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Имя должно содержать минимум 2 символа")
      .max(50, "Имя не должно превышать 50 символов"),
    email: z
      .string()
      .trim()
      .email("Введите корректный email")
      .max(255, "Email слишком длинный"),
    password: z
      .string()
      .min(6, "Пароль должен быть минимум 6 символов")
      .max(100, "Пароль слишком длинный"),
    confirmPassword: z.string(),
    consent: z.literal(true, {
      message: "Необходимо согласие на обработку данных",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;
