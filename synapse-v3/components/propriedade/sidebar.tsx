// /components/propriedade/sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BedDouble, BookOpen, Settings, LogOut, Users, Coffee, Sparkles, Home, FileText } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hospedagens", label: "Hospedagens", icon: BedDouble },
  { href: "/hospedes", label: "Hóspedes", icon: Users },
  { href: "/cafe", label: "Café da Manhã", icon: Coffee },
  { href: "/cabanas", label: "Cabanas", icon: Home },
  { href: "/catalogo", label: "Catálogo", icon: BookOpen },
  { href: "/recursos", label: "Recursos", icon: Sparkles },
  // ADICIONE A LINHA ABAIXO:
  { href: "/conteudo", label: "Conteúdos", icon: FileText },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <aside className="hidden w-64 flex-col border-r bg-gray-100/40 p-4 dark:bg-gray-800/40 md:flex">
      <div className="mb-8 flex items-center gap-2">
        <BedDouble className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold">Synapse Pousada</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              pathname === link.href
                ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-50"
                : ""
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}