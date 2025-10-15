import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

// POST /api/deleted-habits/[id]/restore - Restaurer une habitude supprimée
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

    // Récupérer l'habitude supprimée avec ses complétions
    const deletedHabit = await prisma.deletedHabit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        completions: true
      }
    })

    if (!deletedHabit) {
      return NextResponse.json(
        { message: "Habitude supprimée non trouvée" },
        { status: 404 }
      )
    }

    // Vérifier qu'une habitude avec le même originalId n'existe pas déjà
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: deletedHabit.originalId,
        userId: session.user.id,
      }
    })

    if (existingHabit) {
      return NextResponse.json(
        { message: "Cette habitude existe déjà" },
        { status: 400 }
      )
    }

    // Créer une nouvelle habitude avec les données archivées
    const restoredHabit = await prisma.habit.create({
      data: {
        id: deletedHabit.originalId, // Utiliser l'ID original
        name: deletedHabit.name,
        description: deletedHabit.description,
        frequency: deletedHabit.frequency,
        category: deletedHabit.category,
        color: deletedHabit.color,
        iconName: deletedHabit.iconName,
        isActive: deletedHabit.isActive,
        createdAt: deletedHabit.createdAt,
        updatedAt: new Date(), // Mettre à jour la date de modification
        userId: session.user.id,
        completions: {
          create: deletedHabit.completions.map(completion => ({
            date: completion.date,
            completed: completion.completed,
            notes: completion.notes,
            createdAt: completion.createdAt
          }))
        }
      }
    })

    // Supprimer l'entrée de la table des habitudes supprimées
    await prisma.deletedHabit.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json(
      { 
        message: "Habitude restaurée avec succès",
        habit: restoredHabit
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de la restauration de l'habitude:", error)
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
