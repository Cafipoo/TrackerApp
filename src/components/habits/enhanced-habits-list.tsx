"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Edit, Trash2, Calendar, Target, Grid, List as ListIcon, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryIcon, CATEGORIES } from "@/components/ui/category-icon"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HabitsSearchFilter } from "./habits-search-filter"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Habit {
  id: string
  name: string
  description: string | null
  frequency: string
  category: string | null
  iconName: string | null
  color: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  completions: {
    id: string
    date: Date
    completed: boolean
    notes: string | null
  }[]
}

interface EnhancedHabitsListProps {
  habits: Habit[]
}

type ViewMode = "grid" | "list"
type SortOption = "name" | "createdAt" | "frequency" | "category"

export function EnhancedHabitsList({ habits }: EnhancedHabitsListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  
  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFrequency, setSelectedFrequency] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  const router = useRouter()

  const handleCompleteHabit = async (habitId: string) => {
    setIsLoading(habitId)
    setError("")

    try {
      const today = new Date().toISOString().split('T')[0]
      
      const response = await fetch(`/api/habits/${habitId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: today })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la validation")
      }

      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsLoading(null)
    }
  }

  const handleDeleteHabit = async (habitId: string) => {
    setIsLoading(habitId)
    setError("")

    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la suppression")
      }

      setDeleteDialog(null)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsLoading(null)
    }
  }

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toDateString()
    return habit.completions.some(c => 
      new Date(c.date).toDateString() === today && c.completed
    )
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "daily": return "Quotidienne"
      case "weekly": return "Hebdomadaire"
      case "monthly": return "Mensuelle"
      default: return frequency
    }
  }

  const getStreakCount = (habit: Habit) => {
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
  }

  const getCategoryName = (categoryId: string) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  // Filtrage et tri des habitudes
  const filteredAndSortedHabits = useMemo(() => {
    let filtered = habits.filter(habit => {
      // Filtre par terme de recherche
      if (searchTerm && !habit.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !habit.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Filtre par catégorie
      if (selectedCategory !== "all" && habit.category !== selectedCategory) {
        return false
      }

      // Filtre par fréquence
      if (selectedFrequency !== "all" && habit.frequency !== selectedFrequency) {
        return false
      }

      return true
    })

    // Tri des habitudes
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case "frequency":
          comparison = a.frequency.localeCompare(b.frequency)
          break
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "")
          break
        default:
          comparison = 0
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [habits, searchTerm, selectedCategory, selectedFrequency, sortBy, sortOrder])

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedFrequency("all")
    setSortBy("createdAt")
    setSortOrder("desc")
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune habitude pour le moment
        </h3>
        <p className="text-gray-500 mb-6">
          Commencez par créer votre première habitude à suivre.
        </p>
        <Button onClick={() => router.push("/habits/new")}>
          Créer ma première habitude
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <HabitsSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedFrequency={selectedFrequency}
          setSelectedFrequency={setSelectedFrequency}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onClearFilters={clearAllFilters}
        />
      </div>

      {/* Contrôles d'affichage */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {filteredAndSortedHabits.length} habitude{filteredAndSortedHabits.length > 1 ? 's' : ''} trouvée{filteredAndSortedHabits.length > 1 ? 's' : ''}
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Liste des habitudes */}
      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
        : "space-y-4"
      }>
        {filteredAndSortedHabits.map((habit) => {
          const completed = isCompletedToday(habit)
          const streak = getStreakCount(habit)
          
          return (
            <Card key={habit.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CategoryIcon
                      iconName={habit.iconName || "heart"}
                      color={habit.color || "#3b82f6"}
                      size="md"
                    />
                    <div>
                      <CardTitle className="text-lg">{habit.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {getFrequencyText(habit.frequency)}
                        {habit.category && (
                          <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                            {getCategoryName(habit.category)}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/habits/${habit.id}/edit`)}
                      title="Modifier l'habitude"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog(habit.id)}
                      title="Archiver l'habitude"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {habit.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {habit.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{streak} jours</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleCompleteHabit(habit.id)}
                    disabled={isLoading === habit.id || completed}
                    variant={completed ? "outline" : "default"}
                    size="sm"
                    className={completed ? "bg-green-50 text-green-700 border-green-200" : ""}
                  >
                    {isLoading === habit.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : completed ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Terminé
                      </>
                    ) : (
                      "Marquer comme fait"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAndSortedHabits.length === 0 && habits.length > 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune habitude trouvée
          </h3>
          <p className="text-gray-500 mb-6">
            Essayez de modifier vos critères de recherche ou de filtrage.
          </p>
          <Button onClick={clearAllFilters}>
            Effacer tous les filtres
          </Button>
        </div>
      )}

      {/* Dialog de confirmation d'archivage */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archiver l'habitude</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir archiver cette habitude ? Elle sera déplacée vers la corbeille et pourra être restaurée plus tard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(null)}
              disabled={isLoading !== null}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDeleteHabit(deleteDialog)}
              disabled={isLoading !== null}
            >
              {isLoading === deleteDialog ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                "Archiver"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
