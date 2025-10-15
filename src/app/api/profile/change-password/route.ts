import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Le mot de passe actuel est requis"),
  newPassword: z
    .string()
    .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"),
})

// POST /api/profile/change-password - Changer le mot de passe
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    // Récupérer l'utilisateur avec son mot de passe actuel
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      )
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword, 
      user.password
    )

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: "Le mot de passe actuel est incorrect" },
        { status: 400 }
      )
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 10)

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(
      { message: "Mot de passe modifié avec succès" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Données invalides", errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
