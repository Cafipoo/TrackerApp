import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/deleted-habits - Récupérer toutes les habitudes supprimées de l'utilisateur
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      )
    }

    const deletedHabits = await prisma.deletedHabit.findMany({
      where: {
        userId: session.user.id,
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
        deletedAt: 'desc'
      }
    })

    return NextResponse.json({ deletedHabits })
  } catch (error) {
    console.error("Erreur lors de la récupération des habitudes supprimées:", error)
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
