import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { HabitForm } from "@/components/habits/habit-form"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EditHabitPageProps {
  params: {
    id: string
  }
}

export default async function EditHabitPage({ params }: EditHabitPageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Récupérer l'habitude à modifier
  const habit = await prisma.habit.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!habit) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Habitude introuvable</CardTitle>
              <CardDescription>
                L'habitude que vous cherchez à modifier n'existe pas ou ne vous appartient pas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Cette habitude n'a pas été trouvée dans votre compte.
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour au dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Préparer les données initiales pour le formulaire
  const initialData = {
    name: habit.name,
    description: habit.description || "",
    frequency: habit.frequency as "daily" | "weekly" | "monthly",
    category: (habit.category as "health" | "fitness" | "learning" | "productivity" | "lifestyle" | "creativity" | "mindfulness" | "social" | "finance" | "nature") || "health",
    iconName: habit.iconName || "heart",
    color: habit.color || "#3b82f6",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        userName={session.user?.name || undefined} 
        userEmail={session.user?.email || undefined} 
      />
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Modifier l'habitude</h1>
            <p className="text-gray-600 mt-2">
              Ajustez les paramètres de votre habitude "{habit.name}"
            </p>
          </div>

          <HabitForm
            mode="edit"
            initialData={initialData}
            habitId={habit.id}
          />
        </div>
      </div>
    </div>
  )
}
