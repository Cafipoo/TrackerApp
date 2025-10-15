import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { DeletedHabitsList } from "@/components/habits/deleted-habits-list"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"

export default async function DeletedHabitsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Récupérer les habitudes supprimées de l'utilisateur
  const deletedHabits = await prisma.deletedHabit.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      completions: {
        orderBy: {
          date: 'desc'
        },
        take: 30
      }
    },
    orderBy: {
      deletedAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        userName={session.user?.name || undefined} 
        userEmail={session.user?.email || undefined} 
      />
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <Trash2 className="h-8 w-8 text-gray-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Habitudes supprimées
              </h1>
            </div>
            <p className="text-gray-600">
              Gérez vos habitudes archivées. Vous pouvez les restaurer ou les supprimer définitivement.
            </p>
          </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Habitudes archivées</h2>
            <p className="text-gray-600">
              {deletedHabits.length} habitude{deletedHabits.length > 1 ? 's' : ''} supprimée{deletedHabits.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="p-6">
            <DeletedHabitsList deletedHabits={deletedHabits} />
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
