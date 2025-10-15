"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { z } from "zod"

const profileEditSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
})

type ProfileEditData = z.infer<typeof profileEditSchema>

interface ProfileEditFormProps {
  initialData: {
    name: string
    email: string
  }
}

export function ProfileEditForm({ initialData }: ProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileEditData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
    },
  })

  const onSubmit = async (data: ProfileEditData) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la mise à jour")
      }

      setSuccess("Profil mis à jour avec succès")
      router.refresh()
      
      // Rediriger vers le profil après 2 secondes
      setTimeout(() => {
        router.push("/profile")
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Nom */}
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet *</Label>
        <Input
          id="name"
          placeholder="Votre nom complet"
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Adresse email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading || !isDirty}
          className="flex-1"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Mise à jour..." : "Sauvegarder"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/profile")}
          disabled={isLoading}
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
