"use client"

import { useState } from "react"
import { WelcomePage } from "@/components/welcome-page"
import { Dashboard } from "@/components/dashboard"
import { AddTransaction } from "@/components/add-transaction"
import { Statistics } from "@/components/statistics"
import { Navigation } from "@/components/navigation"
import { Profile } from "@/components/profile"
import { Categories } from "@/components/categories"
import { Budget } from "@/components/budget"
import { Savings } from "@/components/savings"
import { Challenges } from "@/components/challenges"
import { Reports } from "@/components/reports"
import { LanguageProvider } from "@/components/language-system"
import { ThemeProvider } from "@/components/theme-provider"
// Ajouter les nouvelles pages dans les imports
import { LanguagePage } from "@/components/language-page"
import { GamificationPage } from "@/components/gamification-page"
import { NotificationsPage } from "@/components/notifications-page"
import { AnalyticsPage } from "@/components/analytics-page"
import { Tontine } from "@/components/tontine"

export default function App() {
  // Mettre à jour le type currentPage pour inclure toutes les nouvelles pages
  const [currentPage, setCurrentPage] = useState<
    | "welcome"
    | "dashboard"
    | "add"
    | "stats"
    | "profile"
    | "categories"
    | "budget"
    | "savings"
    | "challenges"
    | "reports"
    | "language"
    | "gamification"
    | "notifications"
    | "analytics"
    | "tontine"
  >("welcome")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
    setCurrentPage("dashboard")
  }

  if (!isLoggedIn) {
    return (
      <LanguageProvider>
        <WelcomePage onLogin={handleLogin} />
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <div className="w-full bg-white dark:bg-slate-900 min-h-screen shadow-xl">
            {currentPage === "dashboard" && <Dashboard onNavigate={setCurrentPage} />}
            {currentPage === "add" && <AddTransaction onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "stats" && <Statistics onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "profile" && <Profile onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "categories" && <Categories onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "budget" && <Budget onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "savings" && <Savings onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "challenges" && <Challenges onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "reports" && <Reports onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "language" && <LanguagePage onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "gamification" && <GamificationPage onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "notifications" && <NotificationsPage onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "analytics" && <AnalyticsPage onBack={() => setCurrentPage("dashboard")} />}
            {currentPage === "tontine" && <Tontine onBack={() => setCurrentPage("dashboard")} />}

            <Navigation currentPage={currentPage} onPageChange={(page) => setCurrentPage(page)} />
          </div>
        </div>
      </ThemeProvider>
    </LanguageProvider>
  )
}
