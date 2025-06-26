"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, EyeOff, Settings, Edit, Trash2 } from "lucide-react"
import { saveAs } from "file-saver"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

// Importer les nouveaux composants
import { NotificationSystem } from "@/components/notification-system"
import { useLanguage, VoiceMessage } from "@/components/language-system"
import { AnimatedCard, AnimatedButton, CountUp, SlideIn } from "@/components/animated-components"

// Importer les composants de chart
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts"

// Importer les contextes
import { useAppData, Transaction, Category } from "@/components/app-data-context"
import { AddTransaction } from "@/components/add-transaction"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Page } from "../types"

// Données mockées
const mockData = {
  balance: 125750,
  monthlyExpenses: 89500,
  monthlyIncome: 150000,
  transactions: [
    {
      id: 1,
      type: "expense",
      amount: 2500,
      category: "transport",
      description: "Car rapide Dakar-Pikine",
      date: "2025-01-25",
      icon: "🚌",
    },
    {
      id: 2,
      type: "income",
      amount: 50000,
      category: "salary",
      description: "Salaire janvier",
      date: "2025-01-25",
      icon: "💰",
    },
    {
      id: 3,
      type: "expense",
      amount: 15000,
      category: "ndogou",
      description: "Repas famille",
      date: "2025-01-24",
      icon: "🍽️",
    },
    {
      id: 4,
      type: "expense",
      amount: 8500,
      category: "orange_money",
      description: "Transfert maman",
      date: "2025-01-24",
      icon: "📱",
    },
    {
      id: 5,
      type: "expense",
      amount: 12000,
      category: "market",
      description: "Courses hebdomadaires",
      date: "2025-01-23",
      icon: "🛒",
    },
  ],
  expensesByCategory: [
    { category: "Ndogou", amount: 35000, color: "#FF6B6B", percentage: 39 },
    { category: "Transport", amount: 25000, color: "#4ECDC4", percentage: 28 },
    { category: "Marché", amount: 20000, color: "#45B7D1", percentage: 22 },
    { category: "Orange Money", amount: 9500, color: "#96CEB4", percentage: 11 },
  ],
}

