// /app/(propriedade)/catalogo/page.tsx

import { getCatalogItems } from "@/lib/actions/catalog.actions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
// Importando os componentes da tabela
import { columns } from "./columns"; 
import { DataTable } from "./data-table";
import { CatalogItem } from "@/types";

export default async function CatalogPage() {
  const propertyId = "pousada-fazenda-digital";

  const loanItems = await getCatalogItems(propertyId, "loan");
  const consumableItems = await getCatalogItems(propertyId, "consumable");
  // Para o café, buscamos 'food' e 'beverage'
  const breakfastItems: CatalogItem[] = [
      ...(await getCatalogItems(propertyId, "food")),
      ...(await getCatalogItems(propertyId, "beverage")),
  ];

  return (
    <div className="container mx-auto py-10">
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

      <Tabs defaultValue="loan">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="loan">Empréstimo</TabsTrigger>
          <TabsTrigger value="consumable">Consumíveis</TabsTrigger>
          <TabsTrigger value="breakfast">Café da Manhã</TabsTrigger>
        </TabsList>

        <TabsContent value="loan">
          <DataTable columns={columns} data={loanItems} />
        </TabsContent>

        <TabsContent value="consumable">
          <DataTable columns={columns} data={consumableItems} />
        </TabsContent>

        <TabsContent value="breakfast">
          <DataTable columns={columns} data={breakfastItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
}