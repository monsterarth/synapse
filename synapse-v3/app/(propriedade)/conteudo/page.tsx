// /app/(propriedade)/conteudo/page.tsx

import { getContentItems } from "@/lib/actions/content.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { ContentClientComponent } from "./components/content-client-component";

export default async function ContentPage() {
  const propertyId = "pousada-fazenda-digital"; 
  
  // Buscamos todos os tipos de conteúdo em paralelo para otimizar o carregamento
  const [manuals, guides, policies, procedures, events] = await Promise.all([
    getContentItems(propertyId, "manual"),
    getContentItems(propertyId, "guide"),
    getContentItems(propertyId, "policy"),
    getContentItems(propertyId, "procedure"),
    getContentItems(propertyId, "event"),
  ]);

  return (
    <div className="container mx-auto py-10">
      <Toaster richColors position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Conteúdo</h1>
          <p className="text-muted-foreground">
            Crie e edite guias, manuais, políticas e eventos da sua propriedade.
          </p>
        </div>
        <Button asChild>
          <Link href="/conteudo/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Conteúdo
          </Link>
        </Button>
      </div>
      
      <ContentClientComponent
        propertyId={propertyId}
        manuals={manuals}
        guides={guides}
        policies={policies}
        procedures={procedures}
        events={events}
      />
    </div>
  );
}