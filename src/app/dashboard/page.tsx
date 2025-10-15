import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { HabitsList } from "@/components/habits/habits-list"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Récupérer les habitudes de l'utilisateur
  const habits = await prisma.habit.findMany({
    where: {
      userId: session.user.id,
      isActive: true
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
      createdAt: 'desc'
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenue, {session.user?.name || "Utilisateur"} !
            </h1>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/deleted-habits">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Habitudes supprimées
                </Link>
              </Button>
              <Button asChild>
                <Link href="/habits/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle habitude
                </Link>
              </Button>
            </div>
          </div>
        
        <div className="space-y-6">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Total des habitudes</h3>
              <p className="text-3xl font-bold text-blue-600">{habits.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Habitudes actives</h3>
              <p className="text-3xl font-bold text-green-600">
                {habits.filter(h => h.isActive).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Complétions aujourd'hui</h3>
              <p className="text-3xl font-bold text-purple-600">
                {habits.reduce((acc, habit) => {
                  const today = new Date().toDateString()
                  const todayCompletion = habit.completions.find(c => 
                    new Date(c.date).toDateString() === today && c.completed
                  )
                  return acc + (todayCompletion ? 1 : 0)
                }, 0)}
              </p>
            </div>
          </div>

          {/* Liste des habitudes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Mes habitudes</h2>
              <p className="text-gray-600">
                Gérez et suivez vos habitudes quotidiennes
              </p>
            </div>
            <div className="p-6">
              <HabitsList habits={habits} />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
