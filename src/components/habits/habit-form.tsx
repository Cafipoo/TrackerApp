"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CategoryIcon, CATEGORIES, type CategoryId } from "@/components/ui/category-icon"
import { habitSchema, type HabitFormData } from "@/lib/validations/habit"

interface HabitFormProps {
  mode: "create" | "edit"
  initialData?: Partial<HabitFormData>
  habitId?: string
  onSuccess?: () => void
}

export function HabitForm({ mode, initialData, habitId, onSuccess }: HabitFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(
    (initialData?.category as CategoryId) || "health"
  )
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      frequency: initialData?.frequency || "daily",
      category: initialData?.category || "health",
      iconName: initialData?.iconName || "heart",
      color: initialData?.color || "#3b82f6",
    },
  })

  const watchedColor = watch("color")
  const watchedIconName = watch("iconName")

  const onSubmit = async (data: HabitFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const url = mode === "create" ? "/api/habits" : `/api/habits/${habitId}`
      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la sauvegarde")
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategorySelect = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId)
    setValue("category", categoryId)
    
    const category = CATEGORIES.find(cat => cat.id === categoryId)
    if (category) {
      setValue("iconName", category.icon)
      setValue("color", category.color)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {mode === "create" ? "Créer une nouvelle habitude" : "Modifier l'habitude"}
        </CardTitle>
        <CardDescription>
          {mode === "create" 
            ? "Ajoutez une nouvelle habitude à suivre quotidiennement"
            : "Modifiez les détails de votre habitude"
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nom de l'habitude */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'habitude *</Label>
            <Input
              id="name"
              placeholder="Ex: Boire 2L d'eau par jour"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <textarea
              id="description"
              placeholder="Décrivez votre habitude..."
              rows={3}
              {...register("description")}
              className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Fréquence */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Fréquence *</Label>
            <select
              id="frequency"
              {...register("frequency")}
              className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.frequency ? "border-red-500" : ""
              }`}
            >
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
            </select>
            {errors.frequency && (
              <p className="text-sm text-red-500">{errors.frequency.message}</p>
            )}
          </div>

          {/* Catégories */}
          <div className="space-y-3">
            <Label>Catégorie *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedCategory === category.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <CategoryIcon
                      iconName={category.icon}
                      color={category.color}
                      size="lg"
                    />
                    <span className="text-xs font-medium text-center">
                      {category.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Aperçu de l'icône */}
          <div className="space-y-3">
            <Label>Aperçu</Label>
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
              <CategoryIcon
                iconName={watchedIconName}
                color={watchedColor}
                size="lg"
              />
              <div>
                <p className="font-medium">{watch("name") || "Nom de l'habitude"}</p>
                <p className="text-sm text-muted-foreground">
                  {watch("description") || "Description de l'habitude"}
                </p>
              </div>
            </div>
          </div>

          {/* Palette de couleurs */}
          <div className="space-y-3">
            <Label>Couleur de l'habitude</Label>
            <div className="grid grid-cols-6 gap-3">
              {[
                { name: "Bleu", value: "#3b82f6", bg: "bg-blue-500" },
                { name: "Rouge", value: "#ef4444", bg: "bg-red-500" },
                { name: "Vert", value: "#22c55e", bg: "bg-green-500" },
                { name: "Orange", value: "#f97316", bg: "bg-orange-500" },
                { name: "Violet", value: "#8b5cf6", bg: "bg-purple-500" },
                { name: "Rose", value: "#ec4899", bg: "bg-pink-500" },
                { name: "Cyan", value: "#06b6d4", bg: "bg-cyan-500" },
                { name: "Jaune", value: "#eab308", bg: "bg-yellow-500" },
                { name: "Indigo", value: "#6366f1", bg: "bg-indigo-500" },
                { name: "Emeraude", value: "#10b981", bg: "bg-emerald-500" },
                { name: "Lime", value: "#84cc16", bg: "bg-lime-500" },
                { name: "Ambre", value: "#f59e0b", bg: "bg-amber-500" },
                { name: "Teal", value: "#14b8a6", bg: "bg-teal-500" },
                { name: "Fuchsia", value: "#d946ef", bg: "bg-fuchsia-500" },
                { name: "Slate", value: "#64748b", bg: "bg-slate-500" },
                { name: "Stone", value: "#78716c", bg: "bg-stone-500" },
              ].map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setValue("color", color.value)}
                  className={`relative w-12 h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                    watchedColor === color.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  {watchedColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: watchedColor }}></div>
              <span>Couleur sélectionnée : {watchedColor}</span>
            </div>
            {errors.color && (
              <p className="text-sm text-red-500">{errors.color.message}</p>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Créer l'habitude" : "Sauvegarder"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
