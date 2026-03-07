import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InventoryContent } from "@/components/inventory/inventory-content"

export default async function InventoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: inventory } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return <InventoryContent items={inventory ?? []} />
}
