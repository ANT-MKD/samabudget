"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, Target, Calendar, Star, Flame, CheckCircle, Clock } from "lucide-react"

interface ChallengesProps {
  onBack: () => void
}

interface Challenge {
  id: number
  title: string
  description: string
  icon: string
  difficulty: "Facile" | "Moyen" | "Difficile"
  duration: string
  reward: number
  progress: number
  maxProgress: number
  isActive: boolean
  isCompleted: boolean
  category: string
  tips: string[]
}

const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: "Pas de fast-food pendant 7 jours",
    description: "Évitez les restaurants rapides et cuisinez à la maison pour économiser",
    icon: "🍽️",
    difficulty: "Facile",
    duration: "7 jours",
    reward: 5000,
    progress: 5,
    maxProgress: 7,
    isActive: true,
    isCompleted: false,
    category: "Alimentation",
    tips: ["Préparez vos repas à l'avance", "Gardez des collations saines", "Buvez beaucoup d'eau"],
  },
  {
    id: 2,
    title: "Transport économique",
    description: "Utilisez uniquement les transports en commun ce mois",
    icon: "🚌",
    difficulty: "Moyen",
    duration: "30 jours",
    reward: 15000,
    progress: 12,
    maxProgress: 30,
    isActive: true,
    isCompleted: false,
    category: "Transport",
    tips: ["Planifiez vos trajets", "Groupez vos sorties", "Marchez quand c'est possible"],
  },
  {
    id: 3,
    title: "Zéro achat impulsif",
    description: "Réfléchissez 24h avant tout achat non-essentiel",
    icon: "🛒",
    difficulty: "Difficile",
    duration: "14 jours",
    reward: 10000,
    progress: 14,
    maxProgress: 14,
    isActive: false,
    isCompleted: true,
    category: "Shopping",
    tips: ["Faites une liste avant de sortir", "Évitez les centres commerciaux", "Comptez jusqu'à 10"],
  },
  {
    id: 4,
    title: "Économie d'électricité",
    description: "Réduisez votre facture Senelec de 20% ce mois",
    icon: "⚡",
    difficulty: "Moyen",
    duration: "30 jours",
    reward: 8000,
    progress: 0,
    maxProgress: 30,
    isActive: false,
    isCompleted: false,
    category: "Énergie",
    tips: ["Débranchez les appareils", "Utilisez des ampoules LED", "Limitez la climatisation"],
  },
  {
    id: 5,
    title: "Marché local uniquement",
    description: "Faites vos courses uniquement au marché traditionnel",
    icon: "🏪",
    difficulty: "Facile",
    duration: "14 jours",
    reward: 7000,
    progress: 0,
    maxProgress: 14,
    isActive: false,
    isCompleted: false,
    category: "Shopping",
    tips: ["Négociez les prix", "Achetez en saison", "Apportez votre sac"],
  },
  {
    id: 6,
    title: "Défi eau du robinet",
    description: "Ne buvez que l'eau du robinet pendant 2 semaines",
    icon: "💧",
    difficulty: "Facile",
    duration: "14 jours",
    reward: 4000,
    progress: 0,
    maxProgress: 14,
    isActive: false,
    isCompleted: false,
    category: "Boisson",
    tips: ["Utilisez une gourde", "Filtrez l'eau si nécessaire", "Ajoutez du citron pour le goût"],
  },
  {
    id: 7,
    title: "Réparation avant achat",
    description: "Réparez 3 objets cassés au lieu d'en acheter de nouveaux",
    icon: "🔧",
    difficulty: "Moyen",
    duration: "21 jours",
    reward: 12000,
    progress: 0,
    maxProgress: 3,
    isActive: false,
    isCompleted: false,
    category: "Réparation",
    tips: ["Cherchez des tutoriels YouTube", "Demandez à un ami bricoleur", "Visitez un repair café"],
  },
  {
    id: 8,
    title: "Semaine sans dépenses",
    description: "Une semaine complète sans aucune dépense non-essentielle",
    icon: "🚫",
    difficulty: "Difficile",
    duration: "7 jours",
    reward: 15000,
    progress: 0,
    maxProgress: 7,
    isActive: false,
    isCompleted: false,
    category: "Général",
    tips: ["Préparez tout à l'avance", "Trouvez des activités gratuites", "Restez occupé"],
  },
]

