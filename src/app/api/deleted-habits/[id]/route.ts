import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

// DELETE /api/deleted-habits/[id] - Supprimer définitivement une habitude archivée
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

    // Vérifier que l'habitude supprimée appartient à l'utilisateur
    const existingDeletedHabit = await prisma.deletedHabit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      }
    })

    if (!existingDeletedHabit) {
      return NextResponse.json(
        { message: "Habitude supprimée non trouvée" },
        { status: 404 }
      )
    }

    // Supprimer définitivement l'habitude archivée (cascade supprimera aussi les complétions)
    await prisma.deletedHabit.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json(
      { message: "Habitude supprimée définitivement" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de la suppression définitive de l'habitude:", error)
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
