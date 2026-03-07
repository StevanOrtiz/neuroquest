"use client"

import { motion } from "framer-motion"
import { InventoryItem } from "@/lib/types"
import { Heart, Divide, SkipForward, Zap, Lightbulb, Package } from "lucide-react"

const ITEM_ICONS: Record<string, React.ElementType> = {
  extra_life: Heart,
  fifty_fifty: Divide,
  skip_question: SkipForward,
  double_xp: Zap,
  hint: Lightbulb,
}

const ITEM_COLORS: Record<string, string> = {
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
