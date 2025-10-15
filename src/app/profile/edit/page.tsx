import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Mail, Save } from "lucide-react"
import Link from "next/link"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"

export default async function ProfileEditPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Récupérer les informations de l'utilisateur
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        userName={session.user?.name || undefined} 
        userEmail={session.user?.email || undefined} 
      />
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au profil
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <User className="h-8 w-8 text-gray-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Modifier le profil</h1>
                <p className="text-gray-600">Mettez à jour vos informations personnelles</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Modifiez votre nom et votre email. Les changements seront appliqués immédiatement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileEditForm 
                initialData={{
                  name: user.name || "",
                  email: user.email
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
