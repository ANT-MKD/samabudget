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

  // Suggestions contextuelles par catégorie
  const categorySuggestions = {
    // Dépenses
    "Transport": ["Car rapide", "Taxi", "Essence", "Diesel", "Lavage voiture", "Réparation", "Assurance", "Parking"],
    "Ndogou": ["Repas midi", "Repas soir", "Petit déjeuner", "Restaurant", "Café", "Thé", "Snack", "Fruits"],
    "Marché": ["Légumes", "Fruits", "Viande", "Poisson", "Riz", "Huile", "Épices", "Produits ménagers"],
    "Facture Senelec": ["Facture électricité", "Ampoules", "Chargeurs", "Électroménager", "Climatisation"],
    "Orange Money": ["Recharge téléphone", "Transfert", "Paiement facture", "Achat crédit", "Orange Money"],
    "Santé": ["Médicaments", "Consultation médecin", "Analyses", "Dentiste", "Optique", "Pharmacie"],
    "Éducation": ["Frais scolarité", "Fournitures", "Cantine", "Transport scolaire", "Livres", "Cours"],
    "Loisirs": ["Cinéma", "Restaurant", "Sortie", "Jeux", "Sport", "Musique", "Théâtre", "Plage"],
    "Coiffure": ["Coupe", "Tressage", "Coloration", "Soins", "Shampoing", "Coiffure mariage"],
    "Vêtements": ["Habits", "Chaussures", "Accessoires", "Tailleur", "Uniforme", "Sous-vêtements"],
    "Essence": ["Essence", "Diesel", "Huile moteur", "Lavage", "Réparation", "Pneus"],
    "Électricité": ["Facture Senelec", "Ampoules", "Chargeurs", "Électroménager", "Climatisation"],
    "Eau": ["Facture SDE", "Eau minérale", "Filtres", "Réservoir", "Plomberie"],
    "Internet": ["Orange", "Free", "Expresso", "Wifi", "Abonnement internet"],
    "Médecine": ["Médicaments", "Consultation", "Analyses", "Dentiste", "Optique"],
    "École": ["Frais scolarité", "Fournitures", "Cantine", "Transport scolaire"],
    "Cadeaux": ["Anniversaire", "Mariage", "Baptême", "Fêtes", "Cadeau famille"],
    "Sport": ["Gym", "Football", "Natation", "Équipements", "Abonnement sport"],

    // Revenus
    "Salaire": ["Salaire mensuel", "Prime", "Bonus", "13ème mois", "Horaire supplémentaire"],
    "Business": ["Commerce", "Boutique", "Vente", "Services", "Produits"],
    "Freelance": ["Développement", "Design", "Rédaction", "Consultation", "Projet"],
    "Investissement": ["Actions", "Obligations", "Fonds", "Dividendes", "Placement"],
    "Location": ["Appartement", "Bureau", "Terrain", "Équipements", "Véhicule"],
    "Aide famille": ["Transfert", "Soutien", "Don", "Héritage", "Aide parent"],
    "Pension": ["Retraite", "Pension", "Allocation", "Aide sociale", "Sécurité sociale"],
    "Vente": ["Objet personnel", "Véhicule", "Immobilier", "Artisanat", "Produits"],
    "Commission": ["Courtage", "Inter médiaire", "Conseil", "Placement", "Vente"],
    "Autre revenu": ["Loterie", "Concours", "Cadeau", "Divers", "Autre"],
  }

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

  // Obtenir les suggestions contextuelles
  const getContextualSuggestions = () => {
    if (category && categorySuggestions[category as keyof typeof categorySuggestions]) {
      return categorySuggestions[category as keyof typeof categorySuggestions]
    }
    return descriptionSuggestions
  }

  // Suggestions de montants typiques par catégorie
  const amountSuggestions = {
    // Dépenses
    "Transport": [150, 300, 500, 1000, 2500, 5000],
    "Ndogou": [500, 1000, 1500, 2000, 3000, 5000],
    "Marché": [1000, 2000, 5000, 10000, 15000, 25000],
    "Facture Senelec": [5000, 10000, 15000, 20000, 25000, 35000],
    "Orange Money": [500, 1000, 2000, 5000, 10000],
    "Santé": [1000, 2000, 5000, 10000, 15000, 25000],
    "Éducation": [5000, 10000, 15000, 25000, 50000, 100000],
    "Loisirs": [1000, 2000, 5000, 10000, 15000, 25000],
    "Coiffure": [1000, 2000, 5000, 10000, 15000],
    "Vêtements": [2000, 5000, 10000, 15000, 25000, 50000],
    "Essence": [1000, 2000, 5000, 10000, 15000],
    "Électricité": [5000, 10000, 15000, 20000, 25000],
    "Eau": [2000, 5000, 10000, 15000],
    "Internet": [5000, 10000, 15000, 20000],
    "Médecine": [1000, 2000, 5000, 10000, 15000],
    "École": [5000, 10000, 15000, 25000, 50000],
    "Cadeaux": [1000, 2000, 5000, 10000, 15000, 25000],
    "Sport": [1000, 2000, 5000, 10000, 15000],

    // Revenus
    "Salaire": [50000, 75000, 100000, 150000, 200000, 300000],
    "Business": [10000, 25000, 50000, 100000, 150000, 250000],
    "Freelance": [15000, 30000, 50000, 75000, 100000, 150000],
    "Investissement": [5000, 10000, 25000, 50000, 100000],
    "Location": [25000, 50000, 75000, 100000, 150000, 200000],
    "Aide famille": [5000, 10000, 25000, 50000, 75000],
    "Pension": [25000, 50000, 75000, 100000],
    "Vente": [5000, 10000, 25000, 50000, 100000, 250000],
    "Commission": [5000, 10000, 25000, 50000, 75000],
    "Autre revenu": [1000, 5000, 10000, 25000, 50000],
  }

  const getAmountSuggestions = () => {
    if (category && amountSuggestions[category as keyof typeof amountSuggestions]) {
      return amountSuggestions[category as keyof typeof amountSuggestions]
    }
    return [1000, 2000, 5000, 10000, 15000, 25000, 50000, 100000]
  }

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

              {/* Suggestions de montants typiques */}
              {category && (
                <div className="mt-3">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Montants typiques pour {category} :
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {getAmountSuggestions().map((suggestedAmount) => (
                      <Button
                        key={suggestedAmount}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(String(suggestedAmount))}
                        className="text-xs h-8 px-2 hover:bg-green-50 border-green-200"
                      >
                        {formatCurrency(String(suggestedAmount))}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
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
              <Label htmlFor="description" className="text-lg font-semibold">Nom de la {type === "expense" ? "dépense" : "revenu"}</Label>
              
              {/* Suggestions contextuelles si une catégorie est sélectionnée */}
              {category && (
                <div className="mb-3">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Suggestions pour {category} :
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {getContextualSuggestions().slice(0, 6).map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => setDescription(suggestion)}
                        className="text-xs h-8 px-2 hover:bg-green-50 border-green-200"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Command>
                <CommandInput placeholder={`Ex: ${getContextualSuggestions()[0] || "Courses, Salaire, Transfert..."}`} />
                <CommandList>
                  {getContextualSuggestions().length === 0 && <CommandEmpty>Aucune suggestion</CommandEmpty>}
                  {getContextualSuggestions().map((suggestion) => (
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
