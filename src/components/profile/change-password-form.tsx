"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Loader2, Lock, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { z } from "zod"

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Le mot de passe actuel est requis"),
  newPassword: z
    .string()
    .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"),
  confirmPassword: z
    .string()
    .min(1, "La confirmation du mot de passe est requise"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type ChangePasswordData = z.infer<typeof changePasswordSchema>

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const onSubmit = async (data: ChangePasswordData) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors du changement de mot de passe")
      }

      setSuccess("Mot de passe modifié avec succès")
      reset()
      
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

      {/* Mot de passe actuel */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Mot de passe actuel *</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showPasswords.current ? "text" : "password"}
            placeholder="Votre mot de passe actuel"
            {...register("currentPassword")}
            className={errors.currentPassword ? "border-red-500 pr-10" : "pr-10"}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => togglePasswordVisibility("current")}
          >
            {showPasswords.current ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.currentPassword && (
          <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
        )}
      </div>

      {/* Nouveau mot de passe */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nouveau mot de passe *</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPasswords.new ? "text" : "password"}
            placeholder="Votre nouveau mot de passe"
            {...register("newPassword")}
            className={errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => togglePasswordVisibility("new")}
          >
            {showPasswords.new ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.newPassword && (
          <p className="text-sm text-red-500">{errors.newPassword.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Le mot de passe doit contenir au moins 8 caractères avec une minuscule, une majuscule et un chiffre.
        </p>
      </div>

      {/* Confirmation du mot de passe */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showPasswords.confirm ? "text" : "password"}
            placeholder="Confirmez votre nouveau mot de passe"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => togglePasswordVisibility("confirm")}
          >
            {showPasswords.confirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Lock className="mr-2 h-4 w-4" />
          {isLoading ? "Modification..." : "Modifier le mot de passe"}
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
