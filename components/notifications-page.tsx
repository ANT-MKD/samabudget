"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, BellOff, Settings, Trash2, Volume2 } from "lucide-react"
import { useLanguage } from "@/components/language-system"

interface NotificationsPageProps {
  onBack: () => void
}

interface NotificationSetting {
  id: string
  title: string
  description: string
  enabled: boolean
  type: "budget" | "savings" | "challenges" | "transactions" | "reminders"
}

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  const { t, speak } = useLanguage()

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: "budget_alerts",
      title: "Alertes de budget",
      description: "Recevoir des notifications quand vous approchez de vos limites",
      enabled: true,
      type: "budget",
    },
    {
      id: "savings_reminders",
      title: "Rappels d'épargne",
      description: "Notifications quotidiennes pour vos objectifs d'épargne",
      enabled: true,
      type: "savings",
    },
    {
      id: "challenge_updates",
      title: "Mises à jour des défis",
      description: "Notifications sur vos défis en cours et nouveaux défis",
      enabled: true,
      type: "challenges",
    },
    {
      id: "transaction_confirmations",
      title: "Confirmations de transactions",
      description: "Notifications après chaque ajout de transaction",
      enabled: false,
      type: "transactions",
    },
    {
      id: "weekly_summary",
      title: "Résumé hebdomadaire",
      description: "Rapport de vos finances chaque dimanche",
      enabled: true,
      type: "reminders",
    },
    {
      id: "achievement_unlocked",
      title: "Succès débloqués",
      description: "Notifications quand vous débloquez de nouveaux succès",
      enabled: true,
      type: "challenges",
    },
  ])

  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)

  const toggleNotification = (id: string) => {
    setNotificationSettings((prev) =>
      prev.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting)),
    )
    speak("Paramètre modifié")
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "budget":
        return "💰"
      case "savings":
        return "🪙"
      case "challenges":
        return "🎯"
      case "transactions":
        return "💳"
      case "reminders":
        return "⏰"
      default:
        return "🔔"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "budget":
        return "bg-blue-100 text-blue-800"
      case "savings":
        return "bg-yellow-100 text-yellow-800"
      case "challenges":
        return "bg-purple-100 text-purple-800"
      case "transactions":
        return "bg-green-100 text-green-800"
      case "reminders":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const enabledCount = notificationSettings.filter((s) => s.enabled).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001f3f] to-[#2ECC71] text-white p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">🔔 Notifications</h1>
        </div>

        {/* Résumé */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Paramètres de notification</h3>
                <p className="opacity-90">
                  {enabledCount} sur {notificationSettings.length} activées
                </p>
              </div>
              <div className="text-4xl">
                {enabledCount > 0 ? <Bell className="w-10 h-10" /> : <BellOff className="w-10 h-10" />}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 space-y-6">
        {/* Paramètres généraux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Paramètres généraux</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Sons de notification</p>
                  <p className="text-sm text-gray-500">Jouer un son avec les notifications</p>
                </div>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📳</span>
                </div>
                <div>
                  <p className="font-medium">Vibrations</p>
                  <p className="text-sm text-gray-500">Vibrer lors des notifications importantes</p>
                </div>
              </div>
              <Switch checked={vibrationEnabled} onCheckedChange={setVibrationEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Types de notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Types de notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notificationSettings.map((setting) => (
              <div
                key={setting.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  setting.enabled ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(setting.type)}`}
                    >
                      <span className="text-lg">{getTypeIcon(setting.type)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{setting.title}</h4>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                      <Badge variant="outline" className={`mt-1 text-xs ${getTypeColor(setting.type)}`}>
                        {setting.type}
                      </Badge>
                    </div>
                  </div>
                  <Switch checked={setting.enabled} onCheckedChange={() => toggleNotification(setting.id)} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setNotificationSettings((prev) => prev.map((s) => ({ ...s, enabled: true })))
                speak("Toutes les notifications activées")
              }}
            >
              <Bell className="w-4 h-4 mr-2" />
              Activer toutes les notifications
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setNotificationSettings((prev) => prev.map((s) => ({ ...s, enabled: false })))
                speak("Toutes les notifications désactivées")
              }}
            >
              <BellOff className="w-4 h-4 mr-2" />
              Désactiver toutes les notifications
            </Button>

            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" />
              Effacer l'historique des notifications
            </Button>
          </CardContent>
        </Card>

        {/* Informations */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Bell className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">À propos des notifications</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Les notifications vous aident à rester sur la bonne voie</li>
                  <li>• Vous pouvez les personnaliser selon vos besoins</li>
                  <li>• Les alertes de budget sont recommandées</li>
                  <li>• Vous pouvez les désactiver à tout moment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