export function Dashboard({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t, speak } = useLanguage()
  const [showBalance, setShowBalance] = useState(true)
  const [showLanguageSettings, setShowLanguageSettings] = useState(false)
  const [showGamification, setShowGamification] = useState(false)

  // Ajouter les états pour les charts
  const [chartPeriod, setChartPeriod] = useState<"week" | "month" | "year">("month")
  const [chartType, setChartType] = useState<"pie" | "line" | "bar">("pie")
  const [view, setView] = useState<'expenses' | 'income' | 'overview'>('expenses')

  const { transactions, updateTransaction, deleteTransaction, categories } = useAppData()
  const [editingTxId, setEditingTxId] = useState<number | null>(null)
  const [editTx, setEditTx] = useState<Partial<Transaction>>({})
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterDate, setFilterDate] = useState("")

  const { theme, setTheme } = useTheme();

  const [showAddModal, setShowAddModal] = useState(false);

  // Filtrage des transactions
  const filteredTransactions = transactions.filter((tx: Transaction) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase()) ||
      String(tx.amount).includes(search);
    const matchesCategory = filterCategory ? tx.category === filterCategory : true;
    const matchesType = filterType ? tx.type === filterType : true;
    const matchesDate = filterDate ? tx.date === filterDate : true;
    return matchesSearch && matchesCategory && matchesType && matchesDate;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "FCFA")
  }

  // Corriger la fonction handleShortcutClick pour inclure toutes les pages
  const handleShortcutClick = (shortcut: any) => {
    if (shortcut.available && shortcut.action) {
      // Annoncer vocalement l'action
      speak(shortcut.name)

      // Navigation vers toutes les pages
      if (shortcut.action === "categories") {
        onNavigate("categories")
      } else if (shortcut.action === "stats") {
        onNavigate("stats")
      } else if (shortcut.action === "profile") {
        onNavigate("profile")
      } else if (shortcut.action === "budget") {
        onNavigate("budget")
      } else if (shortcut.action === "savings") {
        onNavigate("savings")
      } else if (shortcut.action === "challenges") {
        onNavigate("challenges")
      } else if (shortcut.action === "reports") {
        onNavigate("reports")
      } else if (shortcut.action === "language") {
        onNavigate("language")
      } else if (shortcut.action === "gamification") {
        onNavigate("gamification")
      } else if (shortcut.action === "notifications") {
        onNavigate("notifications")
      } else if (shortcut.action === "analytics") {
        onNavigate("analytics")
      } else if (shortcut.action === "tontine") {
        onNavigate("tontine" as Page)
      }
    }
  }

  // Mettre à jour les raccourcis avec toutes les fonctionnalités
  const shortcuts = [
    {
      name: t("savings.title"),
      icon: "🪙",
      color: "bg-yellow-100 text-yellow-800",
      available: true,
      action: "savings",
    },
    {
      name: t("challenges.title"),
      icon: "🎯",
      color: "bg-purple-100 text-purple-800",
      available: true,
      action: "challenges",
    },
    {
      name: t("profile.language"),
      icon: "🌍",
      color: "bg-blue-100 text-blue-800",
      available: true,
      action: "language",
    },
    {
      name: "Gamification",
      icon: "🏆",
      color: "bg-green-100 text-green-800",
      available: true,
      action: "gamification",
    },
    {
      name: t("budget.title"),
      icon: "💰",
      color: "bg-indigo-100 text-indigo-800",
      available: true,
      action: "budget",
    },
    {
      name: "Rapports",
      icon: "📄",
      color: "bg-red-100 text-red-800",
      available: true,
      action: "reports",
    },
    {
      name: "Catégories",
      icon: "📂",
      color: "bg-orange-100 text-orange-800",
      available: true,
      action: "categories",
    },
    {
      name: "Notifications",
      icon: "🔔",
      color: "bg-pink-100 text-pink-800",
      available: true,
      action: "notifications",
    },
    {
      name: t("tontine.title"),
      icon: "🤝",
      color: "bg-teal-100 text-teal-800",
      available: true,
      action: "tontine",
    },
  ]

  // Ajouter les données pour les différentes périodes
  const chartData = {
    week: [
      { name: "Lun", value: 12000 },
      { name: "Mar", value: 8500 },
      { name: "Mer", value: 15000 },
      { name: "Jeu", value: 6000 },
      { name: "Ven", value: 18000 },
      { name: "Sam", value: 25000 },
      { name: "Dim", value: 5000 },
    ],
    month: [
      { name: t("category.ndogou"), value: 35000, fill: "#FF6B6B" },
      { name: t("category.transport"), value: 25000, fill: "#4ECDC4" },
      { name: t("category.market"), value: 20000, fill: "#45B7D1" },
      { name: t("category.orange_money"), value: 9500, fill: "#96CEB4" },
    ],
    year: [
      { name: "Jan", value: 89500 },
      { name: "Fév", value: 76200 },
      { name: "Mar", value: 92800 },
      { name: "Avr", value: 68900 },
      { name: "Mai", value: 85600 },
      { name: "Jun", value: 94200 },
    ],
  }

  // Données fictives pour les revenus (exemple)
  const incomeData = {
    week: [
      { name: "Lun", value: 20000 },
      { name: "Mar", value: 22000 },
      { name: "Mer", value: 18000 },
      { name: "Jeu", value: 25000 },
      { name: "Ven", value: 21000 },
      { name: "Sam", value: 23000 },
      { name: "Dim", value: 24000 },
    ],
    month: [
      { name: "Salaire principal", value: 150000, fill: "#00916E" },
      { name: "Business", value: 10000, fill: "#FFD600" },
      { name: "Freelance", value: 20000, fill: "#2D3A70" },
    ],
    year: [
      { name: "Jan", value: 170000 },
      { name: "Fév", value: 160000 },
      { name: "Mar", value: 180000 },
      { name: "Avr", value: 175000 },
      { name: "Mai", value: 165000 },
      { name: "Jun", value: 190000 },
    ],
  }

  return (
    <div className="pb-20 bg-white dark:bg-slate-900 dark:text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001f3f] to-[#2ECC71] text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <SlideIn direction="left">
            <div className="flex items-center space-x-2">
              <div>
                <h1 className="text-2xl font-bold">{t("dashboard.welcome")}</h1>
                <p className="opacity-90">{t("dashboard.financial_situation")}</p>
              </div>
              <VoiceMessage message={t("dashboard.welcome")} />
            </div>
          </SlideIn>
          <SlideIn direction="right" delay={200}>
            <div className="flex space-x-2 items-center">
              <NotificationSystem />
              <button
                className="rounded-full p-2 hover:bg-white/20 transition"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Changer le thème"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-gray-200" />}
              </button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => onNavigate("profile")}>
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </SlideIn>
        </div>

        {/* Solde principal */}
        <AnimatedCard className="bg-white/10 backdrop-blur-sm border-0 text-white" delay={400}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">{t("dashboard.current_balance")}</h2>
                <VoiceMessage message={`${t("dashboard.current_balance")}: ${formatCurrency(mockData.balance)}`} />
              </div>
              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-white hover:bg-white/20"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </AnimatedButton>
            </div>
            <p className="text-3xl font-bold">
              {showBalance ? <CountUp end={mockData.balance} suffix=" FCFA" /> : "••••••"}
            </p>
          </CardContent>
        </AnimatedCard>
      </div>

      <div className="p-6 space-y-6">
        {/* Barre de recherche et filtres */}
        <div className="flex flex-wrap gap-2 mb-4 items-end">
          <input
            type="text"
            placeholder="Rechercher..."
            className="border rounded px-3 py-2 w-48 dark:bg-slate-800 dark:text-white dark:border-slate-700"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2 dark:bg-slate-800 dark:text-white dark:border-slate-700"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="">Toutes catégories</option>
            {categories.map((cat: Category) => (
              <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
            ))}
          </select>
          <select
            className="border rounded px-3 py-2 dark:bg-slate-800 dark:text-white dark:border-slate-700"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="">Tous types</option>
            <option value="expense">Dépense</option>
            <option value="income">Revenu</option>
          </select>
          <input
            type="date"
            className="border rounded px-3 py-2 dark:bg-slate-800 dark:text-white dark:border-slate-700"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
        </div>
        {/* Revenus et Dépenses */}
        <div className="grid grid-cols-2 gap-4">
          <AnimatedCard className="border-l-4 border-l-red-500 dark:bg-slate-800 dark:text-white" delay={600}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-sm text-gray-600">{t("dashboard.expenses")}</p>
                    <p className="text-lg font-bold text-red-600">
                      <CountUp end={mockData.monthlyExpenses} suffix=" FCFA" />
                    </p>
                  </div>
                  <VoiceMessage message={`${t("dashboard.expenses")}: ${formatCurrency(mockData.monthlyExpenses)}`} />
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard className="border-l-4 border-l-green-500 dark:bg-slate-800 dark:text-white" delay={700}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-sm text-gray-600">{t("dashboard.income")}</p>
                    <p className="text-lg font-bold text-green-600">
                      <CountUp end={mockData.monthlyIncome} suffix=" FCFA" />
                    </p>
                  </div>
                  <VoiceMessage message={`${t("dashboard.income")}: ${formatCurrency(mockData.monthlyIncome)}`} />
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Section Charts Interactive */}
        <AnimatedCard delay={800} className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">
                  {view === 'expenses' && t("dashboard.expense_analysis")}
                  {view === 'income' && "Analyse des revenus"}
                  {view === 'overview' && "Vue d'ensemble"}
                </CardTitle>
                <VoiceMessage message={t("dashboard.expense_analysis")} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* Sélecteur de vue */}
                <button onClick={() => setView('expenses')} className={`px-3 py-1 rounded ${view === 'expenses' ? 'bg-green-100 text-green-800 font-bold' : 'bg-gray-100 text-gray-600'}`}>Dépenses</button>
                <button onClick={() => setView('income')} className={`px-3 py-1 rounded ${view === 'income' ? 'bg-green-100 text-green-800 font-bold' : 'bg-gray-100 text-gray-600'}`}>Revenus</button>
                <button onClick={() => setView('overview')} className={`px-3 py-1 rounded ${view === 'overview' ? 'bg-green-100 text-green-800 font-bold' : 'bg-gray-100 text-gray-600'}`}>Vue d'ensemble</button>
                {/* Sélecteur de période */}
                <Select value={chartPeriod} onValueChange={(value: "week" | "month" | "year") => setChartPeriod(value)}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Semaine</SelectItem>
                    <SelectItem value="month">Mois</SelectItem>
                    <SelectItem value="year">Année</SelectItem>
                  </SelectContent>
                </Select>
                {/* Sélecteur de type de graphique */}
                <Select value={chartType} onValueChange={(value: "pie" | "line" | "bar") => setChartType(value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pie">🥧</SelectItem>
                    <SelectItem value="line">📈</SelectItem>
                    <SelectItem value="bar">📊</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === 'expenses' && (
              <ChartContainer
                config={{
                  value: {
                    label: "Montant",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                {chartType === "pie" ? (
                  <PieChart>
                    <Pie
                      data={chartData[chartPeriod === "week" ? "month" : chartPeriod]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    >
                      {chartData[chartPeriod === "week" ? "month" : chartPeriod].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={"fill" in entry ? entry.fill || `hsl(${index * 45}, 70%, 60%)` : `hsl(${index * 45}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                ) : chartType === "line" ? (
                  <LineChart data={chartData[chartPeriod === "month" ? "year" : chartPeriod]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="value" stroke="#2ECC71" strokeWidth={3} />
                  </LineChart>
                ) : chartType === "bar" ? (
                  <BarChart data={chartData[chartPeriod === "month" ? "year" : chartPeriod]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#2ECC71" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <div style={{textAlign: 'center', color: '#888'}}>Aucun graphique à afficher</div>
                )}
              </ChartContainer>
            )}
            {view === 'income' && (
              <ChartContainer
                config={{
                  value: {
                    label: "Montant",
                    color: "#00916E",
                  },
                }}
                className="h-[300px]"
              >
                {chartType === "pie" ? (
                  <PieChart>
                    <Pie
                      data={incomeData[chartPeriod === "week" ? "month" : chartPeriod]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    >
                      {incomeData[chartPeriod === "week" ? "month" : chartPeriod].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={"fill" in entry ? entry.fill || `hsl(${index * 45}, 70%, 60%)` : `hsl(${index * 45}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                ) : chartType === "line" ? (
                  <LineChart data={incomeData[chartPeriod === "month" ? "year" : chartPeriod]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="value" stroke="#00916E" strokeWidth={3} />
                  </LineChart>
                ) : chartType === "bar" ? (
                  <BarChart data={incomeData[chartPeriod === "month" ? "year" : chartPeriod]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#00916E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <div style={{textAlign: 'center', color: '#888'}}>Aucun graphique à afficher</div>
                )}
              </ChartContainer>
            )}
            {view === 'overview' && (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                <span>Vue d'ensemble à venir...</span>
              </div>
            )}
          </CardContent>
        </AnimatedCard>

        {/* Transactions récentes */}
        <AnimatedCard delay={1200} className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg">{t("dashboard.recent_transactions")}</CardTitle>
              <VoiceMessage message={t("dashboard.recent_transactions")} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.slice(0, 5).map((transaction: Transaction) => (
                <SlideIn key={transaction.id} delay={1300 + transaction.id * 100} direction="left">
                  {editingTxId === transaction.id ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <select
                          value={editTx.category || transaction.category}
                          onChange={e => setEditTx(v => ({ ...v, category: e.target.value }))}
                          className="border rounded px-1"
                        >
                          {categories.filter((c: Category) => c.type === transaction.type).map((cat: Category) => (
                            <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-24"
                          value={editTx.amount ?? transaction.amount}
                          onChange={e => setEditTx(v => ({ ...v, amount: Number(e.target.value) }))}
                        />
                        <input
                          className="border rounded px-2 py-1"
                          value={editTx.description ?? transaction.description}
                          onChange={e => setEditTx(v => ({ ...v, description: e.target.value }))}
                        />
                        <input
                          type="date"
                          className="border rounded px-2 py-1"
                          value={editTx.date ?? transaction.date}
                          onChange={e => setEditTx(v => ({ ...v, date: e.target.value }))}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingTxId(null); setEditTx({}); }}>Annuler</Button>
                        <Button variant="default" size="sm" onClick={() => { updateTransaction(transaction.id, editTx); setEditingTxId(null); setEditTx({}); }}>Valider</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{transaction.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {t(`category.${transaction.category}`)} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-2">
                        <p className={`font-semibold ${transaction.type === "expense" ? "text-red-600" : "text-green-600"}`}>
                          {transaction.type === "expense" ? "-" : "+"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <VoiceMessage message={`${transaction.description}: ${transaction.type === "expense" ? "moins" : "plus"} ${formatCurrency(transaction.amount)}`} />
                        <Button variant="ghost" size="icon" className="text-gray-500" onClick={() => { setEditingTxId(transaction.id); setEditTx(transaction); }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteTransaction(transaction.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </SlideIn>
              ))}
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Raccourcis avancés */}
        <SlideIn delay={1300}>
          <div className="dark:bg-slate-800 dark:text-white">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-lg font-semibold">{t("dashboard.features")}</h3>
              <VoiceMessage message={t("dashboard.features")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {shortcuts.map((shortcut, index) => (
                <AnimatedCard
                  key={index}
                  delay={1400 + index * 100}
                  className={`min-w-[120px] cursor-pointer transition-all duration-200 hover:scale-105 ${
                    shortcut.available ? "hover:shadow-lg" : "opacity-60"
                  }`}
                >
                  <CardContent className="p-4 text-center" onClick={() => handleShortcutClick(shortcut)}>
                    <div
                      className={`w-12 h-12 rounded-full ${shortcut.color} flex items-center justify-center mx-auto mb-2`}
                    >
                      <span className="text-xl">{shortcut.icon}</span>
                    </div>
                    <p className="text-sm font-medium">{shortcut.name}</p>
                    {!shortcut.available && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Bientôt
                      </Badge>
                    )}
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </SlideIn>
      </div>

      {/* Bouton flottant pour ajouter une transaction */}
      <button
        className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 text-3xl"
        onClick={() => setShowAddModal(true)}
        aria-label="Ajouter une transaction"
      >
        +
      </button>

      {/* Modale d'ajout de transaction */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg p-0 overflow-visible max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Ajouter une transaction</DialogTitle>
          <AddTransaction onBack={() => setShowAddModal(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
