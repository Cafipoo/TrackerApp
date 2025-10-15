import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { habitSchema } from "@/lib/validations/habit"

// GET /api/habits - Récupérer toutes les habitudes de l'utilisateur
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      )
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: session.user.id,
        isActive: true
      },
      include: {
        completions: {
          orderBy: {
            date: 'desc'
          },
          take: 30 // Dernières 30 complétions
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ habits })
  } catch (error) {
    console.error("Erreur lors de la récupération des habitudes:", error)
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// POST /api/habits - Créer une nouvelle habitude
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
    const validatedData = habitSchema.parse(body)

    const habit = await prisma.habit.create({
      data: {
        ...validatedData,
        userId: session.user.id
      }
    })

    return NextResponse.json(
      { 
        message: "Habitude créée avec succès", 
        habit 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur lors de la création de l'habitude:", error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
