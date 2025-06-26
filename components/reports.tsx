"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, FileText, Calendar, TrendingUp, PieChart, BarChart3 } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useAppData } from "@/components/app-data-context"

// Importer les composants de chart
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts"

interface ReportsProps {
  onBack: () => void
}

interface Report {
  id: number
  title: string
  period: string
  type: "monthly" | "weekly" | "yearly"
  generatedDate: string
  size: string
  status: "ready" | "generating" | "error"
}

const mockReports: Report[] = [
  {
    id: 1,
    title: "Rapport Mensuel - Janvier 2025",
    period: "Janvier 2025",
    type: "monthly",
    generatedDate: "2025-01-25",
    size: "2.3 MB",
    status: "ready",
  },
  {
    id: 2,
    title: "Rapport Mensuel - Décembre 2024",
    period: "Décembre 2024",
    type: "monthly",
    generatedDate: "2025-01-01",
    size: "2.1 MB",
    status: "ready",
  },
  {
    id: 3,
    title: "Rapport Annuel - 2024",
    period: "2024",
    type: "yearly",
    generatedDate: "2025-01-01",
    size: "5.7 MB",
    status: "ready",
  },
  {
    id: 4,
    title: "Rapport Hebdomadaire - Semaine 4",
    period: "20-26 Jan 2025",
    type: "weekly",
    generatedDate: "2025-01-26",
    size: "1.2 MB",
    status: "generating",
  },
]

const monthlyStats = {
  totalIncome: 150000,
  totalExpenses: 89500,
  savings: 60500,
  topCategory: "Ndogou",
  transactionCount: 45,
  averageDaily: 2983,
  budgetUsage: 67,
  savingsGoal: 50000,
}

const expensesData = [
  { name: "Ndogou", value: 35000, fill: "#FF6B6B" },
  { name: "Transport", value: 25000, fill: "#4ECDC4" },
  { name: "Marché", value: 20000, fill: "#45B7D1" },
  { name: "Orange Money", value: 9500, fill: "#96CEB4" },
]

const monthlyTrend = [
  { month: "Sep", income: 140000, expenses: 85000 },
  { month: "Oct", income: 145000, expenses: 92000 },
  { month: "Nov", income: 148000, expenses: 87000 },
  { month: "Déc", income: 152000, expenses: 94000 },
  { month: "Jan", income: 150000, expenses: 89500 },
]

