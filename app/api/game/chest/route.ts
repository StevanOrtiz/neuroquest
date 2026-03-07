import { createClient } from "@/lib/supabase/server"
import type { ChestReward } from "@/lib/types"

const ITEM_ICONS: Record<string, string> = {
  extra_life: "❤️",
  fifty_fifty: "⚖️",
  skip_question: "⏭️",
  double_xp: "⚡",
  hint: "💡",
}

const CHEST_POOL: ChestReward[] = [
  { item_type: "extra_life", item_name: "Vida Extra", item_description: "Recupera una vida durante la batalla", rarity: "common" },
  { item_type: "fifty_fifty", item_name: "50/50", item_description: "Elimina dos opciones incorrectas", rarity: "rare" },
  { item_type: "skip_question", item_name: "Saltar Pregunta", item_description: "Salta una pregunta sin perder vida", rarity: "rare" },
  { item_type: "double_xp", item_name: "Doble XP", item_description: "Duplica la XP de tu proxima respuesta correcta", rarity: "legendary" },
  { item_type: "hint", item_name: "Pista", item_description: "Recibe una pista sobre la respuesta correcta", rarity: "common" },
]

function rollChest(): ChestReward {
  const roll = Math.random()
  let pool: ChestReward[]

  if (roll < 0.1) {
    pool = CHEST_POOL.filter((i) => i.rarity === "legendary")
  } else if (roll < 0.35) {
    pool = CHEST_POOL.filter((i) => i.rarity === "rare")
  } else {
    pool = CHEST_POOL.filter((i) => i.rarity === "common")
  }

  // Fallback in case pool is empty
  if (pool.length === 0) pool = CHEST_POOL

  return pool[Math.floor(Math.random() * pool.length)]
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  const { sessionId } = await req.json()

  if (!sessionId) {
    return Response.json({ error: "Falta sessionId" }, { status: 400 })
  }

  // Verify the session belongs to the user and is a victory
  const { data: session } = await supabase
    .from("game_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .eq("status", "victory")
    .single()

  if (!session) {
    return Response.json({ error: "Sesion no valida para cofre" }, { status: 400 })
  }

  const reward = rollChest()
  const icon = ITEM_ICONS[reward.item_type] ?? "⚡"

  // Upsert inventory item — increment quantity if exists, insert if not
  const { data: existing } = await supabase
    .from("inventory_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("item_type", reward.item_type)
    .single()

  if (existing) {
    await supabase
      .from("inventory_items")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id)
  } else {
    await supabase.from("inventory_items").insert({
      user_id: user.id,
      item_type: reward.item_type,
      item_name: reward.item_name,
      item_description: reward.item_description,
      icon,
    })
  }

  return Response.json({ reward })
}
