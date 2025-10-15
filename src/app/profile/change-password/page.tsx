import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Key, Lock } from "lucide-react"
import Link from "next/link"
import { ChangePasswordForm } from "@/components/profile/change-password-form"

export default async function ChangePasswordPage() {
  const session = await auth()

  if (!session?.user?.id) {
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
              <Key className="h-8 w-8 text-gray-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Changer le mot de passe</h1>
                <p className="text-gray-600">Mettez à jour votre mot de passe pour plus de sécurité</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Sécurité du compte
              </CardTitle>
              <CardDescription>
                Choisissez un mot de passe fort et unique pour protéger votre compte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
