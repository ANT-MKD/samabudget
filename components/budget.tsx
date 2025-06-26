"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, AlertTriangle, CheckCircle, Trash2 } from "lucide-react"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command"
import { useAppData, Category } from "@/components/app-data-context"

interface BudgetProps {
  onBack: () => void
}

interface BudgetItem {
  id: number
  category: string
  icon: string
  budgetAmount: number
  spentAmount: number
  color: string
}

const mockBudgets: BudgetItem[] = [
  { id: 1, category: "Ndogou", icon: "🍽️", budgetAmount: 40000, spentAmount: 35000, color: "bg-orange-100" },
  { id: 2, category: "Transport", icon: "🚌", budgetAmount: 30000, spentAmount: 25000, color: "bg-blue-100" },
  { id: 3, category: "Marché", icon: "🛒", budgetAmount: 25000, spentAmount: 20000, color: "bg-green-100" },
  { id: 4, category: "Orange Money", icon: "📱", budgetAmount: 15000, spentAmount: 9500, color: "bg-orange-100" },
  { id: 5, category: "Loisirs", icon: "🎮", budgetAmount: 20000, spentAmount: 22000, color: "bg-pink-100" },
]

export function Budget({ onBack }: BudgetProps) {
  const [budgets, setBudgets] = useState<BudgetItem[]>(mockBudgets)
  const [isAdding, setIsAdding] = useState(false)
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{ category: string; amount: string; icon: string; color: string }>({ category: "", amount: "", icon: "", color: "" })
  const { categories } = useAppData()
  const expenseCategories = categories.filter((cat: Category) => cat.type === "expense")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "FCFA")
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500"
    if (percentage >= 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStatusBadge = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100
    if (percentage >= 100) {
      return (
        <Badge variant="destructive" className="text-xs">
          Dépassé
        </Badge>
      )
    }
    if (percentage >= 80) {
      return (
        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
          Attention
        </Badge>
      )
    }
    return (
      <Badge variant="default" className="text-xs bg-green-100 text-green-800">
        OK
      </Badge>
    )
  }

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budgetAmount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spentAmount, 0)

  const startEdit = (budget: BudgetItem) => {
    setEditingId(budget.id)
    setEditValues({ category: budget.category, amount: String(budget.budgetAmount), icon: budget.icon, color: budget.color })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValues({ category: "", amount: "", icon: "", color: "" })
  }

  const saveEdit = (id: number) => {
    setBudgets((prev) => prev.map((b) => b.id === id ? { ...b, category: editValues.category, budgetAmount: Number(editValues.amount), icon: editValues.icon, color: editValues.color } : b))
    setEditingId(null)
    setEditValues({ category: "", amount: "", icon: "", color: "" })
  }

  const deleteBudget = (id: number) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 dark:text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001f3f] to-[#2ECC71] text-white p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Gestion du Budget</h1>
        </div>

        {/* Résumé global */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-90">Budget total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Dépensé</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progression globale</span>
                <span>{Math.round((totalSpent / totalBudget) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor((totalSpent / totalBudget) * 100)}`}
                  style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 space-y-6 pb-32">
        {/* Bouton d'ajout */}
        <Button onClick={() => setIsAdding(true)} className="w-full bg-[#2ECC71] hover:bg-[#27AE60] h-12">
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un budget
        </Button>

        {/* Formulaire d'ajout */}
        {isAdding && (
          <Card className="border-2 border-[#2ECC71]">
            <CardHeader>
              <CardTitle>Nouveau budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Command>
                  <CommandInput placeholder="Rechercher une catégorie..." />
                  <CommandList>
                    {expenseCategories.length === 0 && <CommandEmpty>Aucune catégorie</CommandEmpty>}
                    {expenseCategories.map((cat: Category) => (
                      <CommandItem key={cat.name} value={cat.name} onSelect={() => setNewBudget(b => ({ ...b, category: cat.name }))}>
                        <span className="mr-2">{cat.icon}</span>
                        {cat.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
                {newBudget.category && (
                  <div className="mt-2 text-sm text-green-700">Catégorie sélectionnée : <span className="font-bold">{newBudget.category}</span></div>
                )}
              </div>
              <div>
                <Label htmlFor="amount">Montant mensuel (FCFA)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                  placeholder="25000"
                  className="mt-1 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    // Logique d'ajout ici
                    setIsAdding(false)
                    setNewBudget({ category: "", amount: "" })
                  }}
                  className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60]"
                >
                  Ajouter
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des budgets */}
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = (budget.spentAmount / budget.budgetAmount) * 100
            const remaining = budget.budgetAmount - budget.spentAmount

            return (
              <Card key={budget.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {editingId === budget.id ? (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <Command>
                          <CommandInput placeholder="Rechercher une catégorie..." />
                          <CommandList>
                            {expenseCategories.length === 0 && <CommandEmpty>Aucune catégorie</CommandEmpty>}
                            {expenseCategories.map((cat: Category) => (
                              <CommandItem key={cat.name} value={cat.name} onSelect={() => setEditValues(v => ({ ...v, category: cat.name }))}>
                                <span className="mr-2">{cat.icon}</span>
                                {cat.name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                        <select
                          value={editValues.icon}
                          onChange={e => setEditValues(v => ({ ...v, icon: e.target.value }))}
                          className="border rounded px-1 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                        >
                          {["🍽️", "🚌", "🛒", "📱", "🎮", "🏠", "🚗", "✈️", "🎵", "📖", "💡", "🎨", "⚽", "🍕", "☕", "🛍️", "💊", "🔧", "📞"].map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                        <input
                          className="border rounded px-2 py-1 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                          value={editValues.category}
                          onChange={e => setEditValues(v => ({ ...v, category: e.target.value }))}
                        />
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-24"
                          value={editValues.amount}
                          onChange={e => setEditValues(v => ({ ...v, amount: e.target.value }))}
                        />
                        <select
                          value={editValues.color}
                          onChange={e => setEditValues(v => ({ ...v, color: e.target.value }))}
                          className="border rounded px-1"
                        >
                          {["bg-orange-100", "bg-blue-100", "bg-green-100", "bg-pink-100", "bg-yellow-100", "bg-purple-100", "bg-indigo-100", "bg-gray-100"].map(color => (
                            <option key={color} value={color}>{color.replace("bg-", "")}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex space-x-2 mt-2 md:mt-0">
                        <Button variant="outline" size="sm" onClick={cancelEdit}>Annuler</Button>
                        <Button variant="default" size="sm" onClick={() => saveEdit(budget.id)}>Valider</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${budget.color} rounded-full flex items-center justify-center`}>
                          <span className="text-xl">{budget.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{budget.category}</h3>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.budgetAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(budget.spentAmount, budget.budgetAmount)}
                        <Button variant="ghost" size="icon" onClick={() => startEdit(budget)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteBudget(budget.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Barre de progression */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span className={percentage >= 100 ? "text-red-600 font-semibold" : ""}>
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={remaining < 0 ? "text-red-600" : "text-green-600"}>
                        {remaining >= 0
                          ? `Reste: ${formatCurrency(remaining)}`
                          : `Dépassement: ${formatCurrency(Math.abs(remaining))}`}
                      </span>
                      {percentage >= 90 && (
                        <div className="flex items-center text-yellow-600">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          <span className="text-xs">Limite proche</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Conseils */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Conseils pour bien gérer votre budget</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Révisez vos budgets chaque mois</li>
                  <li>• Priorisez les dépenses essentielles (Ndogou, Transport)</li>
                  <li>• Gardez 10% pour les imprévus</li>
                  <li>• Utilisez les alertes pour éviter les dépassements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
