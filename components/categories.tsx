"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { useAppData, Category } from "@/components/app-data-context"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface CategoriesProps {
  onBack: () => void
}

const defaultCategories: Category[] = [
  { id: 1, name: "Transport", icon: "🚌", color: "bg-blue-100", type: "expense", isDefault: true },
  { id: 2, name: "Ndogou", icon: "🍽️", color: "bg-orange-100", type: "expense", isDefault: true },
  { id: 3, name: "Marché", icon: "🛒", color: "bg-green-100", type: "expense", isDefault: true },
  { id: 4, name: "Facture Senelec", icon: "⚡", color: "bg-yellow-100", type: "expense", isDefault: true },
  { id: 5, name: "Orange Money", icon: "📱", color: "bg-orange-100", type: "expense", isDefault: true },
  { id: 6, name: "Santé", icon: "🏥", color: "bg-red-100", type: "expense", isDefault: true },
  { id: 7, name: "Éducation", icon: "📚", color: "bg-purple-100", type: "expense", isDefault: true },
  { id: 8, name: "Loisirs", icon: "🎮", color: "bg-pink-100", type: "expense", isDefault: true },
  { id: 9, name: "Salaire", icon: "💰", color: "bg-green-100", type: "income", isDefault: true },
  { id: 10, name: "Business", icon: "💼", color: "bg-blue-100", type: "income", isDefault: true },
  { id: 11, name: "Freelance", icon: "💻", color: "bg-purple-100", type: "income", isDefault: true },
]

