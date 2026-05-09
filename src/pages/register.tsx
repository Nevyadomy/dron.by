import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { LayoutCard } from "@/components/atoms/LayoutCard";
import { FormField } from "@/components/molecules/FormField";
import { useAuth } from "@/contexts/useAuth";
import { registrationSchema } from "@/schemas/registration.schema";
import { registerUser } from "@/services/userStorage";

const FORMSPREE_ID = "xaqvnkzz";
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;
const DRAFT_KEY = "register_form_draft";
type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  consent: boolean;
};
const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  consent: false,
};
function readDraft(): FormState {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return EMPTY_FORM;
    return { ...EMPTY_FORM, ...(JSON.parse(raw) as Partial<FormState>) };
  } catch {
    return EMPTY_FORM;
  }
}

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(() => readDraft());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form]);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const parsed = registrationSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[String(i.path[0])] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const user = registerUser({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (FORMSPREE_ID) {
        try {
          await fetch(FORMSPREE_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              name: parsed.data.name,
              email: parsed.data.email,
            }),
          });
        } catch {
          /* failure */
        }
      }

      localStorage.removeItem(DRAFT_KEY);
      login({ id: user.id, email: user.email, name: user.name });
      setDone(true);
      setTimeout(() => navigate("/catalog"), 800);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Не удалось зарегистрироваться",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "48px auto", padding: 24 }}>
      <LayoutCard padded>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          Регистрация
        </h1>

        {done ? (
          <p style={{ color: "var(--color-success)" }}>
            Готово! Перенаправляем…
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <FormField label="Имя" htmlFor="name" error={errors.name}>
              <Input
                id="name"
                value={form.name}
                hasError={!!errors.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </FormField>
            <FormField label="Email" htmlFor="email" error={errors.email}>
              <Input
                id="email"
                type="email"
                value={form.email}
                hasError={!!errors.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </FormField>
            <FormField
              label="Пароль"
              htmlFor="password"
              error={errors.password}
            >
              <Input
                id="password"
                type="password"
                value={form.password}
                hasError={!!errors.password}
                onChange={(e) => update("password", e.target.value)}
              />
            </FormField>
            <FormField
              label="Повторите пароль"
              htmlFor="confirmPassword"
              error={errors.confirmPassword}
            >
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                hasError={!!errors.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
              />
            </FormField>

            <label
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                fontSize: 13,
                color: "var(--color-muted-fg)",
                margin: "8px 0",
              }}
            >
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => update("consent", e.target.checked)}
                style={{ marginTop: 2 }}
              />
              <span>
                Я согласен(на) с{" "}
                <a
                  href="https://center.gov.by/upload/pdf/politika_personal_data_2024.pdf"
                  style={{ color: "var(--color-primary)" }}
                >
                  обработкой персональных данных.
                </a>
              </span>
            </label>
            {errors.consent && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--color-destructive)",
                  marginBottom: 8,
                }}
              >
                {errors.consent}
              </p>
            )}

            {serverError && (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-destructive)",
                  marginBottom: 8,
                }}
              >
                {serverError}
              </p>
            )}

            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? "Отправка" : "Зарегистрироваться"}
            </Button>
          </form>
        )}

        <p
          style={{
            marginTop: 16,
            fontSize: 13,
            color: "var(--color-muted-fg)",
          }}
        >
          Уже есть аккаунт?{" "}
          <Link to="/login" style={{ color: "var(--color-primary)" }}>
            Войти
          </Link>
        </p>
      </LayoutCard>
    </div>
  );
};

export default RegisterPage;
