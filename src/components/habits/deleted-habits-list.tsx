"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RotateCcw, Trash2, Calendar, Target, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryIcon } from "@/components/ui/category-icon"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeletedHabit {
  id: string
  originalId: string
  name: string
  description: string | null
  frequency: string
  category: string | null
  iconName: string | null
  color: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  completions: {
    id: string
    date: Date
    completed: boolean
    notes: string | null
  }[]
}

interface DeletedHabitsListProps {
  deletedHabits: DeletedHabit[]
}

export function DeletedHabitsList({ deletedHabits }: DeletedHabitsListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const router = useRouter()

  const handleRestoreHabit = async (deletedHabitId: string) => {
    setIsLoading(deletedHabitId)
    setError("")

    try {
      const response = await fetch(`/api/deleted-habits/${deletedHabitId}/restore`, {
        method: "POST"
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la restauration")
      }

      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsLoading(null)
    }
  }

  const handlePermanentDelete = async (deletedHabitId: string) => {
    setIsLoading(deletedHabitId)
    setError("")

    try {
      const response = await fetch(`/api/deleted-habits/${deletedHabitId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la suppression définitive")
      }

      setDeleteDialog(null)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsLoading(null)
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "daily": return "Quotidienne"
      case "weekly": return "Hebdomadaire"
      case "monthly": return "Mensuelle"
      default: return frequency
    }
  }

  const getStreakCount = (habit: DeletedHabit) => {
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  if (deletedHabits.length === 0) {
    return (
      <div className="text-center py-12">
        <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune habitude supprimée
        </h3>
        <p className="text-gray-500 mb-6">
          Les habitudes que vous supprimez apparaîtront ici.
        </p>
        <Button onClick={() => router.push("/dashboard")}>
          Retour au dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deletedHabits.map((habit) => {
          const streak = getStreakCount(habit)
          
          return (
            <Card key={habit.id} className="hover:shadow-md transition-shadow border-red-100">
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
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRestoreHabit(habit.id)}
                      disabled={isLoading === habit.id}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog(habit.id)}
                      disabled={isLoading === habit.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{streak} jours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Supprimée le {formatDate(habit.deletedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRestoreHabit(habit.id)}
                      disabled={isLoading === habit.id}
                      size="sm"
                      className="flex-1"
                    >
                      {isLoading === habit.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Restaurer
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialog(habit.id)}
                      disabled={isLoading === habit.id}
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Dialog de confirmation de suppression définitive */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suppression définitive</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement cette habitude ? 
              Cette action est irréversible et toutes les données associées seront perdues.
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
              onClick={() => deleteDialog && handlePermanentDelete(deleteDialog)}
              disabled={isLoading !== null}
            >
              {isLoading === deleteDialog ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                "Supprimer définitivement"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
