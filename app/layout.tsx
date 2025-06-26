import type { Metadata } from 'next'
import './globals.css'
import { AppDataProvider } from "@/components/app-data-context";

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-screen bg-background">
        <AppDataProvider>
          <div className="w-full pb-20">
            {children}
          </div>
        </AppDataProvider>
      </body>
    </html>
  )
}
