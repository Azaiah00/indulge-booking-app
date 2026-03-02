import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "CLIENT") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-widest uppercase text-[var(--color-primary)]">
            Indulge <span className="font-light text-gray-400 text-sm">Portal</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/portal" className="text-sm font-semibold uppercase tracking-wider text-gray-700">My Appointments</Link>
            <Button variant="outline" size="sm">Book New</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-12 px-6 md:px-12">
        {children}
      </main>
    </div>
  );
}
