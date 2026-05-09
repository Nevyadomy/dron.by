import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { LayoutCard } from "@/components/atoms/LayoutCard";
import { FormField } from "@/components/molecules/FormField";
import { useAuth } from "@/contexts/useAuth";
import { loginSchema } from "@/schemas/login.schema";
import { verifyUser } from "@/services/userStorage";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const parsed = loginSchema.safeParse({ email, password });
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
      const user = verifyUser(parsed.data.email, parsed.data.password);
      if (!user) {
        setServerError("Неверный email или пароль");
        return;
      }
      login({ id: user.id, email: user.email, name: user.name });
      navigate("/catalog");
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 24 }}>
      <LayoutCard padded>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          Вход
        </h1>
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 4 }}
        >
          <FormField label="Email" htmlFor="email" error={errors.email}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              hasError={!!errors.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
          <FormField label="Пароль" htmlFor="password" error={errors.password}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              hasError={!!errors.password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
          {serverError && (
            <p style={{ color: "var(--color-destructive)", fontSize: 13 }}>
              {serverError}
            </p>
          )}
          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Вход…" : "Войти"}
          </Button>
        </form>
        <p
          style={{
            marginTop: 16,
            fontSize: 13,
            color: "var(--color-muted-fg)",
          }}
        >
          Нет аккаунта?{" "}
          <Link to="/register" style={{ color: "var(--color-primary)" }}>
            Зарегистрироваться
          </Link>
        </p>
      </LayoutCard>
    </div>
  );
};

export default LoginPage;
