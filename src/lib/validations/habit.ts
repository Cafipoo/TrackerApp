import { z } from "zod"

// Liste des catégories valides
const VALID_CATEGORIES = [
  "health",
  "fitness", 
  "learning",
  "productivity",
  "lifestyle",
  "creativity",
  "mindfulness",
  "social",
  "finance",
  "nature"
] as const

export const habitSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom de l'habitude est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),
  frequency: z
    .enum(["daily", "weekly", "monthly"], {
      errorMap: () => ({ message: "La fréquence doit être quotidienne, hebdomadaire ou mensuelle" })
    })
    .default("daily"),
  category: z
    .enum(VALID_CATEGORIES, {
      errorMap: () => ({ message: "Catégorie invalide" })
    }),
  iconName: z
    .string()
    .min(1, "L'icône est requise")
    .default("heart"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "La couleur doit être au format hexadécimal (#RRGGBB)")
    .default("#3b82f6"),
})

export const updateHabitSchema = habitSchema.partial().extend({
  id: z.string().min(1, "L'ID de l'habitude est requis"),
})

export const deleteHabitSchema = z.object({
  id: z.string().min(1, "L'ID de l'habitude est requis"),
})

export type HabitFormData = z.infer<typeof habitSchema>
export type UpdateHabitData = z.infer<typeof updateHabitSchema>
export type DeleteHabitData = z.infer<typeof deleteHabitSchema>
