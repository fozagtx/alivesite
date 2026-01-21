import { auth } from "./auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getServerSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("better-auth.session_token")?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const session = await auth.api.getSession({
      headers: {
        cookie: `better-auth.session_token=${sessionId}`,
      },
    });

    return session;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/signin");
  }

  return session;
}

export async function getUserSession() {
  const session = await getServerSession();
  return session?.user || null;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session?.user;
}