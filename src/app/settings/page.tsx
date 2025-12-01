"use client"

import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Rocket,
  Bell,
  Palette,
  Shield,
  User,
  Mail,
  Key,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    redirect("/auth/signin")
  }

  const upcomingFeatures = [
    {
      icon: User,
      title: "Profile Settings",
      description: "Update your name, email, and profile picture",
      status: "planned",
    },
    {
      icon: Bell,
      title: "Notification Preferences",
      description: "Control email and in-app notifications",
      status: "planned",
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize theme, color schemes, and UI preferences",
      status: "planned",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Manage your privacy settings and security options",
      status: "planned",
    },
    {
      icon: Key,
      title: "API Keys",
      description: "Generate and manage API keys for integrations",
      status: "planned",
    },
    {
      icon: Mail,
      title: "Email Settings",
      description: "Configure email preferences and templates",
      status: "planned",
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 shadow-2xl shadow-purple-500/50 mb-4 animate-bounce-slow">
            <Settings className="h-10 w-10 text-white" />
          </div>

          <div className="space-y-2">
            <Badge
              variant="outline"
              className="bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
            >
              <Clock className="h-3 w-3 mr-1" />
              Coming Soon
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
              Settings Page
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are working hard to bring you powerful settings to customize your Bug Bucket
              experience. Stay tuned for these exciting features!
            </p>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-purple-600 bg-clip-text text-transparent">
              Upcoming Features
            </h2>
            <Badge
              variant="secondary"
              className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            >
              {upcomingFeatures.length} Features
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingFeatures.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-xl hover:shadow-purple-500/20 transition-all hover:border-purple-500/50 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-purple-300/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform" />

                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-300/10 group-hover:from-purple-600 group-hover:to-purple-400 transition-all group-hover:scale-110">
                      <feature.icon className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 text-xs"
                    >
                      {feature.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-purple-300/10 rounded-full -translate-y-32 translate-x-32" />

          <div className="relative p-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 shadow-lg shadow-purple-500/30 mb-2">
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-purple-600 bg-clip-text text-transparent">
                Want to help shape these features?
              </h3>
              <p className="text-muted-foreground">
                Bug Bucket is open source! Contribute to the project and help us build amazing
                features faster. Your feedback and contributions are always welcome.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity shadow-lg hover:shadow-purple-500/50"
              >
                <Link href="https://github.com/yourusername/bug-bucket" target="_blank">
                  <Rocket className="h-4 w-4 mr-2" />
                  View on GitHub
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="hover:border-purple-500/50 hover:text-purple-600 transition-colors"
              >
                <Link href="/dashboard">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Community Driven</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Timeline Info */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Pro Tip:</span> While we're building these features, you
            can still manage your profile through your projects and teams!
          </p>
          <p className="text-xs text-muted-foreground">
            Follow our{" "}
            <Link
              href="https://github.com/yourusername/bug-bucket"
              className="text-purple-600 hover:underline"
              target="_blank"
            >
              GitHub repository
            </Link>{" "}
            for updates on feature development
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
