"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Volume2, VolumeX } from "lucide-react"

// Types pour le système de langues
type Language = "fr" | "wo"
type TranslationKey = string

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  speak: (text: string) => void
  isListening: boolean
  startListening: () => void
  stopListening: () => void
  isSpeechEnabled: boolean
  setSpeechEnabled: (enabled: boolean) => void
}

interface TranslationDict {
  [key: string]: string;
}

const translations: { fr: TranslationDict; wo: TranslationDict } = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.add": "Ajouter",
    "nav.stats": "Stats",
    "nav.profile": "Profil",

    // Dashboard
    "dashboard.welcome": "Bonjour ! 👋",
    "dashboard.financial_situation": "Voici votre situation financière",
    "dashboard.current_balance": "Solde actuel",
    "dashboard.expenses": "Dépenses",
    "dashboard.income": "Revenus",
    "dashboard.expense_analysis": "Analyse des dépenses",
    "dashboard.recent_transactions": "Transactions récentes",
    "dashboard.features": "Fonctionnalités",

    // Transactions
    "transaction.new": "Nouvelle transaction",
    "transaction.expense": "Dépense",
    "transaction.income": "Revenu",
    "transaction.amount": "Montant",
    "transaction.category": "Catégorie",
    "transaction.description": "Description",
    "transaction.date": "Date",
    "transaction.add": "Ajouter la transaction",
    "transaction.description_placeholder": "Ajoutez une note (optionnel)",

    // Catégories
    "category.transport": "Transport",
    "category.ndogou": "Ndogou",
    "category.market": "Marché",
    "category.senelec": "Facture Senelec",
    "category.orange_money": "Orange Money",
    "category.health": "Santé",
    "category.education": "Éducation",
    "category.leisure": "Loisirs",
    "category.salary": "Salaire",
    "category.business": "Business",
    "category.freelance": "Freelance",
    "category.family_help": "Aide famille",
    "category.other": "Autre",

    // Budget
    "budget.title": "Gestion du Budget",
    "budget.total_budget": "Budget total",
    "budget.spent": "Dépensé",
    "budget.global_progress": "Progression globale",
    "budget.add_budget": "Ajouter un budget",
    "budget.new_budget": "Nouveau budget",
    "budget.monthly_amount": "Montant mensuel (FCFA)",
    "budget.exceeded": "Dépassé",
    "budget.warning": "Attention",
    "budget.ok": "OK",
    "budget.remaining": "Reste",
    "budget.exceeded_amount": "Dépassement",

    // Épargne
    "savings.title": "Mes Objectifs d'Épargne",
    "savings.objectives": "Objectifs",
    "savings.completed": "Complétés",
    "savings.progress": "Progression",
    "savings.total_saved": "Total épargné",
    "savings.objective": "Objectif",
    "savings.new_objective": "Nouvel objectif d'épargne",
    "savings.objective_title": "Titre de l'objectif",
    "savings.target_amount": "Montant cible (FCFA)",
    "savings.deadline": "Date limite",
    "savings.create_objective": "Créer l'objectif",
    "savings.days_remaining": "jours",
    "savings.completed_badge": "Complété",

    // Défis
    "challenges.title": "Défis Financiers",
    "challenges.active": "Actifs",
    "challenges.available": "Disponibles",
    "challenges.completed": "Complétés",
    "challenges.rewards": "Récompenses",
    "challenges.difficulty.easy": "Facile",
    "challenges.difficulty.medium": "Moyen",
    "challenges.difficulty.hard": "Difficile",
    "challenges.start": "Commencer ce défi",
    "challenges.continue": "Continuer",
    "challenges.abandon": "Abandonner le défi",
    "challenges.mark_success": "Marquer aujourd'hui comme réussi",

    // Profil
    "profile.title": "Mon Profil",
    "profile.member_since": "Membre depuis",
    "profile.my_stats": "Mes statistiques",
    "profile.transactions": "Transactions",
    "profile.saved": "Économisé",
    "profile.favorite_category": "Catégorie préférée",
    "profile.personal_info": "Informations personnelles",
    "profile.full_name": "Nom complet",
    "profile.email": "Email",
    "profile.save_changes": "Sauvegarder les modifications",
    "profile.settings": "Paramètres",
    "profile.notifications": "Notifications",
    "profile.dark_mode": "Mode sombre",
    "profile.language": "Langue",

    // Général
    "general.add": "Ajouter",
    "general.cancel": "Annuler",
    "general.save": "Sauvegarder",
    "general.delete": "Supprimer",
    "general.edit": "Modifier",
    "general.back": "Retour",
    "general.close": "Fermer",
    "general.confirm": "Confirmer",
    "general.loading": "Chargement...",
    "general.error": "Erreur",
    "general.success": "Succès",

    // Messages
    "message.budget_exceeded": "Budget dépassé !",
    "message.goal_achieved": "Objectif atteint !",
    "message.challenge_completed": "Défi terminé !",
    "message.transaction_added": "Transaction ajoutée avec succès",
    "message.budget_warning": "Attention, vous approchez de votre limite budgétaire",

    // Conseils
    "tip.save_regularly": "Épargnez régulièrement, même de petits montants",
    "tip.track_expenses": "Suivez vos dépenses quotidiennes",
    "tip.set_realistic_goals": "Fixez-vous des objectifs réalistes",
    "tip.review_budget": "Révisez votre budget chaque mois",

    // Tontine
    "tontine.title": "Tontine",
    "tontine.description": "Gérez vos tontines, cotisez, suivez les tours et les membres.",
    "tontine.create": "Créer une tontine",
    "tontine.join": "Rejoindre une tontine",
    "tontine.my_tontines": "Mes tontines",
    "tontine.add_member": "Ajouter un membre",
    "tontine.member_name": "Nom du membre",
    "tontine.amount": "Montant de la cotisation",
    "tontine.next_turn": "Prochain tour",
    "tontine.turns": "Tours",
    "tontine.members": "Membres",
    "tontine.cycle": "Cycle",
    "tontine.leave": "Quitter la tontine",
    "tontine.delete": "Supprimer la tontine",
    "tontine.icon": "Icône de la tontine",
  },
  wo: {
    // Navigation
    "nav.home": "Kër",
    "nav.add": "Yokk",
    "nav.stats": "Statistik",
    "nav.profile": "Profil",

    // Dashboard
    "dashboard.welcome": "Asalaa malekum ! 👋",
    "dashboard.financial_situation": "Li nga am ci sa xaalis",
    "dashboard.current_balance": "Xaalis bu am léegi",
    "dashboard.expenses": "Li nga jëfandikoo",
    "dashboard.income": "Li nga am",
    "dashboard.expense_analysis": "Xam-xam ci li nga jëfandikoo",
    "dashboard.recent_transactions": "Jëfandikoo yu mujj",
    "dashboard.features": "Jëfandikoo",

    // Transactions
    "transaction.new": "Jëfandikoo bu bees",
    "transaction.expense": "Li nga jëfandikoo",
    "transaction.income": "Li nga am",
    "transaction.amount": "Ñaari xaalis",
    "transaction.category": "Wàll",
    "transaction.description": "Melokaan",
    "transaction.date": "Bés",
    "transaction.add": "Yokk jëfandikoo bi",
    "transaction.description_placeholder": "Yokk ab melokaan (dara la)",

    // Catégories
    "category.transport": "Transport",
    "category.ndogou": "Ndogou",
    "category.market": "Marché",
    "category.senelec": "Facture Senelec",
    "category.orange_money": "Orange Money",
    "category.health": "Wer gu baax",
    "category.education": "Jàng",
    "category.leisure": "Yëgle",
    "category.salary": "Salaire",
    "category.business": "Commerce",
    "category.freelance": "Liggéey bu bees",
    "category.family_help": "Ndimbal mbokk",
    "category.other": "Yeneen",

    // Budget
    "budget.title": "Yoonu Budget",
    "budget.total_budget": "Budget bu tollu",
    "budget.spent": "Li nga jëfandikoo",
    "budget.global_progress": "Yàqu àdduna",
    "budget.add_budget": "Yokk ab budget",
    "budget.new_budget": "Budget bu bees",
    "budget.monthly_amount": "Xaalis bu weer (FCFA)",
    "budget.exceeded": "Gën na",
    "budget.warning": "Tànk",
    "budget.ok": "Baax na",
    "budget.remaining": "Li des",
    "budget.exceeded_amount": "Li gën",

    // Épargne
    "savings.title": "Sama Paale yu Épargne",
    "savings.objectives": "Paale",
    "savings.completed": "Li jeex",
    "savings.progress": "Yàqu",
    "savings.total_saved": "Li tollu nga épargne",
    "savings.objective": "Paale",
    "savings.new_objective": "Paale bu bees bu épargne",
    "savings.objective_title": "Tur bu paale bi",
    "savings.target_amount": "Xaalis bu paale (FCFA)",
    "savings.deadline": "Bés bu jeex",
    "savings.create_objective": "Sos paale bi",
    "savings.days_remaining": "bés",
    "savings.completed_badge": "Jeex na",

    // Défis
    "challenges.title": "Défis yu Xaalis",
    "challenges.active": "Yu dox",
    "challenges.available": "Yu am",
    "challenges.completed": "Yu jeex",
    "challenges.rewards": "Cadeau",
    "challenges.difficulty.easy": "Yomb",
    "challenges.difficulty.medium": "Diggu",
    "challenges.difficulty.hard": "Metti",
    "challenges.start": "Tambali défi bi",
    "challenges.continue": "Jëkk",
    "challenges.abandon": "Bàyyi défi bi",
    "challenges.mark_success": "Teg tey ci réussite",

    // Profil
    "profile.title": "Sama Profil",
    "profile.member_since": "Membre dale",
    "profile.my_stats": "Sama statistik",
    "profile.transactions": "Jëfandikoo",
    "profile.saved": "Li nga épargne",
    "profile.favorite_category": "Wàll bu nga bëgg",
    "profile.personal_info": "Xibaar yu kenn",
    "profile.full_name": "Tur bu tollu",
    "profile.email": "Email",
    "profile.save_changes": "Teg coppite yi",
    "profile.settings": "Paramètre",
    "profile.notifications": "Notification",
    "profile.dark_mode": "Mode bu ñuul",
    "profile.language": "Làkk",

    // Général
    "general.add": "Yokk",
    "general.cancel": "Bàyyi",
    "general.save": "Teg",
    "general.delete": "Fey",
    "general.edit": "Coppite",
    "general.back": "Dellu",
    "general.close": "Tëj",
    "general.confirm": "Dëgger",
    "general.loading": "Doxalin...",
    "general.error": "Njumte",
    "general.success": "Baax",

    // Messages
    "message.budget_exceeded": "Budget bi gën na !",
    "message.goal_achieved": "Paale bi jeex na !",
    "message.challenge_completed": "Défi bi jeex na !",
    "message.transaction_added": "Jëfandikoo bi yokk na ci baax",
    "message.budget_warning": "Tànk, danga jot ci sa budget",

    // Conseils
    "tip.save_regularly": "Épargne bépp bés, waaye tuuti rekk",
    "tip.track_expenses": "Toppte sa jëfandikoo yu bés bu nekk",
    "tip.set_realistic_goals": "Teg paale yu dëgg",
    "tip.review_budget": "Xool sa budget bépp weer",

    // Tontine
    "tontine.title": "Tontine",
    "tontine.description": "Toppal sa tontine, yokk, topp tour yi ak nit ñi.",
    "tontine.create": "Sos tontine",
    "tontine.join": "Duggal tontine",
    "tontine.my_tontines": "Sama tontine yi",
    "tontine.add_member": "Yokk nit",
    "tontine.member_name": "Tur nit",
    "tontine.amount": "Xaalis bu tontine",
    "tontine.next_turn": "Tour bu nekk",
    "tontine.turns": "Tour yi",
    "tontine.members": "Nit ñi",
    "tontine.cycle": "Ronde",
    "tontine.leave": "Bàyyi tontine",
    "tontine.delete": "Fey tontine bi",
    "tontine.icon": "Tontine bu am ay simbool",
  },
}

