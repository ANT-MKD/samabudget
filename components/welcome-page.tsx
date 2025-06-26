"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ChevronLeft, ChevronRight } from "lucide-react"

interface WelcomePageProps {
  onLogin: () => void
}

const carouselSlides = [
  {
    id: 1,
    title: "Gérez vos finances en toute simplicité",
    subtitle: "Suivez vos dépenses et revenus facilement",
    icon: "💰",
    gradient: "from-[#2ECC71] to-[#27AE60]",
    features: ["Suivi en temps réel", "Interface intuitive", "100% sécurisé"],
  },
  {
    id: 2,
    title: "Atteignez vos objectifs d'épargne",
    subtitle: "Créez des objectifs et suivez vos progrès",
    icon: "🎯",
    gradient: "from-[#FFDC00] to-[#F39C12]",
    features: ["Objectifs personnalisés", "Suivi visuel", "Conseils adaptés"],
  },
  {
    id: 3,
    title: "Relevez des défis financiers",
    subtitle: "Économisez en vous amusant avec nos défis",
    icon: "🏆",
    gradient: "from-[#9B59B6] to-[#8E44AD]",
    features: ["Défis gamifiés", "Récompenses", "Motivation quotidienne"],
  },
  {
    id: 4,
    title: "Analysez vos habitudes",
    subtitle: "Comprenez où va votre argent avec nos rapports",
    icon: "📊",
    gradient: "from-[#3498DB] to-[#2980B9]",
    features: ["Graphiques détaillés", "Rapports PDF", "Tendances mensuelles"],
  },
  {
    id: 5,
    title: "Adapté au Sénégal",
    subtitle: "Catégories locales et devise FCFA",
    icon: "🇸🇳",
    gradient: "from-[#E74C3C] to-[#C0392B]",
    features: ["Orange Money", "Marché local", "Transport Dakar"],
  },
]

export function WelcomePage({ onLogin }: WelcomePageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-slide du carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const currentSlideData = carouselSlides[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#2ECC71] to-[#FFDC00] flex flex-col">
      {/* Header avec logo */}
      <div className="flex items-center justify-center pt-8 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">SamaBudget</h1>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-white relative">
        <div className="w-full relative">
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselSlides.map((slide) => (
                <div key={slide.id} className="w-full flex-shrink-0">
                  <div
                    className={`bg-gradient-to-br ${slide.gradient} p-8 rounded-2xl text-center min-h-[400px] flex flex-col justify-center`}
                  >
                    <div className="text-6xl mb-4 animate-bounce">{slide.icon}</div>
                    <h2 className="text-2xl font-bold mb-3 text-white">{slide.title}</h2>
                    <p className="text-lg opacity-90 mb-6 text-white">{slide.subtitle}</p>

                    {/* Features */}
                    <div className="space-y-3">
                      {slide.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full py-2 px-4 animate-fade-in"
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-sm font-medium text-white">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-white/75">
              {currentSlide + 1} / {carouselSlides.length}
            </span>
          </div>
        </div>
      </div>

      {/* Formulaire de connexion */}
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl px-6 py-8 shadow-2xl pb-32">
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-[#001f3f]">{isLogin ? "Connexion" : "Inscription"}</CardTitle>
            <CardDescription>
              {isLogin ? "Connectez-vous à votre compte" : "Créez votre compte gratuit"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-2 focus:border-[#2ECC71] transition-colors"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-2 focus:border-[#2ECC71] transition-colors"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:from-[#27AE60] hover:to-[#2ECC71] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {isLogin ? "Se connecter" : "S'inscrire"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#001f3f] hover:text-[#2ECC71] transition-colors font-medium"
                >
                  {isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 h-12 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                onClick={onLogin}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuer avec Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
