import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-widest uppercase text-[var(--color-primary)]">
            Admin Panel
          </h2>
        </div>
        <nav className="mt-6">
          <Link href="/dashboard" className="block py-3 px-6 text-sm hover:bg-gray-50 uppercase tracking-wider font-semibold text-gray-700">
            Dashboard
          </Link>
          <Link href="/dashboard/calendar" className="block py-3 px-6 text-sm hover:bg-gray-50 uppercase tracking-wider text-gray-500">
            Calendar
          </Link>
          <Link href="/dashboard/services" className="block py-3 px-6 text-sm hover:bg-gray-50 uppercase tracking-wider text-gray-500">
            Services
          </Link>
          <Link href="/dashboard/blockouts" className="block py-3 px-6 text-sm hover:bg-gray-50 uppercase tracking-wider text-gray-500">
            Block Time
          </Link>
          <Link href="/dashboard/settings" className="block py-3 px-6 text-sm hover:bg-gray-50 uppercase tracking-wider text-gray-500">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
