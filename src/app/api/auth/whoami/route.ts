import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/auth/whoami
// Returns the role of the currently signed-in user.
// Used by the login page to redirect to the right place after sign-in.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ role: null }, { status: 401 });
  }
  return NextResponse.json({
    id: (session.user as any).id,
    email: session.user.email,
    role: (session.user as any).role ?? "CLIENT",
  });
}
