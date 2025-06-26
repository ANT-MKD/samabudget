"use client"

import { Button } from "@/components/ui/button"
import { Home, Plus, BarChart3, User } from "lucide-react"
import { Page } from "../types"

interface NavigationProps {
  currentPage: Page
  onPageChange: (page: Page) => void
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Accueil" },
    { id: "add", icon: Plus, label: "Ajouter" },
    { id: "stats", icon: BarChart3, label: "Stats" },
    { id: "profile", icon: User, label: "Profil" },
  ]

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-6 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          const isAddButton = item.id === "add"

          if (isAddButton) {
            return (
              <Button
                key={item.id}
                onClick={() => onPageChange(item.id as any)}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:from-[#27AE60] hover:to-[#2ECC71] text-white shadow-lg transform hover:scale-110 transition-all duration-200"
              >
                <Icon className="w-6 h-6" />
              </Button>
            )
          }

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onPageChange(item.id as any)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 h-auto ${
                isActive ? "text-[#2ECC71]" : "text-gray-500"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#2ECC71]" : "text-gray-500"}`} />
              <span className="text-xs">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
