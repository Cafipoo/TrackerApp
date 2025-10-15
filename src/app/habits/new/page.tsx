import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HabitForm } from "@/components/habits/habit-form"
import { Navbar } from "@/components/layout/navbar"

export default async function NewHabitPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        userName={session.user?.name || undefined} 
        userEmail={session.user?.email || undefined} 
      />
      <div className="container mx-auto py-8 px-4">
        <HabitForm mode="create" />
      </div>
    </div>
  )
}
