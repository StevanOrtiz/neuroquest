"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Skull, Star, Package, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ChestReward } from "@/lib/types"

interface GameOverScreenProps {
  status: "victory" | "defeat"
  sessionId: string
  xpEarned: number
  correctAnswers: number
  totalQuestions: number
  pdfName: string
  onBackToDashboard: () => void
}

export function GameOverScreen({
  status,
  sessionId,
  xpEarned,
  correctAnswers,
  totalQuestions,
  pdfName,
  onBackToDashboard,
}: GameOverScreenProps) {
  const [chestOpened, setChestOpened] = useState(false)
  const [reward, setReward] = useState<ChestReward | null>(null)
  const [openingChest, setOpeningChest] = useState(false)

  const isVictory = status === "victory"
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100)

  async function handleOpenChest() {
    setOpeningChest(true)
    try {
      const res = await fetch("/api/game/chest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
      const data = await res.json()
      if (data.reward) {
        setReward(data.reward)
        setChestOpened(true)
      }
    } catch {
      setOpeningChest(false)
    }
  }

  const rarityColors = {
    common: "text-muted-foreground border-border",
    rare: "text-rpg-mana border-rpg-mana/50 glow-primary",
    legendary: "text-rpg-legendary border-rpg-legendary/50 glow-legendary",
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 rpg-grid-bg">
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Icon */}
        <motion.div
          className="mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isVictory ? (
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto glow-primary">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto glow-health">
              <Skull className="w-10 h-10 text-destructive" />
            </div>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          className={`text-3xl font-bold mb-2 ${isVictory ? "text-primary" : "text-destructive"}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isVictory ? "Victoria!" : "Derrota"}
        </motion.h1>
        <motion.p
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isVictory
            ? `Has conquistado "${pdfName}"`
            : `"${pdfName}" te ha derrotado esta vez`}
        </motion.p>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-3 rounded-xl bg-card border border-border/50">
            <Star className="w-5 h-5 text-rpg-gold mx-auto mb-1" />
            <p className="text-lg font-bold font-mono text-rpg-gold">{xpEarned}</p>
            <p className="text-xs text-muted-foreground">XP ganada</p>
          </div>
          <div className="p-3 rounded-xl bg-card border border-border/50">
            <p className="text-lg font-bold font-mono text-foreground">{correctAnswers}/{totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Correctas</p>
          </div>
          <div className="p-3 rounded-xl bg-card border border-border/50">
            <p className="text-lg font-bold font-mono text-foreground">{accuracy}%</p>
            <p className="text-xs text-muted-foreground">Precision</p>
          </div>
        </motion.div>

        {/* Chest reward (victory only) */}
        {isVictory && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <AnimatePresence mode="wait">
              {!chestOpened ? (
                <motion.div key="chest-closed">
                  <Button
                    onClick={handleOpenChest}
                    disabled={openingChest}
                    variant="outline"
                    size="lg"
                    className="w-full border-rpg-gold/50 text-rpg-gold hover:bg-rpg-gold/10 glow-gold"
                  >
                    {openingChest ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Package className="w-5 h-5 mr-2" />
                        Abrir Cofre de Recompensa
                      </>
                    )}
                  </Button>
                </motion.div>
              ) : reward ? (
                <motion.div
                  key="chest-opened"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`p-4 rounded-xl border-2 bg-card ${rarityColors[reward.rarity]}`}
                >
                  <p className="text-xs font-mono uppercase tracking-wider mb-1 opacity-70">
                    {reward.rarity === "legendary" ? "Legendario!" : reward.rarity === "rare" ? "Raro" : "Comun"}
                  </p>
                  <p className="text-lg font-bold text-foreground">{reward.item_name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{reward.item_description}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Back button */}
        <Button onClick={onBackToDashboard} className="w-full" size="lg">
          Volver al panel
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </main>
  )
}
