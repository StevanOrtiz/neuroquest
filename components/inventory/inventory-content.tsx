"use client"

<<<<<<< HEAD
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Divide, SkipForward, Zap, Lightbulb, Package } from "lucide-react"
import type { ChestReward } from "@/lib/types"
=======
import { motion } from "framer-motion"
import { InventoryItem } from "@/lib/types"
import { Heart, Divide, SkipForward, Zap, Lightbulb, Package } from "lucide-react"
>>>>>>> f7fef1e511e8ef115bd771a4ec6bdde2208272c5

const ITEM_ICONS: Record<string, React.ElementType> = {
  extra_life: Heart,
  fifty_fifty: Divide,
  skip_question: SkipForward,
  double_xp: Zap,
  hint: Lightbulb,
}

const ITEM_COLORS: Record<string, string> = {
<<<<<<< HEAD
  extra_life: "text-red-400 border-red-400/40 bg-red-400/10",
  fifty_fifty: "text-blue-400 border-blue-400/40 bg-blue-400/10",
  skip_question: "text-green-400 border-green-400/40 bg-green-400/10",
  double_xp: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  hint: "text-purple-400 border-purple-400/40 bg-purple-400/10",
}

const RARITY_LABELS: Record<string, string> = {
  common: "Común",
  rare: "Raro",
  legendary: "Legendario",
}

const RARITY_GLOW: Record<string, string> = {
  common: "shadow-md shadow-white/10",
  rare: "shadow-lg shadow-blue-500/40",
  legendary: "shadow-xl shadow-purple-500/60",
}

const CARD_WIDTH = 96 // px, matches w-24
const CARD_GAP = 12 // px gap between cards
const CARD_FULL = CARD_WIDTH + CARD_GAP
const VISIBLE_CARDS = 7 // must be odd
const CONTAINER_WIDTH = VISIBLE_CARDS * CARD_FULL
const CENTER_OFFSET = Math.floor(VISIBLE_CARDS / 2) * CARD_FULL

interface ChestRouletteProps {
  rouletteItems: ChestReward[]
  finalReward: ChestReward
  onComplete: () => void
}

export function ChestRoulette({ rouletteItems, finalReward, onComplete }: ChestRouletteProps) {
  const [translateX, setTranslateX] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [done, setDone] = useState(false)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    // Build the strip: rouletteItems (shuffled) + finalReward at landing position
    // We want the final reward to land at the center slot
    // Landing index = rouletteItems.length (0-based end index)
    // We inject the finalReward at that position
    const stripItems = [...rouletteItems, finalReward]

    // Start position: center the first card
    const startX = CENTER_OFFSET
    setTranslateX(startX)

    // Target: land finalReward (last item) at center
    const targetIndex = stripItems.length - 1
    const targetX = CENTER_OFFSET - targetIndex * CARD_FULL

    // Small delay then animate
    setTimeout(() => {
      setSpinning(true)
      setTranslateX(targetX)

      setTimeout(() => {
        setSpinning(false)
        setDone(true)
        setTimeout(onComplete, 900)
      }, 3400)
    }, 200)
  }, [rouletteItems, finalReward, onComplete])

  const stripItems = [...rouletteItems, finalReward]

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <p className="text-sm text-muted-foreground font-mono animate-pulse">
        {spinning ? "Girando..." : done ? "¡Obteniste un ítem!" : "Preparando ruleta..."}
      </p>

      {/* Ruleta */}
      <div
        className="relative overflow-hidden rounded-xl border border-border/60 bg-card"
        style={{ width: CONTAINER_WIDTH, height: 120 }}
      >
        {/* Indicador central */}
        <div
          className="absolute top-0 bottom-0 z-10 pointer-events-none"
          style={{
            left: CENTER_OFFSET + CARD_WIDTH / 2 - 1,
            width: 2,
            background: "oklch(0.82 0.16 85)",
            boxShadow: "0 0 8px oklch(0.82 0.16 85)",
          }}
        />

        {/* Fade izquierda */}
        <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-card to-transparent" />
        {/* Fade derecha */}
        <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-card to-transparent" />

        {/* Strip de items */}
        <div
          className="absolute top-0 bottom-0 flex items-center"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: spinning
              ? "transform 3.2s cubic-bezier(0.15, 0.85, 0.35, 1.0)"
              : "none",
            gap: CARD_GAP,
            paddingLeft: CARD_GAP / 2,
          }}
        >
          {stripItems.map((item, i) => {
            const Icon = ITEM_ICONS[item.item_type] ?? Package
            const colorClass = ITEM_COLORS[item.item_type] ?? "text-muted-foreground border-border"
            const isFinal = i === stripItems.length - 1
            return (
              <div
                key={i}
                className={`flex flex-col items-center justify-center rounded-lg border-2 transition-all select-none ${colorClass} ${
                  isFinal && done ? RARITY_GLOW[item.rarity] : ""
                }`}
                style={{ width: CARD_WIDTH, height: 88, flexShrink: 0 }}
              >
                <Icon className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium text-center leading-tight px-1">
                  {item.item_name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Resultado final */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 w-full max-w-xs ${
              ITEM_COLORS[finalReward.item_type]
            } ${RARITY_GLOW[finalReward.rarity]}`}
          >
            {(() => {
              const Icon = ITEM_ICONS[finalReward.item_type] ?? Package
              return <Icon className="w-10 h-10" />
            })()}
            <p className="text-xs font-mono uppercase tracking-widest opacity-70">
              {RARITY_LABELS[finalReward.rarity]}
            </p>
            <p className="text-lg font-bold text-foreground">{finalReward.item_name}</p>
            <p className="text-sm text-muted-foreground text-center">{finalReward.item_description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
=======
  extra_life: "text-rpg-health border-rpg-health/30 bg-rpg-health/5",
  fifty_fifty: "text-rpg-mana border-rpg-mana/30 bg-rpg-mana/5",
  skip_question: "text-primary border-primary/30 bg-primary/5",
  double_xp: "text-rpg-gold border-rpg-gold/30 bg-rpg-gold/5",
  hint: "text-rpg-legendary border-rpg-legendary/30 bg-rpg-legendary/5",
}

interface InventoryContentProps {
  items: InventoryItem[]
}

export function InventoryContent({ items }: InventoryContentProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-6 h-6 text-rpg-gold" />
        <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
      </div>

      {items.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Tu inventario esta vacio</p>
          <p className="text-sm text-muted-foreground mt-1">
            Gana partidas para obtener cofres con power-ups
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const Icon = ITEM_ICONS[item.item_type] || Package
            const colorClass = ITEM_COLORS[item.item_type] || "text-muted-foreground border-border"
            return (
              <motion.div
                key={item.id}
                className={`p-4 rounded-xl border ${colorClass}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <Icon className="w-6 h-6" />
                  <span className="text-lg font-bold font-mono">{item.quantity}x</span>
                </div>
                <h3 className="font-semibold text-foreground mt-3">{item.item_name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.item_description}</p>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
>>>>>>> f7fef1e511e8ef115bd771a4ec6bdde2208272c5
