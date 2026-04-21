"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇵🇸" },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const current =
    languages.find((l) => l.code === i18n.language) ?? languages[0];

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = code;
  };

  return (
    <div className="lang-switcher">
      <button
        className="header-icon-btn lang-trigger"
        onClick={() => setIsOpen((o) => !o)}
        title={t("language.switchLanguage")}
      >
        <span>{current.flag}</span>
        {/* <span className="lang-name">{current.name}</span> */}
        {/* <svg
          viewBox="0 0 12 12"
          fill="none"
          width="10"
          height="10"
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg> */}
      </button>

      {isOpen && (
        <>
          <div className="lang-overlay" onClick={() => setIsOpen(false)} />
          <div className="lang-dropdown">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`lang-option${
                  lang.code === i18n.language ? " active" : ""
                }`}
                onClick={() => handleChange(lang.code)}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {lang.code === i18n.language && (
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "var(--accent-purple)",
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
