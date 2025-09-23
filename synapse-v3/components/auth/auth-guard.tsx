// /components/auth/auth-guard.tsx

"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged retorna uma função "unsubscribe" que podemos usar
    // para limpar o listener quando o componente for desmontado.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Usuário não está logado, redireciona para a página de login.
        router.push("/login");
      }
      setLoading(false);
    });

    // Função de limpeza para evitar memory leaks.
    return () => unsubscribe();
  }, [router]); // O useEffect depende do router para o redirecionamento.

  if (loading) {
    // Enquanto verificamos a autenticação, mostramos um loader centralizado.
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Se o usuário estiver autenticado (user não é null), renderiza o conteúdo protegido.
  if (user) {
    return <>{children}</>;
  }

  // Retorno nulo enquanto redireciona para evitar flash de conteúdo antigo.
  return null;
}