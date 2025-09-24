// /app/(propriedade)/catalogo/[itemId]/edit/page.tsx

import { getCatalogItemById } from "@/lib/actions/catalog.actions";
import { ItemForm } from "../../components/item-form";
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Usaremos Skeleton para o fallback

// Componente de Carregamento (Fallback para o Suspense)
function FormSkeleton() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-4 w-2/4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Novo componente async para buscar os dados e renderizar o formulário
async function EditItemDataLoader({ itemId }: { itemId: string }) {
  const propertyId = "pousada-fazenda-digital";
  const item = await getCatalogItemById(propertyId, itemId);

  return <ItemForm propertyId={propertyId} initialData={item} />;
}


// Componente de página principal agora é SÍNCRONO
export default function EditCatalogItemPage({
  params,
}: {
  params: { itemId: string };
}) {
  return (
    <div className="container mx-auto py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Item</h1>
        <p className="text-muted-foreground">
          Altere os dados do item do catálogo.
        </p>
      </div>
      <div className="mt-8">
        <Suspense fallback={<FormSkeleton />}>
          <EditItemDataLoader itemId={params.itemId} />
        </Suspense>
      </div>
    </div>
  );
}