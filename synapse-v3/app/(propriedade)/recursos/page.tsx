// /app/(propriedade)/recursos/page.tsx

import { getResources } from "@/lib/actions/resources.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { ResourceClientComponent } from "./components/resource-client-component"; // Importe o novo componente

export default async function ResourcesPage() {
  const propertyId = "pousada-fazenda-digital"; 
  
  // 1. A página do servidor apenas busca os dados.
  const data = await getResources(propertyId);

  return (
    <div className="container mx-auto py-10">
      <Toaster richColors position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recursos Agendáveis</h1>
          <p className="text-muted-foreground">
            Gerencie as estruturas (jacuzzis, quadras) e serviços (massagens) da sua propriedade.
          </p>
        </div>
        <Button asChild>
          <Link href="/recursos/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Recurso
          </Link>
        </Button>
      </div>
      
      {/* 2. Os dados são passados como props para o componente de cliente. */}
      <ResourceClientComponent 
        propertyId={propertyId} 
        resources={data} 
      />
    </div>
  );
}