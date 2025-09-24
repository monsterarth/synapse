// /app/(propriedade)/catalogo/components/catalog-client-component.tsx

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getColumns } from "../columns";
import { DataTable } from "../data-table";
import { CatalogItem } from "@/types";

interface CatalogClientComponentProps {
  propertyId: string;
  loanItems: CatalogItem[];
  consumableItems: CatalogItem[];
  breakfastItems: CatalogItem[];
}

export function CatalogClientComponent({ 
  propertyId, 
  loanItems, 
  consumableItems, 
  breakfastItems 
}: CatalogClientComponentProps) {
  
  // A chamada para getColumns agora acontece aqui, no lado do cliente.
  const columns = getColumns(propertyId);

  return (
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
  );
}