import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { updateHabitSchema } from "@/lib/validations/habit"

// GET /api/habits/[id] - Récupérer une habitude spécifique
export async function GET(
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

    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        completions: {
          orderBy: {
            date: 'desc'
          },
          take: 30
        }
      }
    })

    if (!habit) {
      return NextResponse.json(
        { message: "Habitude non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json({ habit })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'habitude:", error)
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// PUT /api/habits/[id] - Modifier une habitude
export async function PUT(
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
    const validatedData = updateHabitSchema.parse({
      ...body,
      id: params.id
    })

    // Vérifier que l'habitude appartient à l'utilisateur
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      }
    })

    if (!existingHabit) {
      return NextResponse.json(
        { message: "Habitude non trouvée" },
        { status: 404 }
      )
    }

    // Mettre à jour l'habitude
    const updatedHabit = await prisma.habit.update({
      where: {
        id: params.id
      },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        frequency: validatedData.frequency,
        category: validatedData.category,
        iconName: validatedData.iconName,
        color: validatedData.color,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(
      { 
        message: "Habitude modifiée avec succès", 
        habit: updatedHabit 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de la modification de l'habitude:", error)
    
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

// DELETE /api/habits/[id] - Archiver une habitude (suppression douce)
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

    // Récupérer l'habitude avec ses complétions
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        completions: true
      }
    })

    if (!existingHabit) {
      return NextResponse.json(
        { message: "Habitude non trouvée" },
        { status: 404 }
      )
    }

    // Créer une entrée dans DeletedHabit avec toutes les données
    const deletedHabit = await prisma.deletedHabit.create({
      data: {
        originalId: existingHabit.id,
        name: existingHabit.name,
        description: existingHabit.description,
        frequency: existingHabit.frequency,
        category: existingHabit.category,
        color: existingHabit.color,
        iconName: existingHabit.iconName,
        isActive: existingHabit.isActive,
        createdAt: existingHabit.createdAt,
        updatedAt: existingHabit.updatedAt,
        deletedAt: new Date(),
        userId: session.user.id,
        completions: {
          create: existingHabit.completions.map(completion => ({
            date: completion.date,
            completed: completion.completed,
            notes: completion.notes,
            createdAt: completion.createdAt
          }))
        }
      }
    })

    // Supprimer l'habitude originale (cascade supprimera aussi les complétions)
    await prisma.habit.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json(
      { 
        message: "Habitude archivée avec succès",
        deletedHabitId: deletedHabit.id
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de l'archivage de l'habitude:", error)
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}