export function Challenges({ onBack }: ChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges)
  const [activeTab, setActiveTab] = useState<"active" | "available" | "completed">("active")
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "FCFA")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Facile":
        return "bg-green-100 text-green-800"
      case "Moyen":
        return "bg-yellow-100 text-yellow-800"
      case "Difficile":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const startChallenge = (challengeId: number) => {
    setChallenges(challenges.map((c) => (c.id === challengeId ? { ...c, isActive: true, progress: 0 } : c)))
  }

  const abandonChallenge = (challengeId: number) => {
    setChallenges(challenges.map((c) => (c.id === challengeId ? { ...c, isActive: false, progress: 0 } : c)))
  }

  const filteredChallenges = challenges.filter((challenge) => {
    if (activeTab === "active") return challenge.isActive
    if (activeTab === "completed") return challenge.isCompleted
    return !challenge.isActive && !challenge.isCompleted
  })

  const totalRewardsEarned = challenges.filter((c) => c.isCompleted).reduce((sum, c) => sum + c.reward, 0)
  const activeChallengesCount = challenges.filter((c) => c.isActive).length
  const completedChallengesCount = challenges.filter((c) => c.isCompleted).length

  if (selectedChallenge) {
    const progressPercentage = (selectedChallenge.progress / selectedChallenge.maxProgress) * 100

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header détail */}
        <div className="bg-gradient-to-r from-[#001f3f] to-[#2ECC71] text-white p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedChallenge(null)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Détail du défi</h1>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">{selectedChallenge.icon}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedChallenge.title}</h2>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(selectedChallenge.difficulty)}>
                      {selectedChallenge.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-white border-white">
                      <Calendar className="w-3 h-3 mr-1" />
                      {selectedChallenge.duration}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-lg opacity-90 mb-4">{selectedChallenge.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-yellow-300">
                  <Star className="w-5 h-5 mr-2" />
                  <span className="text-xl font-bold">{formatCurrency(selectedChallenge.reward)}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-75">Progression</p>
                  <p className="text-xl font-bold">
                    {selectedChallenge.progress}/{selectedChallenge.maxProgress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 space-y-6">
          {/* Progression détaillée */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Votre progression</h3>
                <span className="text-2xl font-bold text-[#2ECC71]">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-4 mb-4" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm text-blue-600">Jours restants</p>
                  <p className="font-bold text-blue-800">
                    {selectedChallenge.maxProgress - selectedChallenge.progress}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-green-600">Jours réussis</p>
                  <p className="font-bold text-green-800">{selectedChallenge.progress}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                  <p className="text-sm text-yellow-600">Récompense</p>
                  <p className="font-bold text-yellow-800">{formatCurrency(selectedChallenge.reward)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conseils */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">💡 Conseils pour réussir</h3>
              <div className="space-y-3">
                {selectedChallenge.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-blue-800">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            {selectedChallenge.isActive ? (
              <>
                <Button className="w-full h-12 bg-[#2ECC71] hover:bg-[#27AE60]">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Marquer aujourd'hui comme réussi
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => abandonChallenge(selectedChallenge.id)}
                >
                  Abandonner le défi
                </Button>
              </>
            ) : selectedChallenge.isCompleted ? (
              <Button disabled className="w-full h-12 bg-green-500 text-white">
                <Trophy className="w-5 h-5 mr-2" />
                Défi complété ! 🎉
              </Button>
            ) : (
              <Button
                className="w-full h-12 bg-[#2ECC71] hover:bg-[#27AE60]"
                onClick={() => startChallenge(selectedChallenge.id)}
              >
                <Target className="w-5 h-5 mr-2" />
                Commencer ce défi
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001f3f] to-[#2ECC71] text-white p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Défis Financiers</h1>
        </div>

        {/* Statistiques */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Flame className="w-6 h-6 text-orange-300" />
                </div>
                <p className="text-sm opacity-90">Actifs</p>
                <p className="text-2xl font-bold">{activeChallengesCount}</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6 text-yellow-300" />
                </div>
                <p className="text-sm opacity-90">Complétés</p>
                <p className="text-2xl font-bold">{completedChallengesCount}</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-green-300" />
                </div>
                <p className="text-sm opacity-90">Récompenses</p>
                <p className="text-lg font-bold">{formatCurrency(totalRewardsEarned)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <Button
            variant={activeTab === "active" ? "default" : "outline"}
            onClick={() => setActiveTab("active")}
            className={activeTab === "active" ? "bg-[#2ECC71] hover:bg-[#27AE60]" : ""}
          >
            🔥 Actifs ({activeChallengesCount})
          </Button>
          <Button
            variant={activeTab === "available" ? "default" : "outline"}
            onClick={() => setActiveTab("available")}
            className={activeTab === "available" ? "bg-[#2ECC71] hover:bg-[#27AE60]" : ""}
          >
            🎯 Disponibles
          </Button>
          <Button
            variant={activeTab === "completed" ? "default" : "outline"}
            onClick={() => setActiveTab("completed")}
            className={activeTab === "completed" ? "bg-[#2ECC71] hover:bg-[#27AE60]" : ""}
          >
            🏆 Complétés ({completedChallengesCount})
          </Button>
        </div>

        {/* Liste des défis */}
        <div className="space-y-4">
          {filteredChallenges.map((challenge) => {
            const progressPercentage = (challenge.progress / challenge.maxProgress) * 100

            return (
              <Card
                key={challenge.id}
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  challenge.isCompleted
                    ? "border-green-500 bg-green-50"
                    : challenge.isActive
                      ? "border-orange-500 bg-orange-50"
                      : ""
                }`}
                onClick={() => setSelectedChallenge(challenge)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-2xl">{challenge.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{challenge.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{challenge.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            {challenge.duration}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {challenge.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-green-600 font-semibold mb-2">
                        <Star className="w-4 h-4 mr-1" />
                        {formatCurrency(challenge.reward)}
                      </div>
                      {challenge.isCompleted && <Badge className="bg-green-500 text-white">✅ Complété</Badge>}
                      {challenge.isActive && <Badge className="bg-orange-500 text-white">🔥 En cours</Badge>}
                    </div>
                  </div>

                  {/* Progression */}
                  {(challenge.isActive || challenge.isCompleted) && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progression</span>
                        <span className="font-semibold">
                          {challenge.progress}/{challenge.maxProgress} jours
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{Math.round(progressPercentage)}% complété</p>
                    </div>
                  )}

                  {/* Actions rapides */}
                  <div className="flex space-x-2">
                    {challenge.isCompleted ? (
                      <Button disabled className="flex-1 bg-green-500 text-white">
                        <Trophy className="w-4 h-4 mr-2" />
                        Complété !
                      </Button>
                    ) : challenge.isActive ? (
                      <>
                        <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                          <Flame className="w-4 h-4 mr-2" />
                          Continuer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={e => { e.stopPropagation(); abandonChallenge(challenge.id); }}
                        >
                          Annuler
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60]"
                        onClick={(e) => {
                          e.stopPropagation()
                          startChallenge(challenge.id)
                        }}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Commencer
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredChallenges.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">
                {activeTab === "active" ? "🔥" : activeTab === "completed" ? "🏆" : "🎯"}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {activeTab === "active"
                  ? "Aucun défi actif"
                  : activeTab === "completed"
                    ? "Aucun défi complété"
                    : "Tous les défis sont pris !"}
              </h3>
              <p className="text-gray-600">
                {activeTab === "active"
                  ? "Commencez un nouveau défi pour économiser plus !"
                  : activeTab === "completed"
                    ? "Complétez vos premiers défis pour les voir ici"
                    : "Revenez bientôt pour de nouveaux défis !"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Motivation */}
        <Card className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="font-semibold text-purple-900 mb-2">Restez motivé !</h3>
              <p className="text-purple-800 text-sm">
                Chaque petit effort compte. Les défis vous aident à développer de bonnes habitudes financières tout en
                économisant de l'argent. Continuez comme ça !
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
