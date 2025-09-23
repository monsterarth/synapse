// /app/(propriedade)/catalogo/[itemId]/edit/page.tsx

import { getCatalogItemById } from "@/lib/actions/catalog.actions";
import { ItemForm } from "../../components/item-form";

interface EditCatalogItemPageProps {
  params: {
    itemId: string;
  };
}

export default async function EditCatalogItemPage({ params }: EditCatalogItemPageProps) {
  const propertyId = "pousada-fazenda-digital";
  const item = await getCatalogItemById(propertyId, params.itemId);

  return (
    <div className="container mx-auto py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Item</h1>
        <p className="text-muted-foreground">
          Altere os dados do item do catálogo.
        </p>
      </div>
      <div className="mt-8">
        <ItemForm propertyId={propertyId} initialData={item} />
      </div>
    </div>
  );
}