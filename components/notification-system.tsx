"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Bell, AlertTriangle, TrendingUp, Target, Trophy } from "lucide-react"
import ReactDOM from "react-dom"

interface Notification {
  id: string
  type: "budget" | "savings" | "challenge" | "achievement" | "warning"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationSystemProps {
  onNotificationClick?: (notification: Notification) => void
}

export function NotificationSystem({ onNotificationClick }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "budget",
      title: "Budget Ndogou dépassé",
      message: "Vous avez dépensé 42,000 FCFA sur 40,000 FCFA ce mois",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
    },
    {
      id: "2",
      type: "achievement",
      title: "Objectif atteint ! 🎉",
      message: "Félicitations ! Vous avez économisé 50,000 FCFA ce mois",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
    },
    {
      id: "3",
      type: "challenge",
      title: "Défi en cours",
      message: "Plus que 2 jours pour votre défi 'Transport économique'",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "4",
      type: "savings",
      title: "Rappel d'épargne",
      message: "N'oubliez pas d'épargner aujourd'hui pour votre objectif 'Nouveau téléphone'",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: false,
    },
  ])

  const [showNotifications, setShowNotifications] = useState(false)

  // Simuler de nouvelles notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: "warning" as const,
          title: "Dépense inhabituelle",
          message: "Vous avez dépensé 15,000 FCFA en transport aujourd'hui",
        },
        {
          type: "savings" as const,
          title: "Objectif proche !",
          message: "Plus que 25,000 FCFA pour atteindre votre objectif voyage",
        },
        {
          type: "achievement" as const,
          title: "Nouveau badge débloqué !",
          message: "Badge 'Économe du mois' obtenu ! 🏆",
        },
      ]

      if (Math.random() > 0.7) {
        const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        const newNotification: Notification = {
          id: Date.now().toString(),
          ...randomNotif,
          timestamp: new Date(),
          isRead: false,
        }
        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)])
      }
    }, 30000) // Nouvelle notification toutes les 30 secondes

    return () => clearInterval(interval)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "budget":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "savings":
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case "challenge":
        return <Target className="w-5 h-5 text-purple-500" />
      case "achievement":
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      default:
        return <Bell className="w-5 h-5 text-blue-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "budget":
        return "border-l-red-500 bg-red-50"
      case "savings":
        return "border-l-green-500 bg-green-50"
      case "challenge":
        return "border-l-purple-500 bg-purple-50"
      case "achievement":
        return "border-l-yellow-500 bg-yellow-50"
      case "warning":
        return "border-l-orange-500 bg-orange-50"
      default:
        return "border-l-blue-500 bg-blue-50"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes}min`
    if (hours < 24) return `Il y a ${hours}h`
    return `Il y a ${days}j`
  }

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative text-white hover:bg-white/20 transition-all duration-200"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Notifications Dropdown */}
        {showNotifications && ReactDOM.createPortal(
          <div className="fixed top-20 right-6 w-80 max-h-96 bg-white rounded-lg shadow-xl border z-[9999] overflow-hidden animate-slide-down">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)} className="h-6 w-6">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {unreadCount > 0 && <p className="text-sm text-gray-600 mt-1">{unreadCount} non lue(s)</p>}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 border-b hover:bg-gray-50 cursor-pointer transition-all duration-200 ${getNotificationColor(notification.type)} ${
                      !notification.isRead ? "bg-opacity-100" : "bg-opacity-50"
                    }`}
                    onClick={() => {
                      markAsRead(notification.id)
                      onNotificationClick?.(notification)
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-sm font-medium ${
                              !notification.isRead ? "text-gray-900" : "text-gray-600"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className={`text-sm mt-1 ${!notification.isRead ? "text-gray-700" : "text-gray-500"}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">{formatTime(notification.timestamp)}</p>
                        {notification.action && (
                          <Button
                            size="sm"
                            className="mt-2 h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              notification.action?.onClick()
                            }}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t bg-gray-50">
                <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setNotifications([])}>
                  Effacer toutes les notifications
                </Button>
              </div>
            )}
          </div>,
          document.body
        )}
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </>
  )
}
