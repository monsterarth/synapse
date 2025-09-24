// /app/(propriedade)/catalogo/page.tsx

import { getCatalogItems } from "@/lib/actions/catalog.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { CatalogItem } from "@/types";
import { Toaster } from "@/components/ui/sonner";
import { CatalogClientComponent } from "./components/catalog-client-component"; // Importe o novo componente

export default async function CatalogPage() {
  const propertyId = "pousada-fazenda-digital";

  // 1. A página do servidor APENAS busca os dados.
  const loanItems = await getCatalogItems(propertyId, "loan");
  const consumableItems = await getCatalogItems(propertyId, "consumable");
  const breakfastItems: CatalogItem[] = [
      ...(await getCatalogItems(propertyId, "food")),
      ...(await getCatalogItems(propertyId, "beverage")),
  ];

  return (
    <div className="container mx-auto py-10">
      <Toaster richColors position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo da Propriedade</h1>
          <p className="text-muted-foreground">
            Gerencie todos os itens e serviços oferecidos aos hóspedes.
          </p>
        </div>
        <Button asChild>
          <Link href="/catalogo/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Item
          </Link>
        </Button>
      </div>

      {/* 2. Os dados são passados como props para o componente de cliente. */}
      <CatalogClientComponent 
        propertyId={propertyId}
        loanItems={loanItems}
        consumableItems={consumableItems}
        breakfastItems={breakfastItems}
      />
    </div>
  );
}