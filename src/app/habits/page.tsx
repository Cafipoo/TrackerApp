import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { EnhancedHabitsList } from "@/components/habits/enhanced-habits-list"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Plus, List, Filter, Search } from "lucide-react"
import Link from "next/link"

export default async function HabitsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Récupérer toutes les habitudes de l'utilisateur
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
            <div className="flex items-center gap-3">
              <List className="h-8 w-8 text-gray-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Mes habitudes
                </h1>
                <p className="text-gray-600 mt-1">
                  Gérez et suivez toutes vos habitudes quotidiennes
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/habits?view=grid">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
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

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Taux de réussite</h3>
              <p className="text-3xl font-bold text-orange-600">
                {habits.length > 0 ? Math.round(
                  (habits.reduce((acc, habit) => {
                    const today = new Date().toDateString()
                    const todayCompletion = habit.completions.find(c => 
                      new Date(c.date).toDateString() === today && c.completed
                    )
                    return acc + (todayCompletion ? 1 : 0)
                  }, 0) / habits.length) * 100
                ) : 0}%
              </p>
            </div>
          </div>

          {/* Liste des habitudes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Toutes mes habitudes</h2>
              <p className="text-gray-600">
                {habits.length} habitude{habits.length > 1 ? 's' : ''} au total
              </p>
            </div>
            <div className="p-6">
              <EnhancedHabitsList habits={habits} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
