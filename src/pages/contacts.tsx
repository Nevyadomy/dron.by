import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Youtube,
} from "lucide-react";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { LayoutCard } from "@/components/atoms/LayoutCard";

const ContactsPage = () => (
  <div className="page-container">
    <h1 style={{ fontSize: 24, fontWeight: 700 }}>Контакты</h1>
    <Breadcrumbs
      items={[{ label: "Главная", to: "/" }, { label: "Контакты" }]}
    />

    <div className="collapse-md">
      <LayoutCard padded>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Наш офис
        </h2>
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 14,
          }}
        >
          <li style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <MapPin
              size={18}
              color="var(--color-primary)"
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <span>
              г. Минск, ул. Притыцкого, 79, офис 17 (БЦ «Фаренгейт», 3-й этаж)
            </span>
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Phone
              size={18}
              color="var(--color-primary)"
              style={{ flexShrink: 0 }}
            />
            <a href="tel:+375290000000" style={{ color: "var(--color-fg)" }}>
              +375 (25) 788-10-55
            </a>
            <span style={{ color: "var(--color-muted-fg)" }}>
              · отдел продаж
            </span>
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Phone
              size={18}
              color="var(--color-primary)"
              style={{ flexShrink: 0 }}
            />
            <a href="tel:+375290000001" style={{ color: "var(--color-fg)" }}>
              +375 (44) 732-55-52
            </a>
            <span style={{ color: "var(--color-muted-fg)" }}>
              · сервисный центр
            </span>
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Mail
              size={18}
              color="var(--color-primary)"
              style={{ flexShrink: 0 }}
            />
            <a href="mailto:hello@dron.by" style={{ color: "var(--color-fg)" }}>
              minskmodel@gmail.com
            </a>
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Mail
              size={18}
              color="var(--color-primary)"
              style={{ flexShrink: 0 }}
            />
            <a
              href="mailto:service@dron.by"
              style={{ color: "var(--color-fg)" }}
            >
              servicedron@gmail.com
            </a>
          </li>
          <li style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Clock
              size={18}
              color="var(--color-primary)"
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <span>
              Пн–Пт: 10:00 – 19:00
              <br />
              Сб: 11:00 – 16:00
              <br />
              Вс: выходной
            </span>
          </li>
        </ul>

        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-fg)",
              marginBottom: 10,
            }}
          >
            Мы в социальных сетях
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              {
                Icon: Instagram,
                href: "https://www.instagram.com/nieviadomyj?igsh=amp1c2xqdTJ0Y3U3",
                label: "Instagram",
              },
              {
                Icon: Facebook,
                href: "https://www.facebook.com/share/1Vz5jxWmfX/",
                label: "Facebook",
              },
              {
                Icon: Youtube,
                href: "https://youtube.com/@aleksanderlamkov?si=1_sPZUImXB12L0iP",
                label: "YouTube",
              },
              {
                Icon: Send,
                href: "https://t.me/Nieviadomyj",
                label: "Telegram",
              },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--color-muted)",
                  color: "var(--color-primary)",
                }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <p
          style={{
            fontSize: 13,
            color: "var(--color-muted-fg)",
            marginTop: 16,
          }}
        >
          УНП 704815263 · ООО «ДРОН.БАЙ» · Свидетельство о госрегистрации №
          92638 от 21.03.2026
        </p>
      </LayoutCard>

      <LayoutCard padded>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          На карте
        </h2>
        <div
          style={{
            width: "100%",
            minHeight: 400,
            height: "calc(100% - 40px)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            border: "1px solid var(--color-border)",
            background: "var(--color-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-muted-fg)",
            fontSize: 14,
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3421.6319426054993!2d27.454202313174843!3d53.90581637234196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbdad2e980dd7b%3A0xa25036142ad618d7!2z0JHQuNC30L3QtdGBLdGG0LXQvdGC0YAg0KTQsNGA0LXQvdCz0LXQudGC!5e1!3m2!1sru!2sby!4v1777242684684!5m2!1sru!2sby"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </LayoutCard>
    </div>
  </div>
);

export default ContactsPage;