// Context pour la langue
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Hook pour utiliser le contexte de langue
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Provider de langue
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr")
  const [isListening, setIsListening] = useState(false)
  const [isSpeechEnabled, setSpeechEnabled] = useState(true)

  // Fonction de traduction
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  // Fonction de synthèse vocale
  const speak = (text: string) => {
    if (!isSpeechEnabled || !window.speechSynthesis) return

    const utterance = new SpeechSynthesisUtterance(text)

    // Configuration pour le wolof (utilise la voix française avec accent)
    if (language === "wo") {
      utterance.lang = "fr-SN" // Sénégal français
      utterance.rate = 0.8 // Plus lent pour le wolof
    } else {
      utterance.lang = "fr-FR"
      utterance.rate = 1
    }

    utterance.pitch = 1
    utterance.volume = 0.8

    window.speechSynthesis.speak(utterance)
  }

  // Reconnaissance vocale (simulation)
  const startListening = () => {
    const w = window as any;
    if (!w.webkitSpeechRecognition && !w.SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
    }, 3000);
  }

  const stopListening = () => {
    setIsListening(false)
  }

  // Sauvegarder la langue dans localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("samabudget-language") as Language
    if (savedLanguage && (savedLanguage === "fr" || savedLanguage === "wo")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("samabudget-language", language)
  }, [language])

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        speak,
        isListening,
        startListening,
        stopListening,
        isSpeechEnabled,
        setSpeechEnabled,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