export function Reports({ onBack }: ReportsProps) {
  const { transactions } = useAppData()
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [selectedPeriod, setSelectedPeriod] = useState("current-month")
  const [reportType, setReportType] = useState("detailed")
  const [isGenerating, setIsGenerating] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "FCFA")
      .replace(/[\/\u202f\u00a0]/g, " ")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-100 text-green-800">✅ Prêt</Badge>
      case "generating":
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ En cours...</Badge>
      case "error":
        return <Badge variant="destructive">❌ Erreur</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const generateReport = () => {
    setIsGenerating(true)
    // Simuler la génération
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now(),
        title: `Rapport ${reportType} - ${selectedPeriod}`,
        period: selectedPeriod,
        type: "monthly",
        generatedDate: new Date().toISOString().split("T")[0],
        size: "2.1 MB",
        status: "ready",
      }
      setReports([newReport, ...reports])
      setIsGenerating(false)
    }, 3000)
  }

  const downloadReport = (reportId: number) => {
    // Simuler le téléchargement
    console.log(`Téléchargement du rapport ${reportId}`)
  }

  // Génération du PDF à partir des données du rapport
  const handleDownloadPDF = (report: Report) => {
    const doc = new jsPDF() as jsPDF & { lastAutoTable?: { finalY: number } };
    doc.setFontSize(18)
    doc.text(report.title, 14, 18)
    doc.setFontSize(12)
    doc.text(`Période : ${report.period}`, 14, 28)
    doc.text(`Date de génération : ${report.generatedDate}`, 14, 36)
    doc.text("Résumé :", 14, 48)
    doc.text(`Revenus : ${formatCurrency(monthlyStats.totalIncome)}`, 14, 56)
    doc.text(`Dépenses : ${formatCurrency(monthlyStats.totalExpenses)}`, 14, 64)
    doc.text(`Épargne : ${formatCurrency(monthlyStats.savings)}`, 14, 72)
    doc.text(`Transactions : ${monthlyStats.transactionCount}`, 14, 80)
    // Tableau des catégories
    autoTable(doc, {
      startY: 90,
      head: [["Catégorie", "Montant"]],
      body: expensesData.map((cat) => [cat.name, formatCurrency(cat.value)]),
    })
    // Tableau détaillé des transactions
    autoTable(doc, {
      startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 120,
      head: [["Date", "Type", "Catégorie", "Description", "Montant"]],
      body: (transactions as Array<any>).map((tx: any) => [
        tx.date,
        tx.type === "income" ? "Revenu" : "Dépense",
        tx.category,
        tx.description,
        formatCurrency(tx.amount),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [44, 204, 113] },
    })
    doc.save(`${report.title.replace(/\s+/g, "_")}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 dark:text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001f3f] to-[#2ECC71] text-white p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Rapports Financiers</h1>
        </div>

        {/* Résumé du mois actuel */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">📊 Résumé - Janvier 2025</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-90">Revenus</p>
                <p className="text-xl font-bold text-green-300">{formatCurrency(monthlyStats.totalIncome)}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Dépenses</p>
                <p className="text-xl font-bold text-red-300">{formatCurrency(monthlyStats.totalExpenses)}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Épargne</p>
                <p className="text-xl font-bold text-yellow-300">{formatCurrency(monthlyStats.savings)}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Transactions</p>
                <p className="text-xl font-bold">{monthlyStats.transactionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 space-y-6">
        {/* Générateur de rapport */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Générer un nouveau rapport</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Période</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-24 dark:bg-slate-800 dark:text-white dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Ce mois (Janvier)</SelectItem>
                    <SelectItem value="last-month">Mois dernier (Décembre)</SelectItem>
                    <SelectItem value="last-3-months">3 derniers mois</SelectItem>
                    <SelectItem value="current-year">Cette année (2025)</SelectItem>
                    <SelectItem value="last-year">Année dernière (2024)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Type de rapport</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-32 dark:bg-slate-800 dark:text-white dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="detailed">📋 Détaillé</SelectItem>
                    <SelectItem value="summary">📄 Résumé</SelectItem>
                    <SelectItem value="categories">📊 Par catégories</SelectItem>
                    <SelectItem value="trends">📈 Tendances</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full bg-[#2ECC71] hover:bg-[#27AE60] h-12"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Génération en cours...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Générer le rapport PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Aperçu visuel des données */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Graphique des dépenses */}
          <Card className="dark:bg-slate-800 dark:text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Répartition des dépenses</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Montant",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={expensesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {expensesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Tendance mensuelle */}
          <Card className="dark:bg-slate-800 dark:text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Évolution mensuelle</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  income: {
                    label: "Revenus",
                    color: "#2ECC71",
                  },
                  expenses: {
                    label: "Dépenses",
                    color: "#FF6B6B",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="income" fill="#2ECC71" name="Revenus" />
                    <Bar dataKey="expenses" fill="#FF6B6B" name="Dépenses" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Indicateurs clés */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Indicateurs clés de performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Taux d'épargne</span>
                  </div>
                  <span className="font-bold text-green-600">
                    {Math.round((monthlyStats.savings / monthlyStats.totalIncome) * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Dépense moyenne/jour</span>
                  </div>
                  <span className="font-bold text-blue-600">{formatCurrency(monthlyStats.averageDaily)}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-yellow-800">Utilisation du budget</span>
                    <span className="font-bold text-yellow-800">{monthlyStats.budgetUsage}%</span>
                  </div>
                  <Progress value={monthlyStats.budgetUsage} className="h-2" />
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">Objectif d'épargne</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-purple-800">{formatCurrency(monthlyStats.savings)}</span>
                    <span className="text-sm text-purple-600">/ {formatCurrency(monthlyStats.savingsGoal)}</span>
                  </div>
                  <Progress value={(monthlyStats.savings / monthlyStats.savingsGoal) * 100} className="h-2 mt-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des rapports */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Rapports générés</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.length === 0 && <p>Aucun rapport généré pour l'instant.</p>}
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                  <div>
                    <p className="font-semibold">{report.title}</p>
                    <p className="text-xs text-gray-500">Période : {report.period} • Généré le {report.generatedDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(report.status)}
                    {report.status === "ready" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(report)}
                        className="flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger le PDF
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conseils et informations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200 dark:bg-slate-800 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <FileText className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">À propos des rapports</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Rapports générés au format PDF</li>
                    <li>• Analyses complètes de vos finances</li>
                    <li>• Parfait pour le suivi budgétaire</li>
                    <li>• Conservés pendant 12 mois</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 dark:bg-slate-800 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Conseils d'analyse</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Comparez vos mois pour voir les tendances</li>
                    <li>• Identifiez vos plus gros postes de dépenses</li>
                    <li>• Fixez-vous des objectifs réalistes</li>
                    <li>• Célébrez vos progrès !</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