export function Categories({ onBack }: CategoriesProps) {
  const { categories, addCategory, deleteCategory, updateCategory } = useAppData()
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense")
  const [isAdding, setIsAdding] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "📝",
    color: "bg-gray-100",
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{ name: string; icon: string; color: string }>({ name: "", icon: "", color: "" })
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const availableIcons = ["📝", "🎯", "🏠", "🚗", "✈️", "🎵", "📖", "💡", "🎨", "⚽", "🍕", "☕", "🛍️", "💊", "🔧", "📞"]
  const availableColors = [
    "bg-red-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-gray-100",
  ]

  const filteredCategories = categories.filter((c: Category) => c.type === activeTab)

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      addCategory({
        name: newCategory.name,
        icon: newCategory.icon,
        color: newCategory.color,
        type: activeTab,
      })
      setNewCategory({ name: "", icon: "📝", color: "bg-gray-100" })
      setIsAdding(false)
    }
  }

  const handleDeleteCategory = (id: number) => {
    setDeleteConfirmId(id)
  }

  const confirmDeleteCategory = () => {
    if (deleteConfirmId !== null) {
      deleteCategory(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setEditValues({ name: category.name, icon: category.icon, color: category.color })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValues({ name: "", icon: "", color: "" })
  }

  const saveEdit = (id: number) => {
    updateCategory(id, { ...editValues })
    setEditingId(null)
    setEditValues({ name: "", icon: "", color: "" })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 dark:text-white">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Gérer les catégories</h1>
        </div>
      </div>

      <div className="p-6 pb-32">
        {/* Tabs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant={activeTab === "expense" ? "default" : "outline"}
            onClick={() => setActiveTab("expense")}
            className={
              activeTab === "expense" ? "bg-red-500 hover:bg-red-600" : "border-red-200 text-red-600 hover:bg-red-50"
            }
          >
            💸 Dépenses ({categories.filter((c: Category) => c.type === "expense").length})
          </Button>
          <Button
            variant={activeTab === "income" ? "default" : "outline"}
            onClick={() => setActiveTab("income")}
            className={
              activeTab === "income"
                ? "bg-green-500 hover:bg-green-600"
                : "border-green-200 text-green-600 hover:bg-green-50"
            }
          >
            💰 Revenus ({categories.filter((c: Category) => c.type === "income").length})
          </Button>
        </div>

        {/* Bouton d'ajout */}
        <Button onClick={() => setIsAdding(true)} className="w-full mb-6 bg-[#2ECC71] hover:bg-[#27AE60] h-12">
          <Plus className="w-5 h-5 mr-2" />
          Ajouter une catégorie
        </Button>

        {/* Formulaire d'ajout */}
        {isAdding && (
          <Card className="mb-6 border-2 border-[#2ECC71] dark:bg-slate-800 dark:text-white">
            <CardHeader>
              <CardTitle>Nouvelle catégorie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="categoryName">Nom de la catégorie</Label>
                <Input
                  id="categoryName"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Ex: Coiffure, Essence..."
                  className="mt-1 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                />
              </div>

              <div>
                <Label>Icône</Label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {availableIcons.map((icon) => (
                    <Button
                      key={icon}
                      variant={newCategory.icon === icon ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewCategory({ ...newCategory, icon })}
                      className="h-10"
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Couleur</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {availableColors.map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      size="sm"
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={`h-10 ${color} ${newCategory.color === color ? "ring-2 ring-[#2ECC71]" : ""}`}
                    >
                      {newCategory.color === color && "✓"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleAddCategory} className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60]">
                  Ajouter
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des catégories */}
        <div className="space-y-3">
          {filteredCategories.map((category: Category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow dark:bg-slate-800 dark:text-white">
              <CardContent className="p-4">
                {editingId === category.id ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${editValues.color} rounded-full flex items-center justify-center`}>
                        <span className="text-xl">{editValues.icon}</span>
                      </div>
                      <div>
                        <input
                          className="border rounded px-2 py-1 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                          value={editValues.name}
                          onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))}
                        />
                        <div className="flex items-center space-x-2 mt-1">
                          <select
                            value={editValues.icon}
                            onChange={e => setEditValues(v => ({ ...v, icon: e.target.value }))}
                            className="border rounded px-1 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                          >
                            {["📝", "🎯", "🏠", "🚗", "✈️", "🎵", "📖", "💡", "🎨", "⚽", "🍕", "☕", "🛒", "💊", "🔧", "📞"].map(icon => (
                              <option key={icon} value={icon}>{icon}</option>
                            ))}
                          </select>
                          <select
                            value={editValues.color}
                            onChange={e => setEditValues(v => ({ ...v, color: e.target.value }))}
                            className="border rounded px-1 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                          >
                            {["bg-red-100", "bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-purple-100", "bg-pink-100", "bg-indigo-100", "bg-gray-100"].map(color => (
                              <option key={color} value={color}>{color.replace("bg-", "")}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={cancelEdit}>Annuler</Button>
                      <Button variant="default" size="sm" onClick={() => saveEdit(category.id)}>Valider</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center`}>
                        <span className="text-xl">{category.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={category.type === "expense" ? "destructive" : "default"} className="text-xs">
                            {category.type === "expense" ? "Dépense" : "Revenu"}
                          </Badge>
                          {category.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Par défaut
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="text-gray-500" onClick={() => startEdit(category)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300 dark:bg-slate-800 dark:text-white">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">Aucune catégorie</h3>
              <p className="text-gray-600">
                Ajoutez votre première catégorie de {activeTab === "expense" ? "dépense" : "revenu"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Confirmation suppression */}
        <Dialog open={deleteConfirmId !== null} onOpenChange={open => !open && setDeleteConfirmId(null)}>
          <DialogContent className="max-w-sm dark:bg-slate-800 dark:text-white">
            <DialogTitle className="sr-only">Supprimer la catégorie</DialogTitle>
            <div className="text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">Supprimer la catégorie ?</h3>
              <p className="text-gray-600 mb-4">Cette action est irréversible. Les transactions associées seront marquées "Sans catégorie".</p>
              <div className="flex space-x-2 justify-center">
                <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Annuler</Button>
                <Button variant="destructive" onClick={confirmDeleteCategory}>Supprimer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
