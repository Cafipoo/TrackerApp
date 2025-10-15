import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  // Si l'utilisateur est connecté, rediriger vers le dashboard
  if (session?.user?.id) {
    redirect("/dashboard")
  }

  // Sinon, rediriger vers la page de login
  redirect("/login")
}
