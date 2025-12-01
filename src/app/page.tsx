import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bug,
  CheckCircle2,
  Users,
  BarChart3,
  Shield,
  Zap,
  Sparkles,
  Rocket,
  Target,
  Coffee,
} from "lucide-react"

export default async function HomePage() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <header className="sticky px-10 top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-110 group-hover:rotate-12">
              <Bug className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Bug Bucket
            </span>
            <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
              v1.0
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hover:scale-105 transition-transform">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button
              asChild
              className="hover:scale-105 transition-transform shadow-lg hover:shadow-primary/50"
            >
              <Link href="/auth/signup">
                Get Started
                <Sparkles className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex px-10 flex-col items-center justify-center gap-8 py-24 text-center">
        <Badge variant="outline" className="animate-pulse">
          🎉 Now Open Source & Free Forever
        </Badge>
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-2xl shadow-primary/50 animate-bounce-slow">
            <Bug className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
            It's not a bug, it's a feature
          </h1>
          <p className="text-lg sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
            Just kidding! Track, squash, and obliterate bugs like a boss.
            <br />
            <span className="text-primary font-medium">Zero bugs in production</span> (we wish 😅)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-delay-2">
          <Button
            size="lg"
            asChild
            className="group hover:scale-105 transition-all shadow-lg hover:shadow-primary/50"
          >
            <Link href="/auth/signup">
              <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Start Crushing Bugs
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="hover:scale-105 transition-transform"
          >
            <Link href="https://github.com/yourusername/bug-bucket" target="_blank">
              <span className="mr-2">⭐</span>
              Star on GitHub
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground mt-8">
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            <span>Built by developers</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>For developers</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container px-10 py-24 space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-sm">
            Why Developers Love Us ❤️
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold">Debug smarter, not harder</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Finally, a bug tracker that doesn't make you want to create more bugs
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <CheckCircle2 className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                Intuitive Tracking
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Track bugs so easily, you'll{" "}
                <span className="font-medium text-foreground">actually enjoy</span> fixing them.
                (Okay, maybe not <em>enjoy</em>, but tolerate? 😅)
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300">
                <Users className="h-7 w-7 text-purple-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-purple-500 transition-colors">
                Team Collaboration
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Collaborate seamlessly. Assign bugs like{" "}
                <span className="font-medium text-foreground">hot potatoes</span> 🥔 (but in a
                professional way, we promise)
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pink-500/10 group-hover:bg-pink-500 group-hover:scale-110 transition-all duration-300">
                <BarChart3 className="h-7 w-7 text-pink-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-pink-500 transition-colors">
                Powerful Analytics
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize your bug patterns. Watch your{" "}
                <span className="font-medium text-foreground">bug count go down</span> 📉 (or up, no
                judgment here)
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                <Shield className="h-7 w-7 text-blue-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-blue-500 transition-colors">
                Secure & Private
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your bugs stay <span className="font-medium text-foreground">yours</span>. We won't
                tell anyone about that{" "}
                <code className="px-1 py-0.5 rounded bg-muted text-xs">console.log('test')</code>{" "}
                you forgot 🤫
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500/10 group-hover:bg-yellow-500 group-hover:scale-110 transition-all duration-300">
                <Zap className="h-7 w-7 text-yellow-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-yellow-500 transition-colors">
                Blazingly Fast ⚡
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Built with <span className="font-medium text-foreground">Next.js 16</span> and React
                19. So fast, you'll wonder if it's <em>actually</em> working 🚀
              </p>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                <Sparkles className="h-7 w-7 text-green-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-green-500 transition-colors">
                100% Open Source
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Free as in <span className="font-medium text-foreground">beer</span> 🍺 and{" "}
                <span className="font-medium text-foreground">freedom</span>. Fork it, break it,
                make it yours. We dare you! 😎
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-10 border-t bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="container relative py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
                Ready to{" "}
                <span className="inline-block hover:animate-bounce cursor-default bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  squash
                </span>{" "}
                some bugs?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join the cool developers who stopped fighting their bug tracker
                <br className="hidden sm:inline" />
                and started{" "}
                <span className="font-medium text-foreground">actually fixing bugs</span>.
                Revolutionary, we know. 🎯
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="group hover:scale-105 transition-all shadow-lg hover:shadow-primary/50"
              >
                <Link href="/auth/signup">
                  <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Start For Free
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="hover:scale-105 transition-transform"
              >
                <Link href="https://github.com/yourusername/bug-bucket" target="_blank">
                  <span className="mr-2">⭐</span>
                  Star on GitHub
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground pt-8">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                  <span className="text-green-500 text-lg">✓</span>
                </div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                  <span className="text-blue-500 text-lg">✓</span>
                </div>
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
                  <span className="text-purple-500 text-lg">✓</span>
                </div>
                <span>Open source</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30 px-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Bug className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <div className="font-bold text-lg">Bug Bucket</div>
                <div className="text-xs text-muted-foreground">Squashing bugs since 2025</div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link
                href="https://github.com/yourusername/bug-bucket"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <span>⭐</span> GitHub
              </Link>
              <Link
                href="https://github.com/yourusername/bug-bucket/blob/main/LICENSE"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                MIT License
              </Link>
              <span className="text-muted-foreground">Made with ☕ and 🐛</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-xs text-muted-foreground">
            <p>
              © 2025 Bug Bucket. Open source under MIT license.{" "}
              <span className="hidden sm:inline">
                • Built by developers who have seen things you wouldn't believe. 🚀
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
