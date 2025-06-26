"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus } from "lucide-react"
import { useAppData, Category } from "@/components/app-data-context"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command"
import { toast } from "@/components/ui/use-toast"

interface AddTransactionProps {
  onBack: () => void
}

const categories = {
  expense: [
    { name: "Transport", icon: "🚌", color: "bg-blue-100" },
    { name: "Ndogou", icon: "🍽️", color: "bg-orange-100" },
    { name: "Marché", icon: "🛒", color: "bg-green-100" },
    { name: "Facture Senelec", icon: "⚡", color: "bg-yellow-100" },
    { name: "Orange Money", icon: "📱", color: "bg-orange-100" },
    { name: "Santé", icon: "🏥", color: "bg-red-100" },
    { name: "Éducation", icon: "📚", color: "bg-purple-100" },
    { name: "Loisirs", icon: "🎮", color: "bg-pink-100" },
  ],
  income: [
    { name: "Salaire", icon: "💰", color: "bg-green-100" },
    { name: "Business", icon: "💼", color: "bg-blue-100" },
    { name: "Freelance", icon: "💻", color: "bg-purple-100" },
    { name: "Aide famille", icon: "👨‍👩‍👧‍👦", color: "bg-yellow-100" },
    { name: "Autre", icon: "💸", color: "bg-gray-100" },
  ],
}

export function AddTransaction({ onBack }: AddTransactionProps) {
  const { addTransaction, categories: contextCategories } = useAppData()
  const [type, setType] = useState<"expense" | "income">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [icon, setIcon] = useState("💸")
  const iconOptions = [
    "💸", "🚌", "🍽️", "🛒", "📱", "🏠", "🚗", "✈️", "🎵", "📖", "💡", "🎨", "⚽", "🍕", "☕", "🛍️", "💊", "🔧", "📞", "💰", "🎯"
  ]
  const descriptionSuggestions = [
    "Salaire",
    "Courses",
    "Transfert",
    "Facture Senelec",
    "Achat crédit",
    "Repas famille",
    "Essence",
    "Cadeau",
    "Loyer",
    "Business",
    "Freelance",
    "Aide famille",
    "Autre"
  ];

  const filteredCategories = contextCategories.filter((cat: Category) => cat.type === type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTransaction({
      type,
      amount: Number(amount.replace(/\D/g, "")),
      category,
      description,
      date,
      icon,
    })
    toast({
      title: "Succès",
      description: "Transaction ajoutée !",
    })
    onBack()
  }

  const formatCurrency = (value: string) => {
    const number = Number.parseInt(value.replace(/\D/g, ""))
    if (isNaN(number)) return ""
    return new Intl.NumberFormat("fr-FR").format(number)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Nouvelle transaction</h1>
        </div>
      </div>

      <div className="p-6 pb-32">
        {/* Type de transaction */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant={type === "expense" ? "default" : "outline"}
            onClick={() => setType("expense")}
            className={`h-16 ${type === "expense" ? "bg-red-500 hover:bg-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">💸</div>
              <div>Dépense</div>
            </div>
          </Button>
          <Button
            variant={type === "income" ? "default" : "outline"}
            onClick={() => setType("income")}
            className={`h-16 ${type === "income" ? "bg-green-500 hover:bg-green-600" : "border-green-200 text-green-600 hover:bg-green-50"}`}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">💰</div>
              <div>Revenu</div>
            </div>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Montant */}
          <Card>
            <CardContent className="p-6">
              <Label htmlFor="amount" className="text-lg font-semibold">
                Montant
              </Label>
              <div className="mt-2 relative">
                <Input
                  id="amount"
                  type="text"
                  value={formatCurrency(amount)}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="text-2xl font-bold h-16 pr-16 text-center"
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  FCFA
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Catégorie avec suggestions */}
          <Card>
            <CardContent className="p-6">
              <Label className="text-lg font-semibold mb-4 block">Catégorie</Label>
              <Command>
                <CommandInput placeholder="Rechercher une catégorie..." />
                <CommandList>
                  {filteredCategories.length === 0 && <CommandEmpty>Aucune catégorie</CommandEmpty>}
                  {filteredCategories.map((cat: Category) => (
                    <CommandItem
                      key={cat.name}
                      value={cat.name}
                      onSelect={() => setCategory(cat.name)}
                    >
                      <span className="mr-2">{cat.icon}</span>
                      {cat.name}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
              {category && (
                <div className="mt-2 text-sm text-green-700">Catégorie sélectionnée : <span className="font-bold">{category}</span></div>
              )}
              {/* Sélection d'icône personnalisée */}
              <div className="mt-4">
                <Label className="text-base font-semibold mb-2 block">Icône</Label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      className={`text-2xl p-1 rounded border ${icon === ic ? 'border-green-500 bg-green-100' : 'border-gray-200'}`}
                      onClick={() => setIcon(ic)}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm">Icône sélectionnée : <span className="text-2xl">{icon}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Description avec suggestions */}
          <Card>
            <CardContent className="p-6">
              <Label htmlFor="description" className="text-lg font-semibold">Nom de la dépense ou du revenu</Label>
              <Command>
                <CommandInput placeholder="Ex: Courses, Salaire, Transfert..." />
                <CommandList>
                  {descriptionSuggestions.length === 0 && <CommandEmpty>Aucune suggestion</CommandEmpty>}
                  {descriptionSuggestions.map((suggestion) => (
                    <CommandItem key={suggestion} value={suggestion} onSelect={() => setDescription(suggestion)}>
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ajoutez un nom ou une note (optionnel)"
                className="mt-2"
              />
            </CardContent>
          </Card>

          {/* Date */}
          <Card>
            <CardContent className="p-6">
              <Label htmlFor="date" className="text-lg font-semibold">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 h-12"
                required
              />
            </CardContent>
          </Card>

          {/* Bouton de soumission */}
          <Button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:from-[#27AE60] hover:to-[#2ECC71] text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 mt-4"
            disabled={!amount || !category}
          >
            <Plus className="w-5 h-5 mr-2" />
            Enregistrer la {type === "expense" ? "dépense" : "revenu"}
          </Button>
        </form>
      </div>
    </div>
  )
}
