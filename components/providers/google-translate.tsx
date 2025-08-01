"use client"

import { useEffect } from "react"
import { useI18n } from "./i18n-provider"

declare global {
  interface Window {
    googleTranslateElementInit: () => void
    google: any
  }
}

export function GoogleTranslate() {
  const { language, setLanguage } = useI18n()

  useEffect(() => {
    // Add Google Translate script
    const addScript = () => {
      const script = document.createElement("script")
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      script.async = true
      document.body.appendChild(script)
      return script
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,fr",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element",
      )

      // Sync with our app's language state
      const translateCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement
      if (translateCombo) {
        translateCombo.value = language === "fr" ? "fr" : "en"
        translateCombo.dispatchEvent(new Event("change"))

        // Listen for changes
        translateCombo.addEventListener("change", () => {
          const newLang = translateCombo.value === "fr" ? "fr" : "en"
          setLanguage(newLang as "en" | "fr")
        })
      }
    }

    const script = addScript()

    // Cleanup
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script)
      }
      delete window.googleTranslateElementInit
    }
  }, [language, setLanguage])

  // Hide Google Translate widget but keep functionality
  return (
    <>
              <div id="google_translate_element" className="hidden" suppressHydrationWarning></div>
      <style jsx global>{`
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
      `}</style>
    </>
  )
}
