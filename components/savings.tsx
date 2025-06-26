"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, TrendingUp, Trash2 } from "lucide-react"
import { useAppData, SavingsGoal } from "@/components/app-data-context"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command"

interface SavingsProps {
  onBack: () => void
}

const mockSavingsGoals: SavingsGoal[] = [
  {
    id: 1,
    title: "Nouveau téléphone",
    targetAmount: 150000,
    currentAmount: 85000,
    deadline: "2025-06-01",
    icon: "📱",
    color: "bg-blue-100",
    category: "Technologie",
  },
  {
    id: 2,
    title: "Voyage à Saly",
    targetAmount: 200000,
    currentAmount: 45000,
    deadline: "2025-08-15",
    icon: "🏖️",
    color: "bg-yellow-100",
    category: "Voyage",
  },
  {
    id: 3,
    title: "Fonds d'urgence",
    targetAmount: 300000,
    currentAmount: 180000,
    deadline: "2025-12-31",
    icon: "🛡️",
    color: "bg-green-100",
    category: "Sécurité",
  },
  {
    id: 4,
    title: "Formation en ligne",
    targetAmount: 75000,
    currentAmount: 75000,
    deadline: "2025-03-01",
    icon: "📚",
    color: "bg-purple-100",
    category: "Éducation",
  },
]

