import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { I18nProvider } from "@/components/providers/i18n-provider"
import { GoogleTranslate } from "@/components/providers/google-translate"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Houseman - Service Provider App",
  description: "Connect with service providers for your home needs",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    { rel: "icon", url: "/logo.png", sizes: "512x512", type: "image/png" },
    { rel: "shortcut icon", url: "/favicon.ico" },
  ],
  generator: 'Sunyin Elisbrown'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <I18nProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <GoogleTranslate />
              {children}
              <Toaster />
            </ThemeProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
