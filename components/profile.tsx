"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Bell, Moon, Globe, Download, Trash2, LogOut, Info } from "lucide-react"
import { HelpPage } from "@/components/help-page"
import jsPDF from "jspdf"

interface ProfileProps {
  onBack: () => void
  onLogout?: () => void
}

export function Profile({ onBack, onLogout }: ProfileProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState("fr")
  const [name, setName] = useState("Utilisateur SamaBudget")
  const [email, setEmail] = useState("user@samabudget.sn")
  const [showHelp, setShowHelp] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "FCFA")
  }

  const stats = {
    totalTransactions: 156,
    totalSaved: 45000,
    accountAge: "3 mois",
    favoriteCategory: "Ndogou",
  }

  const themeOptions = [
    { name: "Vert", value: "theme-green", color: "bg-green-500" },
    { name: "Bleu", value: "theme-blue", color: "bg-blue-500" },
    { name: "Violet", value: "theme-purple", color: "bg-purple-500" },
    { name: "Rose", value: "theme-pink", color: "bg-pink-500" },
    { name: "Jaune", value: "theme-yellow", color: "bg-yellow-400" },
  ]
  const avatarOptions = [
    "/public/placeholder-user.jpg",
    "https://api.dicebear.com/7.x/bottts/svg?seed=User1",
    "https://api.dicebear.com/7.x/bottts/svg?seed=User2",
    "https://api.dicebear.com/7.x/bottts/svg?seed=User3",
    "https://api.dicebear.com/7.x/bottts/svg?seed=User4",
  ]
  const [theme, setTheme] = useState(() => localStorage.getItem("samabudget-theme") || "theme-green")
  const [avatar, setAvatar] = useState(() => localStorage.getItem("samabudget-avatar") || avatarOptions[0])
  const [customAvatar, setCustomAvatar] = useState<string | null>(null)

  useEffect(() => {
    document.body.classList.remove(...themeOptions.map(t => t.value))
    document.body.classList.add(theme)
    localStorage.setItem("samabudget-theme", theme)
  }, [theme])

  useEffect(() => {
    if (customAvatar) {
      setAvatar(customAvatar)
      localStorage.setItem("samabudget-avatar", customAvatar)
    } else {
      localStorage.setItem("samabudget-avatar", avatar)
    }
  }, [avatar, customAvatar])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("samabudget-darkmode", "1")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("samabudget-darkmode", "0")
    }
  }, [darkMode])

  const handleStartTutorial = () => {
    alert("Tutoriel interactif : cliquez sur les boutons +, filtrez, testez la personnalisation, etc.")
  }

  // Sauvegarde nom/email
  const handleSave = () => {
    localStorage.setItem("samabudget-name", name)
    localStorage.setItem("samabudget-email", email)
    alert("Profil sauvegardé !")
  }

  // Export PDF
  const handleExport = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("Profil SamaBudget", 14, 18)
    doc.setFontSize(12)
    doc.text(`Nom : ${name}`, 14, 30)
    doc.text(`Email : ${email}`, 14, 38)
    doc.text(`Thème : ${themeOptions.find(t => t.value === theme)?.name || theme}`, 14, 46)
    doc.text(`Notifications : ${notifications ? "Oui" : "Non"}`, 14, 54)
    doc.text(`Mode sombre : ${darkMode ? "Oui" : "Non"}`, 14, 62)
    doc.text(`Langue : ${language}`, 14, 70)
    if (avatar) doc.text(`Avatar : ${avatar}`, 14, 78)
    if (customAvatar) doc.text(`Avatar personnalisé : oui`, 14, 86)
    doc.save("samabudget-profil.pdf")
  }

  // Suppression du compte
  const handleDelete = () => {
    if (confirm("Supprimer votre compte ? Cette action est irréversible.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  // Déconnexion
  const handleLogout = () => {
    if (onLogout) onLogout()
    else window.location.reload()
  }

  if (showHelp) {
    return <HelpPage onBack={() => setShowHelp(false)} onStartTutorial={handleStartTutorial} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001f3f] to-[#2ECC71] text-white p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Mon Profil</h1>
        </div>

        {/* Photo de profil et infos */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
            {avatar.startsWith("http") || avatar.startsWith("/public") ? (
              <img src={avatar.replace("/public", "/")} alt="avatar" className="w-16 h-16 object-cover rounded-full" />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="opacity-90">{email}</p>
            <p className="text-sm opacity-75">Membre depuis {stats.accountAge}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Statistiques rapides */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Mes statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-blue-900">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{stats.totalTransactions}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Transactions</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-900">
                <p className="text-2xl font-bold text-green-600 dark:text-green-300">{formatCurrency(stats.totalSaved)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Économisé</p>
              </div>
            </div>
            <div className="mt-4 text-center p-4 bg-yellow-50 rounded-lg dark:bg-yellow-900">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">Catégorie préférée: {stats.favoriteCategory} 🍽️</p>
            </div>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button className="w-full bg-[#2ECC71] hover:bg-[#27AE60]" onClick={handleSave}>Sauvegarder les modifications</Button>
          </CardContent>
        </Card>

        {/* Paramètres */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Paramètres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-gray-500">Alertes de budget et rappels</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <Separator />

            {/* Mode sombre */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Mode sombre</p>
                  <p className="text-sm text-gray-500">Interface sombre automatique</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <Separator />

            {/* Langue */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Langue</p>
                  <p className="text-sm text-gray-500">Français (Wolof bientôt disponible)</p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                🇸🇳 FR
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personnalisation */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Personnalisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Thème de couleurs */}
            <div>
              <Label>Thème de couleurs</Label>
              <div className="flex space-x-2 mt-2">
                {themeOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={`w-10 h-10 rounded-full border-2 ${opt.color} ${theme === opt.value ? "ring-2 ring-black" : ""}`}
                    onClick={() => setTheme(opt.value)}
                    aria-label={opt.name}
                  />
                ))}
              </div>
            </div>
            {/* Avatar */}
            <div>
              <Label>Avatar</Label>
              <div className="flex space-x-2 mt-2 items-center">
                {avatarOptions.map(opt => (
                  <button
                    key={opt}
                    className={`w-12 h-12 rounded-full border-2 overflow-hidden ${avatar === opt ? "ring-2 ring-[#2ECC71]" : ""}`}
                    onClick={() => { setAvatar(opt); setCustomAvatar(null); }}
                    aria-label="Choisir avatar"
                  >
                    <img src={opt.replace("/public", "/")} alt="avatar" className="w-12 h-12 object-cover rounded-full" />
                  </button>
                ))}
                <label className="w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer bg-gray-100">
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = ev => setCustomAvatar(ev.target?.result as string)
                      reader.readAsDataURL(file)
                    }
                  }} />
                  <span className="text-xs text-gray-500">+</span>
                </label>
              </div>
              {customAvatar && (
                <div className="mt-2">
                  <img src={customAvatar} alt="avatar custom" className="w-16 h-16 rounded-full mx-auto" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => setShowHelp(true)}>
              <Info className="w-4 h-4 mr-2" />
              Aide & FAQ
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exporter mes données
            </Button>

            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer mon compte
            </Button>

            <Separator />

            <Button variant="outline" className="w-full justify-start text-gray-600" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </CardContent>
        </Card>

        {/* À propos */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>À propos de SamaBudget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🇸🇳</span>
              </div>
              <p className="font-semibold">Version 1.0.0</p>
              <p className="text-sm text-gray-600">Conçu avec ❤️ pour les Sénégalais</p>
              <div className="flex justify-center space-x-4 mt-4">
                <Button variant="link" size="sm">
                  Conditions d'utilisation
                </Button>
                <Button variant="link" size="sm">
                  Politique de confidentialité
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
