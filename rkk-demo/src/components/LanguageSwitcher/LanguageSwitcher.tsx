import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages, ChevronDown } from "lucide-react";

const languages = [
  { code: "ar", name: "العربية", flag: "🇵🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);

    // Update document direction for RTL languages
    document.documentElement.dir = languageCode === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = languageCode;
  };

  return (
    <div className="rkk-demo-language-switcher">
      <button
        className="rkk-demo-language-switcher-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title={t("language.switchLanguage")}
      >
        <Languages size={20} />
        <span className="rkk-demo-language-switcher-current">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <ChevronDown
          size={16}
          className={`rkk-demo-language-switcher-chevron ${
            isOpen ? "open" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="rkk-demo-language-switcher-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="rkk-demo-language-switcher-dropdown">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`rkk-demo-language-switcher-option ${
                  language.code === i18n.language ? "active" : ""
                }`}
                onClick={() => handleLanguageChange(language.code)}
              >
                <span className="rkk-demo-language-switcher-flag">
                  {language.flag}
                </span>
                <span className="rkk-demo-language-switcher-name">
                  {language.name}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
