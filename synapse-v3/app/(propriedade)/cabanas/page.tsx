// /app/(propriedade)/cabanas/page.tsx

import { getCabins } from "@/lib/actions/cabins.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { CabinsClientComponent } from "./components/cabins-client-component";

export default async function CabinsPage() {
  const propertyId = "pousada-fazenda-digital"; 
  
  const data = await getCabins(propertyId);

  return (
    <div className="container mx-auto py-10">
      <Toaster richColors position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Cabanas</h1>
          <p className="text-muted-foreground">
            Adicione, edite e gerencie todas as acomodações da sua propriedade.
          </p>
        </div>
        <Button asChild>
          <Link href="/cabanas/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Cabana
          </Link>
        </Button>
      </div>
      
      <CabinsClientComponent 
        propertyId={propertyId} 
        cabins={data} 
      />
    </div>
  );
}