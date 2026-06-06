import i18n from "@/i18n";

export interface StoredUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

const USERS_KEY = "registered_users";

const t = (key: string) => {
  const translations: Record<string, Record<string, string>> = {
    ru: {
      "user.emailExists": "Пользователь с таким email уже зарегистрирован",
    },
    be: { "user.emailExists": "Карыстальнік з такім email ужо зарэгістраваны" },
    en: { "user.emailExists": "A user with this email is already registered" },
    pl: {
      "user.emailExists":
        "Użytkownik z tym adresem email jest już zarejestrowany",
    },
  };
  const lang = i18n.language as keyof typeof translations;
  return translations[lang]?.[key] ?? translations.ru[key];
};

function readAll(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeAll(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const target = email.trim().toLowerCase();
  return readAll().find((u) => u.email.toLowerCase() === target);
}

export function verifyUser(email: string, password: string): StoredUser | null {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) return null;
  return user;
}

export function registerUser(input: Omit<StoredUser, "id">): StoredUser {
  const users = readAll();
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error(t("user.emailExists"));
  }
  const user: StoredUser = { ...input, id: Date.now() };
  users.push(user);
  writeAll(users);
  return user;
}