export function Savings({ onBack }: SavingsProps) {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useAppData()
  const [isAdding, setIsAdding] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
    icon: "🎯",
  })
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null)
  const [editGoal, setEditGoal] = useState<{ title: string; targetAmount: string; deadline: string; icon: string }>({ title: "", targetAmount: "", deadline: "", icon: "" })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "FCFA")
  }

  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500"
    if (percentage >= 75) return "bg-blue-500"
    if (percentage >= 50) return "bg-yellow-500"
    return "bg-gray-400"
  }

  const totalTarget = savingsGoals.reduce((sum: number, goal: SavingsGoal) => sum + goal.targetAmount, 0)
  const totalSaved = savingsGoals.reduce((sum: number, goal: SavingsGoal) => sum + goal.currentAmount, 0)
  const completedGoals = savingsGoals.filter((goal: SavingsGoal) => goal.currentAmount >= goal.targetAmount).length

  const availableIcons = ["🎯", "📱", "🏠", "🚗", "✈️", "💍", "🎓", "💻", "🏖️", "🛡️", "📚", "🎮"]

  const savingsSuggestions = [
    "Nouveau téléphone",
    "Voyage",
    "Fonds d'urgence",
    "Formation",
    "Voiture",
    "Mariage",
    "Maison",
    "Investissement",
    "Cadeau",
    "Santé",
    "Autre"
  ];

  const handleAddGoal = () => {
    if (newGoal.title.trim() && newGoal.targetAmount && newGoal.deadline) {
      addSavingsGoal({
        title: newGoal.title,
        targetAmount: Number(newGoal.targetAmount),
        deadline: newGoal.deadline,
        icon: newGoal.icon,
        color: "bg-green-100",
        category: "Autre",
      });
      setIsAdding(false);
      setNewGoal({ title: "", targetAmount: "", deadline: "", icon: "🎯" });
    }
  };

  const startEdit = (goal: SavingsGoal) => {
    setEditingGoalId(goal.id);
    setEditGoal({ title: goal.title, targetAmount: String(goal.targetAmount), deadline: goal.deadline, icon: goal.icon });
  };

  const cancelEdit = () => {
    setEditingGoalId(null);
    setEditGoal({ title: "", targetAmount: "", deadline: "", icon: "" });
  };

  const saveEdit = (id: number) => {
    updateSavingsGoal(id, {
      title: editGoal.title,
      targetAmount: Number(editGoal.targetAmount),
      deadline: editGoal.deadline,
      icon: editGoal.icon,
    });
    setEditingGoalId(null);
    setEditGoal({ title: "", targetAmount: "", deadline: "", icon: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001f3f] to-[#2ECC71] text-white p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Mes Objectifs d'Épargne</h1>
        </div>

        {/* Résumé global */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm opacity-90">Objectifs</p>
                <p className="text-2xl font-bold">{savingsGoals.length}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Complétés</p>
                <p className="text-2xl font-bold text-green-300">{completedGoals}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Progression</p>
                <p className="text-2xl font-bold">{Math.round((totalSaved / totalTarget) * 100)}%</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Total épargné: {formatCurrency(totalSaved)}</span>
                <span>Objectif: {formatCurrency(totalTarget)}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-green-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%` }}
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
          Nouvel objectif d'épargne
        </Button>

        {/* Formulaire d'ajout */}
        {isAdding && (
          <Card className="border-2 border-[#2ECC71]">
            <CardHeader>
              <CardTitle>Nouvel objectif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de l'objectif</Label>
                <Command>
                  <CommandInput placeholder="Rechercher un objectif..." />
                  <CommandList>
                    {savingsSuggestions.length === 0 && <CommandEmpty>Aucune suggestion</CommandEmpty>}
                    {savingsSuggestions.map((suggestion) => (
                      <CommandItem key={suggestion} value={suggestion} onSelect={() => setNewGoal(g => ({ ...g, title: suggestion }))}>
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Ex: Nouveau laptop, Voyage..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="amount">Montant cible (FCFA)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  placeholder="100000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="deadline">Date limite</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Icône</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {availableIcons.map((icon) => (
                    <Button
                      key={icon}
                      variant={newGoal.icon === icon ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewGoal({ ...newGoal, icon })}
                      className="h-10"
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleAddGoal}
                  className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60]"
                >
                  Créer l'objectif
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des objectifs */}
        <div className="space-y-4">
          {savingsGoals.map((goal: SavingsGoal) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100
            const remaining = goal.targetAmount - goal.currentAmount
            const daysRemaining = calculateDaysRemaining(goal.deadline)
            const isCompleted = goal.currentAmount >= goal.targetAmount

            return (
              <Card
                key={goal.id}
                className={`hover:shadow-md transition-shadow ${isCompleted ? "border-green-500 bg-green-50" : ""}`}
              >
                <CardContent className="p-6">
                  {editingGoalId === goal.id ? (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <Command>
                          <CommandInput placeholder="Rechercher un objectif..." />
                          <CommandList>
                            {savingsSuggestions.length === 0 && <CommandEmpty>Aucune suggestion</CommandEmpty>}
                            {savingsSuggestions.map((suggestion) => (
                              <CommandItem key={suggestion} value={suggestion} onSelect={() => setEditGoal(v => ({ ...v, title: suggestion }))}>
                                {suggestion}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                        <select
                          value={editGoal.icon}
                          onChange={e => setEditGoal(v => ({ ...v, icon: e.target.value }))}
                          className="border rounded px-1"
                        >
                          {availableIcons.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                        <input
                          className="border rounded px-2 py-1"
                          value={editGoal.title}
                          onChange={e => setEditGoal(v => ({ ...v, title: e.target.value }))}
                        />
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-24"
                          value={editGoal.targetAmount}
                          onChange={e => setEditGoal(v => ({ ...v, targetAmount: e.target.value }))}
                        />
                        <input
                          type="date"
                          className="border rounded px-2 py-1"
                          value={editGoal.deadline}
                          onChange={e => setEditGoal(v => ({ ...v, deadline: e.target.value }))}
                        />
                      </div>
                      <div className="flex space-x-2 mt-2 md:mt-0">
                        <Button variant="outline" size="sm" onClick={cancelEdit}>Annuler</Button>
                        <Button variant="default" size="sm" onClick={() => saveEdit(goal.id)}>Valider</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${goal.color} rounded-full flex items-center justify-center`}>
                          <span className="text-2xl">{goal.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium">{goal.title}</p>
                          <div className="flex items-center space-x-2 text-xs">
                            <span>Objectif : {formatCurrency(goal.targetAmount)}</span>
                            <span>•</span>
                            <span>Limite : {goal.deadline}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs mt-1 text-gray-600">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)} ({Math.round((goal.currentAmount / goal.targetAmount) * 100)}%)</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="text-gray-500" onClick={() => startEdit(goal)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3zm0 0v3a2 2 0 002 2h3" /></svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteSavingsGoal(goal.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Conseils d'épargne */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-6 h-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Conseils pour épargner efficacement</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Épargnez automatiquement 10% de vos revenus</li>
                  <li>• Fixez-vous des objectifs réalistes et mesurables</li>
                  <li>• Célébrez vos petites victoires</li>
                  <li>• Révisez vos objectifs tous les 3 mois</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
