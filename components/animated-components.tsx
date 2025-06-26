"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function AnimatedCard({ children, delay = 0, className = "" }: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <Card
      className={`transition-all duration-500 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </Card>
  )
}

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  disabled?: boolean
}

export function AnimatedButton({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      className={`transition-all duration-200 transform hover:scale-105 active:scale-95 ${
        isPressed ? "scale-95" : ""
      } ${className}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

interface PulseIconProps {
  children: React.ReactNode
  className?: string
}

export function PulseIcon({ children, className = "" }: PulseIconProps) {
  return <div className={`animate-pulse ${className}`}>{children}</div>
}

interface SlideInProps {
  children: React.ReactNode
  direction?: "left" | "right" | "up" | "down"
  delay?: number
  className?: string
}

export function SlideIn({ children, direction = "up", delay = 0, className = "" }: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case "left":
          return "translate-x-[-20px]"
        case "right":
          return "translate-x-[20px]"
        case "up":
          return "translate-y-[20px]"
        case "down":
          return "translate-y-[-20px]"
        default:
          return "translate-y-[20px]"
      }
    }
    return "translate-x-0 translate-y-0"
  }

  return (
    <div
      className={`transition-all duration-500 transform ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${getTransform()} ${className}`}
    >
      {children}
    </div>
  )
}

interface CountUpProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function CountUp({ end, duration = 2000, prefix = "", suffix = "", className = "" }: CountUpProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return (
    <span className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
}

export function FloatingElement({ children, className = "" }: FloatingElementProps) {
  return (
    <div className={`animate-float ${className}`}>
      {children}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

interface ShakeElementProps {
  children: React.ReactNode
  trigger: boolean
  className?: string
}

export function ShakeElement({ children, trigger, className = "" }: ShakeElementProps) {
  return (
    <div className={`${trigger ? "animate-shake" : ""} ${className}`}>
      {children}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(2px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
