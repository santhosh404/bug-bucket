import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { SessionProvider } from "@/components/providers/session-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bug Bucket - Developer-First Bug Tracker",
  description:
    "A modern, production-ready bug tracker for development teams. Track bugs, manage projects, and collaborate with your team.",
  keywords: ["bug tracker", "issue tracker", "project management", "development", "collaboration"],
  authors: [{ name: "Bug Bucket Team" }],
  openGraph: {
    title: "Bug Bucket - Developer-First Bug Tracker",
    description: "A modern, production-ready bug tracker for development teams",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
