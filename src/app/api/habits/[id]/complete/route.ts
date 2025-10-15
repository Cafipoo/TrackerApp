import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const completeHabitSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  notes: z.string().optional(),
})

// POST /api/habits/[id]/complete - Marquer une habitude comme complétée
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { date, notes } = completeHabitSchema.parse(body)

    // Vérifier que l'habitude appartient à l'utilisateur
    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!habit) {
      return NextResponse.json(
        { message: "Habitude non trouvée" },
        { status: 404 }
      )
    }

    // Vérifier si la complétion existe déjà pour cette date
    const existingCompletion = await prisma.habitCompletion.findFirst({
      where: {
        habitId: params.id,
        date: new Date(date)
      }
    })

    let completion

    if (existingCompletion) {
      // Mettre à jour la complétion existante
      completion = await prisma.habitCompletion.update({
        where: { id: existingCompletion.id },
        data: {
          completed: true,
          notes: notes || existingCompletion.notes
        }
      })
    } else {
      // Créer une nouvelle complétion
      completion = await prisma.habitCompletion.create({
        data: {
          habitId: params.id,
          date: new Date(date),
          completed: true,
          notes
        }
      })
    }

    return NextResponse.json(
      { 
        message: "Habitude marquée comme complétée", 
        completion 
      }
    )
  } catch (error) {
    console.error("Erreur lors de la complétion de l'habitude:", error)
    
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

// DELETE /api/habits/[id]/complete - Annuler une complétion
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json(
        { message: "Date requise" },
        { status: 400 }
      )
    }

    // Vérifier que l'habitude appartient à l'utilisateur
    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!habit) {
      return NextResponse.json(
        { message: "Habitude non trouvée" },
        { status: 404 }
      )
    }

    // Supprimer la complétion pour cette date
    await prisma.habitCompletion.deleteMany({
      where: {
        habitId: params.id,
        date: new Date(date)
      }
    })

    return NextResponse.json(
      { message: "Complétion annulée" }
    )
  } catch (error) {
    console.error("Erreur lors de l'annulation de la complétion:", error)
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
