import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Calendar, 
  Target, 
  CheckCircle, 
  TrendingUp, 
  Award,
  Edit,
  Key,
  Settings
} from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Récupérer les informations complètes de l'utilisateur
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    include: {
      habits: {
        where: {
          isActive: true
        },
        include: {
          completions: {
            orderBy: {
              date: 'desc'
            },
            take: 30
          }
        }
      },
      deletedHabits: {
        include: {
          completions: {
            orderBy: {
              date: 'desc'
            },
            take: 30
          }
        }
      }
    }
  })

  if (!user) {
    redirect("/login")
  }

  // Calculer les statistiques
  const totalHabits = user.habits.length
  const totalDeletedHabits = user.deletedHabits.length
  const totalHabitsEver = totalHabits + totalDeletedHabits

  // Calculer les complétions d'aujourd'hui
  const today = new Date().toDateString()
  const todayCompletions = user.habits.reduce((acc, habit) => {
    const todayCompletion = habit.completions.find(c => 
      new Date(c.date).toDateString() === today && c.completed
    )
    return acc + (todayCompletion ? 1 : 0)
  }, 0)

  // Calculer le taux de réussite global
  const totalCompletions = user.habits.reduce((acc, habit) => {
    return acc + habit.completions.filter(c => c.completed).length
  }, 0)

  const totalPossibleCompletions = user.habits.reduce((acc, habit) => {
    const daysSinceCreation = Math.ceil(
      (new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    return acc + Math.max(0, daysSinceCreation)
  }, 0)

  const successRate = totalPossibleCompletions > 0 
    ? Math.round((totalCompletions / totalPossibleCompletions) * 100)
    : 0

  // Calculer la plus longue série (streak)
  const longestStreak = Math.max(...user.habits.map(habit => {
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateString = checkDate.toDateString()
      
      const completion = habit.completions.find(c => 
        new Date(c.date).toDateString() === dateString && c.completed
      )
      
      if (completion) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }), 0)

  // Calculer les habitudes par catégorie
  const habitsByCategory = user.habits.reduce((acc, habit) => {
    const category = habit.category || 'other'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(habitsByCategory)
    .sort(([,a], [,b]) => b - a)[0]

  // Calculer les habitudes par fréquence
  const habitsByFrequency = user.habits.reduce((acc, habit) => {
    acc[habit.frequency] = (acc[habit.frequency] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        userName={session.user?.name || undefined} 
        userEmail={session.user?.email || undefined} 
      />
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-8 w-8 text-gray-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
                <p className="text-gray-600">Consultez et gérez vos informations personnelles</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations personnelles */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Nom</p>
                      <p className="text-sm text-gray-600">{user.name || "Non renseigné"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Membre depuis</p>
                      <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <Link href="/profile/edit">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href="/profile/change-password">
                          <Key className="h-4 w-4 mr-2" />
                          Mot de passe
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistiques principales */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Statistiques personnelles
                  </CardTitle>
                  <CardDescription>
                    Vos performances et votre progression
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{totalHabits}</div>
                      <div className="text-sm text-gray-600">Habitudes actives</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{todayCompletions}</div>
                      <div className="text-sm text-gray-600">Aujourd'hui</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
                      <div className="text-sm text-gray-600">Taux de réussite</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{longestStreak}</div>
                      <div className="text-sm text-gray-600">Meilleur streak</div>
                    </div>
                  </div>

                  {/* Détails des statistiques */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Répartition par catégorie</h4>
                      <div className="space-y-2">
                        {Object.entries(habitsByCategory).map(([category, count]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{category}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                        {Object.keys(habitsByCategory).length === 0 && (
                          <p className="text-sm text-gray-500">Aucune habitude créée</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Répartition par fréquence</h4>
                      <div className="space-y-2">
                        {Object.entries(habitsByFrequency).map(([frequency, count]) => (
                          <div key={frequency} className="flex justify-between items-center">
                            <span className="text-sm capitalize">
                              {frequency === 'daily' ? 'Quotidienne' : 
                               frequency === 'weekly' ? 'Hebdomadaire' : 'Mensuelle'}
                            </span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                        {Object.keys(habitsByFrequency).length === 0 && (
                          <p className="text-sm text-gray-500">Aucune habitude créée</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Statistiques avancées */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Historique et réalisations
                </CardTitle>
                <CardDescription>
                  Votre parcours et vos accomplissements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">{totalHabitsEver}</div>
                    <div className="text-sm text-gray-600">Habitudes créées au total</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {totalHabits} actives, {totalDeletedHabits} archivées
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-600">{totalCompletions}</div>
                    <div className="text-sm text-gray-600">Complétions totales</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Toutes habitudes confondues
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-rose-600">
                      {Math.ceil((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-gray-600">Jours d'utilisation</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Depuis votre inscription
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
