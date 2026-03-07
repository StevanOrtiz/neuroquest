import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GameClient } from "@/components/game/game-client"

interface GamePageProps {
  params: Promise<{ sessionId: string }>
}

export default async function GamePage({ params }: GamePageProps) {
  const { sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: session } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single()

  if (!session) redirect("/dashboard")

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("session_id", sessionId)
    .eq("user_id", user.id)
    .order("question_index", { ascending: true })

  // Get inventory for power-ups
  const { data: inventory } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("user_id", user.id)

  return (
    <GameClient
      session={session}
      questions={questions ?? []}
      inventory={inventory ?? []}
    />
  )
}
