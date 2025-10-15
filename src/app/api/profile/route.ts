import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const profileUpdateSchema = z.object({
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

// GET /api/profile - Récupérer les informations du profil
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Mettre à jour le profil
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = profileUpdateSchema.parse(body)

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (validatedData.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: validatedData.email
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { message: "Cette adresse email est déjà utilisée" },
          { status: 400 }
        )
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(
      { 
        message: "Profil mis à jour avec succès", 
        user: updatedUser 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    
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
