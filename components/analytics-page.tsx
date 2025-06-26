"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, TrendingUp, BarChart3, PieChart, Calendar, Target } from "lucide-react"
import { useLanguage } from "@/components/language-system"

// Importer les composants de chart
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

interface AnalyticsPageProps {
  onBack: () => void
}

export function AnalyticsPage({ onBack }: AnalyticsPageProps) {
  const { t, speak } = useLanguage()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedMetric, setSelectedMetric] = useState("expenses")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "FCFA")
  }

  // Données pour les différentes analyses
  const expensesTrend = [
    { month: "Sep", expenses: 85000, income: 140000, savings: 55000 },
    { month: "Oct", expenses: 92000, income: 145000, savings: 53000 },
    { month: "Nov", expenses: 87000, income: 148000, savings: 61000 },
    { month: "Déc", expenses: 94000, income: 152000, savings: 58000 },
    { month: "Jan", expenses: 89500, income: 150000, savings: 60500 },
  ]

  const categoryBreakdown = [
    { name: "Ndogou", value: 35000, fill: "#FF6B6B", percentage: 39 },
    { name: "Transport", value: 25000, fill: "#4ECDC4", percentage: 28 },
    { name: "Marché", value: 20000, fill: "#45B7D1", percentage: 22 },
    { name: "Orange Money", value: 9500, fill: "#96CEB4", percentage: 11 },
  ]

  const weeklyPattern = [
    { day: "Lun", amount: 12000, transactions: 3 },
    { day: "Mar", amount: 8500, transactions: 2 },
    { day: "Mer", amount: 15000, transactions: 4 },
    { day: "Jeu", amount: 6000, transactions: 1 },
    { day: "Ven", amount: 18000, transactions: 5 },
    { day: "Sam", amount: 25000, transactions: 7 },
    { day: "Dim", amount: 5000, transactions: 1 },
  ]

  const savingsProgress = [
    { month: "Sep", target: 50000, actual: 45000 },
    { month: "Oct", target: 50000, actual: 53000 },
    { month: "Nov", target: 50000, actual: 61000 },
    { month: "Déc", target: 50000, actual: 58000 },
    { month: "Jan", target: 50000, actual: 60500 },
  ]

  // Métriques clés
  const metrics = {
    totalExpenses: 89500,
    totalIncome: 150000,
    totalSavings: 60500,
    savingsRate: 40.3,
    averageDaily: 2983,
    transactionCount: 45,
    topCategory: "Ndogou",
    budgetUsage: 67,
  }

  const insights = [
    {
      type: "positive",
      title: "Excellente épargne !",
      description: "Vous épargnez 40% de vos revenus, c'est remarquable !",
      icon: "🎉",
    },
    {
      type: "warning",
      title: "Dépenses week-end",
      description: "Vos dépenses du samedi sont 2x plus élevées que la moyenne",
      icon: "⚠️",
    },
    {
      type: "tip",
      title: "Optimisation transport",
      description: "Vous pourriez économiser 5,000 FCFA/mois en utilisant plus les transports en commun",
      icon: "💡",
    },
    {
      type: "achievement",
      title: "Objectif atteint !",
      description: "Vous avez dépassé votre objectif d'épargne mensuel",
      icon: "🏆",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001f3f] to-[#2ECC71] text-white p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">📊 Analyses Avancées</h1>
        </div>

        {/* Métriques rapides */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm opacity-90">Taux d'épargne</p>
                <p className="text-2xl font-bold text-green-300">{metrics.savingsRate}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Transactions</p>
                <p className="text-2xl font-bold">{metrics.transactionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 space-y-6">
        {/* Contrôles de période */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Période d'analyse</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="quarter">Ce trimestre</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expenses">Dépenses</SelectItem>
                    <SelectItem value="income">Revenus</SelectItem>
                    <SelectItem value="savings">Épargne</SelectItem>
                    <SelectItem value="categories">Catégories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tendances mensuelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Évolution sur 5 mois</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                expenses: { label: "Dépenses", color: "#FF6B6B" },
                income: { label: "Revenus", color: "#2ECC71" },
                savings: { label: "Épargne", color: "#3498DB" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={expensesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke="#2ECC71"
                    fill="#2ECC71"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke="#FF6B6B"
                    fill="#FF6B6B"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    stackId="3"
                    stroke="#3498DB"
                    fill="#3498DB"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Analyses par catégorie et habitudes hebdomadaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Répartition par catégorie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Répartition des dépenses</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "Montant", color: "hsl(var(--chart-1))" },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Habitudes hebdomadaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Habitudes hebdomadaires</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  amount: { label: "Montant", color: "#2ECC71" },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyPattern}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="amount" fill="#2ECC71" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Progression des objectifs d'épargne */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Progression des objectifs d'épargne</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                target: { label: "Objectif", color: "#95A5A6" },
                actual: { label: "Réalisé", color: "#2ECC71" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={savingsProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="target" stroke="#95A5A6" strokeDasharray="5 5" name="Objectif" />
                  <Line type="monotone" dataKey="actual" stroke="#2ECC71" strokeWidth={3} name="Réalisé" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Insights et recommandations */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Insights et recommandations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === "positive"
                    ? "border-green-500 bg-green-50"
                    : insight.type === "warning"
                      ? "border-yellow-500 bg-yellow-50"
                      : insight.type === "tip"
                        ? "border-blue-500 bg-blue-50"
                        : "border-purple-500 bg-purple-50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{insight.icon}</span>
                  <div>
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-700">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Métriques détaillées */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-sm text-gray-600">Dépense moyenne/jour</p>
              <p className="text-xl font-bold">{formatCurrency(metrics.averageDaily)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm text-gray-600">Utilisation budget</p>
              <p className="text-xl font-bold">{metrics.budgetUsage}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-sm text-gray-600">Catégorie principale</p>
              <p className="text-lg font-bold">{metrics.topCategory}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-sm text-gray-600">Épargne totale</p>
              <p className="text-xl font-bold">{formatCurrency(metrics.totalSavings)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
