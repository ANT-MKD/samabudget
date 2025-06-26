"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Flame, Target, Crown, Gift, Zap } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  progress: number
  maxProgress: number
  isUnlocked: boolean
  reward: number
}

interface UserLevel {
  level: number
  xp: number
  xpToNext: number
  title: string
}

interface Streak {
  type: "savings" | "budget" | "challenges"
  count: number
  maxCount: number
  isActive: boolean
}

export function GamificationSystem() {
  const [userLevel, setUserLevel] = useState<UserLevel>({
    level: 7,
    xp: 2450,
    xpToNext: 3000,
    title: "Économe Confirmé",
  })

  const [streaks, setStreaks] = useState<Streak[]>([
    { type: "savings", count: 12, maxCount: 15, isActive: true },
    { type: "budget", count: 8, maxCount: 10, isActive: true },
    { type: "challenges", count: 3, maxCount: 5, isActive: false },
  ])

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_save",
      title: "Premier pas",
      description: "Effectuer votre première épargne",
      icon: "🎯",
      rarity: "common",
      progress: 1,
      maxProgress: 1,
      isUnlocked: true,
      reward: 100,
    },
    {
      id: "budget_master",
      title: "Maître du budget",
      description: "Respecter votre budget pendant 30 jours",
      icon: "👑",
      rarity: "epic",
      progress: 25,
      maxProgress: 30,
      isUnlocked: false,
      reward: 500,
    },
    {
      id: "challenge_warrior",
      title: "Guerrier des défis",
      description: "Compléter 10 défis financiers",
      icon: "⚔️",
      rarity: "rare",
      progress: 7,
      maxProgress: 10,
      isUnlocked: false,
      reward: 300,
    },
    {
      id: "savings_legend",
      title: "Légende de l'épargne",
      description: "Épargner 500,000 FCFA au total",
      icon: "💎",
      rarity: "legendary",
      progress: 350000,
      maxProgress: 500000,
      isUnlocked: false,
      reward: 1000,
    },
    {
      id: "streak_master",
      title: "Maître des séries",
      description: "Maintenir une série de 30 jours",
      icon: "🔥",
      rarity: "epic",
      progress: 12,
      maxProgress: 30,
      isUnlocked: false,
      reward: 750,
    },
  ])

  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([])
  const [showLevelUp, setShowLevelUp] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "FCFA")
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStreakIcon = (type: string) => {
    switch (type) {
      case "savings":
        return <Target className="w-5 h-5" />
      case "budget":
        return <Trophy className="w-5 h-5" />
      case "challenges":
        return <Zap className="w-5 h-5" />
      default:
        return <Star className="w-5 h-5" />
    }
  }

  const getStreakLabel = (type: string) => {
    switch (type) {
      case "savings":
        return "Épargne quotidienne"
      case "budget":
        return "Respect du budget"
      case "challenges":
        return "Défis complétés"
      default:
        return "Série"
    }
  }

  // Simuler des achievements débloqués
  useEffect(() => {
    const timer = setTimeout(() => {
      const unlockedAchievement = achievements.find((a) => a.id === "budget_master")
      if (unlockedAchievement && !unlockedAchievement.isUnlocked) {
        setAchievements((prev) =>
          prev.map((a) => (a.id === "budget_master" ? { ...a, isUnlocked: true, progress: 30 } : a)),
        )
        setRecentAchievements([unlockedAchievement])
        setUserLevel((prev) => ({ ...prev, xp: prev.xp + 500 }))
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Vérifier level up
  useEffect(() => {
    if (userLevel.xp >= userLevel.xpToNext) {
      setShowLevelUp(true)
      setUserLevel((prev) => ({
        level: prev.level + 1,
        xp: prev.xp - prev.xpToNext,
        xpToNext: prev.xpToNext + 500,
        title: `Économe Niveau ${prev.level + 1}`,
      }))
    }
  }, [userLevel.xp])

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked)
  const totalAchievements = achievements.length
  const completionRate = Math.round((unlockedAchievements.length / totalAchievements) * 100)

  return (
    <div className="space-y-6">
      {/* Level Up Animation */}
      {showLevelUp && (
        <Card className="border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 animate-bounce">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-yellow-800 mb-1">Niveau supérieur !</h3>
            <p className="text-yellow-700">Vous êtes maintenant niveau {userLevel.level} !</p>
            <Button size="sm" className="mt-3 bg-yellow-600 hover:bg-yellow-700" onClick={() => setShowLevelUp(false)}>
              Fantastique !
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card className="border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="font-bold text-green-800">Nouveau succès débloqué !</h3>
                <p className="text-green-700">{recentAchievements[0].title}</p>
                <p className="text-sm text-green-600">+{recentAchievements[0].reward} XP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Level */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-purple-600" />
            <span>Votre progression</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-purple-900">Niveau {userLevel.level}</h3>
              <p className="text-purple-700">{userLevel.title}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-600">XP</p>
              <p className="text-lg font-bold text-purple-900">
                {userLevel.xp} / {userLevel.xpToNext}
              </p>
            </div>
          </div>
          <Progress value={(userLevel.xp / userLevel.xpToNext) * 100} className="h-3" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-sm text-gray-600">Succès</p>
              <p className="font-bold">
                {unlockedAchievements.length}/{totalAchievements}
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <Star className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <p className="text-sm text-gray-600">Completion</p>
              <p className="font-bold">{completionRate}%</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <Flame className="w-6 h-6 text-red-500 mx-auto mb-1" />
              <p className="text-sm text-gray-600">Série max</p>
              <p className="font-bold">{Math.max(...streaks.map((s) => s.maxCount))}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streaks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span>Séries en cours</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {streaks.map((streak, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                streak.isActive ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStreakIcon(streak.type)}
                  <span className="font-medium">{getStreakLabel(streak.type)}</span>
                </div>
                <Badge variant={streak.isActive ? "default" : "secondary"} className="text-xs">
                  {streak.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>
                  {streak.count} jours {streak.isActive && "🔥"}
                </span>
                <span className="text-gray-500">Record: {streak.maxCount}</span>
              </div>
              <Progress value={(streak.count / (streak.maxCount + 5)) * 100} className="h-2 mt-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Succès</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                achievement.isUnlocked
                  ? "border-green-200 bg-green-50 shadow-sm"
                  : "border-gray-200 bg-gray-50 opacity-75"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div
                    className={`text-2xl p-2 rounded-full ${
                      achievement.isUnlocked ? "bg-white" : "bg-gray-200 grayscale"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-semibold ${achievement.isUnlocked ? "text-gray-900" : "text-gray-500"}`}>
                        {achievement.title}
                      </h4>
                      <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>{achievement.rarity}</Badge>
                    </div>
                    <p className={`text-sm ${achievement.isUnlocked ? "text-gray-700" : "text-gray-500"}`}>
                      {achievement.description}
                    </p>
                    {!achievement.isUnlocked && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progression</span>
                          <span>
                            {achievement.rarity === "legendary"
                              ? formatCurrency(achievement.progress)
                              : achievement.progress}
                            /
                            {achievement.rarity === "legendary"
                              ? formatCurrency(achievement.maxProgress)
                              : achievement.maxProgress}
                          </span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {achievement.isUnlocked ? (
                    <Badge className="bg-green-500 text-white">
                      <Trophy className="w-3 h-3 mr-1" />
                      Débloqué
                    </Badge>
                  ) : (
                    <div className="text-xs text-gray-500">
                      <Gift className="w-4 h-4 mx-auto mb-1" />+{achievement.reward} XP
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
