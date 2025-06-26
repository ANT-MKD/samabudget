"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { useAppData, Transaction } from "@/components/app-data-context"
import { endOfMonth, startOfMonth, subMonths, isWithinInterval, parseISO, format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StatisticsProps {
  onBack: () => void
}

export function Statistics({ onBack }: StatisticsProps) {
  const { transactions } = useAppData();
  const [selectedMonthA, setSelectedMonthA] = useState<number>(new Date().getMonth());
  const [selectedMonthB, setSelectedMonthB] = useState<number>(new Date().getMonth() - 1);
  const year = new Date().getFullYear();
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  // Déterminer les bornes des mois sélectionnés
  const startA = startOfMonth(new Date(year, selectedMonthA));
  const endA = endOfMonth(new Date(year, selectedMonthA));
  const startB = startOfMonth(new Date(year, selectedMonthB));
  const endB = endOfMonth(new Date(year, selectedMonthB));

  // Filtrer les transactions par période
  const txA = transactions.filter((tx: Transaction) => isWithinInterval(parseISO(tx.date), { start: startA, end: endA }) && tx.type === "expense");
  const txB = transactions.filter((tx: Transaction) => isWithinInterval(parseISO(tx.date), { start: startB, end: endB }) && tx.type === "expense");

  // Calcul des totaux
  const totalA = txA.reduce((sum: number, tx: Transaction) => sum + tx.amount, 0);
  const totalB = txB.reduce((sum: number, tx: Transaction) => sum + tx.amount, 0);
  const change = totalB === 0 ? 0 : Math.round(((totalA - totalB) / totalB) * 100 * 10) / 10;

  // Top catégories ce mois
  const categoryMap: { [cat: string]: number } = {};
  txA.forEach((tx: Transaction) => { categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount; });
  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, amount]) => ({ name, amount, percentage: Math.round((amount / totalA) * 100) }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "FCFA")
  }

  const maxAmount = Math.max(...txA.map((d: Transaction) => d.amount))

  // Générer les données d'évolution mensuelle sur 12 mois
  const monthlyEvolution = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(year, i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const total = transactions.filter((tx: Transaction) => isWithinInterval(parseISO(tx.date), { start, end }) && tx.type === "expense").reduce((sum: number, tx: Transaction) => sum + tx.amount, 0);
    return { month: months[i].slice(0, 3), total };
  });

  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 dark:text-white">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Statistiques</h1>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Comparaison mensuelle */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Comparaison de périodes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4 items-center justify-center">
              <div>
                <label className="block text-xs mb-1">Période A</label>
                <select
                  className="border rounded px-3 py-2 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                  value={selectedMonthA}
                  onChange={e => setSelectedMonthA(Number(e.target.value))}
                >
                  {months.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1">Période B</label>
                <select
                  className="border rounded px-3 py-2 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                  value={selectedMonthB}
                  onChange={e => setSelectedMonthB(Number(e.target.value))}
                >
                  {months.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">{months[selectedMonthA]}</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalA)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">{months[selectedMonthB]}</p>
                <p className="text-2xl font-bold text-gray-600">{formatCurrency(totalB)}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${change > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                {change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-semibold">{change > 0 ? "+" : ""}{change}%</span>
              </div>
              {change > 10 && (
                <span className="inline-block bg-red-200 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">Attention : forte hausse</span>
              )}
              {change < -10 && (
                <span className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Dépense maîtrisée</span>
              )}
              {change <= 10 && change >= -10 && (
                <span className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">Stable</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Graphique d'évolution mensuelle */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Évolution des dépenses (12 mois)</span>
              </CardTitle>
              <Select value={chartType} onValueChange={v => setChartType(v as 'bar' | 'pie' | 'line')}>
                <SelectTrigger className="w-28">
                  <SelectValue>{chartType === 'bar' ? '📊 Barres' : chartType === 'pie' ? '🥧 Camembert' : '📈 Lignes'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">📊 Barres</SelectItem>
                  <SelectItem value="pie">🥧 Camembert</SelectItem>
                  <SelectItem value="line">📈 Lignes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              let chart: React.ReactElement = <div />;
              if (chartType === 'bar') {
                chart = (
                  <BarChart data={monthlyEvolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="total" fill="#2ECC71" radius={[4, 4, 0, 0]} />
                  </BarChart>
                );
              } else if (chartType === 'pie') {
                chart = (
                  <RechartsPieChart>
                    <Pie
                      data={monthlyEvolution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="total"
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    >
                      {monthlyEvolution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 30}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </RechartsPieChart>
                );
              } else if (chartType === 'line') {
                chart = (
                  <LineChart data={monthlyEvolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="total" stroke="#2ECC71" strokeWidth={3} />
                  </LineChart>
                );
              }
              return <ResponsiveContainer width="100%" height={220}>{chart}</ResponsiveContainer>;
            })()}
          </CardContent>
        </Card>

        {/* Graphique hebdomadaire */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Dépenses de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {txA.map((tx: Transaction, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 text-sm font-medium">{format(parseISO(tx.date), "EEE", { locale: fr })}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] h-6 rounded-full transition-all duration-500"
                      style={{ width: `${(tx.amount / maxAmount) * 100}%` }}
                    />
                  </div>
                  <div className="w-20 text-sm font-semibold text-right">{formatCurrency(tx.amount)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top catégories */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Top catégories ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#2ECC71] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(category.amount)}</p>
                    <p className="text-sm text-gray-500">{category.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message pour les fonctionnalités à venir */}
        <Card className="border-dashed border-2 border-gray-300 dark:bg-slate-800 dark:text-white">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold mb-2">Plus de statistiques bientôt !</h3>
            <p className="text-gray-600">Prédictions de budget, alertes intelligentes, et bien plus encore...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
