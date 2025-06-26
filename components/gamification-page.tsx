"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { GamificationSystem } from "@/components/gamification-system"
import { useLanguage } from "@/components/language-system"

interface GamificationPageProps {
  onBack: () => void
}

export function GamificationPage({ onBack }: GamificationPageProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001f3f] to-[#2ECC71] text-white p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">🏆 Système de Gamification</h1>
        </div>
      </div>

      <div className="p-6 pb-20">
        <GamificationSystem />
      </div>
    </div>
  )
}