// Composant de sélection de langue
export function LanguageSelector() {
  const { language, setLanguage, t, speak, isSpeechEnabled, setSpeechEnabled } = useLanguage()

  const languages = [
    { code: "fr" as Language, name: "Français", flag: "🇫🇷", nativeName: "Français" },
    { code: "wo" as Language, name: "Wolof", flag: "🇸🇳", nativeName: "Wolof" },
  ]

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    speak(newLanguage === "fr" ? "Langue changée en français" : "Làkk coppite ci wolof")
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="w-6 h-6 text-blue-600" />
          <span>{t("profile.language")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sélection de langue */}
        <div className="grid grid-cols-1 gap-3">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? "default" : "outline"}
              onClick={() => handleLanguageChange(lang.code)}
              className={`h-16 justify-start space-x-3 ${
                language === lang.code ? "bg-blue-600 hover:bg-blue-700 text-white" : "hover:bg-blue-50 border-blue-200"
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-left">
                <p className="font-semibold">{lang.nativeName}</p>
                <p className={`text-sm ${language === lang.code ? "text-blue-100" : "text-gray-500"}`}>{lang.name}</p>
              </div>
              {language === lang.code && <Badge className="ml-auto bg-blue-500 text-white">Actuel</Badge>}
            </Button>
          ))}
        </div>

        {/* Contrôles vocaux */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center space-x-2">
            <Volume2 className="w-5 h-5" />
            <span>Synthèse vocale</span>
          </h4>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-3">
              {isSpeechEnabled ? (
                <Volume2 className="w-5 h-5 text-green-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <p className="font-medium">Lecture vocale</p>
                <p className="text-sm text-gray-500">{isSpeechEnabled ? "Activée" : "Désactivée"}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSpeechEnabled(!isSpeechEnabled)}>
              {isSpeechEnabled ? "Désactiver" : "Activer"}
            </Button>
          </div>

          {/* Test de la synthèse vocale */}
          <Button
            variant="outline"
            className="w-full mt-3"
            onClick={() => speak(t("message.transaction_added"))}
            disabled={!isSpeechEnabled}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Tester la voix
          </Button>
        </div>

        {/* Informations sur les langues */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Globe className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Support linguistique</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>
                  🇫🇷 <strong>Français</strong> : Interface complète
                </li>
                <li>
                  🇸🇳 <strong>Wolof</strong> : Traduction native sénégalaise
                </li>
                <li>
                  🔊 <strong>Synthèse vocale</strong> : Lecture des messages
                </li>
                <li>
                  🎯 <strong>Contexte local</strong> : Termes adaptés au Sénégal
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Phrases d'exemple */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-3">Exemples de traduction</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Français:</span>
              <span className="font-medium">"Bonjour ! 👋"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wolof:</span>
              <span className="font-medium">"Asalaa malekum ! 👋"</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <span className="text-gray-600">Français:</span>
              <span className="font-medium">"Nouvelle transaction"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wolof:</span>
              <span className="font-medium">"Jëfandikoo bu bees"</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Composant pour les messages vocaux
export function VoiceMessage({ message, autoSpeak = false }: { message: string; autoSpeak?: boolean }) {
  const { speak, isSpeechEnabled } = useLanguage()

  useEffect(() => {
    if (autoSpeak && isSpeechEnabled) {
      const timer = setTimeout(() => speak(message), 500)
      return () => clearTimeout(timer)
    }
  }, [message, autoSpeak, speak, isSpeechEnabled])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => speak(message)}
      disabled={!isSpeechEnabled}
      className="h-6 w-6 opacity-60 hover:opacity-100"
    >
      <Volume2 className="w-3 h-3" />
    </Button>
  )
}
