"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/providers/auth-provider"
import { useI18n } from "@/components/providers/i18n-provider"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Home } from "lucide-react"
import { DemoCredentials } from "./demo-credentials"

export function AuthScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const { login, register } = useAuth()
  const { t } = useI18n()
  const { toast } = useToast()
  const [showCredentials, setShowCredentials] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await login(email, password)
      toast({
        title: t("auth.welcomeBack"),
        description: t("auth.loginSuccess"),
      })
    } catch (error) {
      toast({
        title: t("auth.loginFailed"),
        description: t("auth.checkCredentials"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const userData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      role: formData.get("role") as "client" | "provider",
      phone: formData.get("phone") as string,
    }

    try {
      await register(userData)
      toast({
        title: t("auth.accountCreated"),
        description: t("auth.welcomeMessage"),
      })
    } catch (error) {
      toast({
        title: t("auth.registrationFailed"),
        description: t("auth.checkInformation"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider)

    try {
      // Simulate social login process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful social login
      const mockUser = {
        id: `${provider}_${Date.now()}`,
        email: `user@${provider}.com`,
        firstName: provider === "google" ? "Google" : "Facebook",
        lastName: "User",
        role: "client" as const,
        isVerified: true,
        avatar:
          provider === "google"
            ? "https://lh3.googleusercontent.com/a/default-user=s96-c"
            : "https://graph.facebook.com/me/picture?type=large",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Use the auth context to set the user instead of direct localStorage
      localStorage.setItem("houseman_user", JSON.stringify(mockUser))

      // Force reload to update the auth state
      window.location.reload()

      toast({
        title: t("auth.welcomeBack"),
        description: `Successfully signed in with ${provider}`,
      })
    } catch (error) {
      toast({
        title: "Social Login Failed",
        description: `Failed to sign in with ${provider}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Houseman Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Houseman</h1>
          <p className="text-muted-foreground">Connecting you to the best local services</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("common.welcome")}</CardTitle>
            <CardDescription>Log in now to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
                <TabsTrigger value="register">{t("auth.register")}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t("auth.email")}</Label>
                    <Input id="login-email" name="email" type="email" placeholder={t("auth.enterEmail")} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t("auth.password")}</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.enterPassword")}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("auth.signingIn") : t("auth.signIn")}
                  </Button>
                </form>

                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">{t("auth.orContinueWith")}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialLogin("google")}
                      type="button"
                      disabled={socialLoading !== null}
                      className="relative"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {socialLoading === "google" ? "Signing in..." : t("auth.google")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialLogin("facebook")}
                      type="button"
                      disabled={socialLoading !== null}
                      className="relative"
                    >
                      <svg className="w-4 h-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      {socialLoading === "facebook" ? "Signing in..." : t("auth.facebook")}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t("auth.firstName")}</Label>
                      <Input id="firstName" name="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t("auth.lastName")}</Label>
                      <Input id="lastName" name="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t("auth.email")}</Label>
                    <Input id="register-email" name="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("auth.phone")} (Optional)</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+237 6XX XXX XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">{t("auth.selectRole")}</Label>
                    <Select name="role" required>
                      <SelectTrigger>
                        <SelectValue placeholder={t("auth.selectRole")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">{t("auth.findServices")}</SelectItem>
                        <SelectItem value="provider">{t("auth.offerServices")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">{t("auth.password")}</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.createPassword")}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("auth.creatingAccount") : t("auth.createAccount")}
                  </Button>
                </form>

                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">{t("auth.orContinueWith")}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialLogin("google")}
                      type="button"
                      disabled={socialLoading !== null}
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {socialLoading === "google" ? "Signing up..." : t("auth.google")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialLogin("facebook")}
                      type="button"
                      disabled={socialLoading !== null}
                    >
                      <svg className="w-4 h-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      {socialLoading === "facebook" ? "Signing up..." : t("auth.facebook")}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Demo Credentials Toggle */}
            <div className="mt-6 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full"
              >
                {showCredentials ? "Hide" : "Show"} Demo Credentials
              </Button>
            </div>

            {/* Demo Credentials */}
            {showCredentials && (
              <div className="mt-4">
                <DemoCredentials />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
