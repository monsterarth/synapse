// /app/(propriedade)/catalogo/novo/page.tsx

import { ItemForm } from "../components/item-form";

export default function NewCatalogItemPage() {
  const propertyId = "pousada-fazenda-digital";

  return (
    <div className="container mx-auto py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Adicionar Novo Item</h1>
        <p className="text-muted-foreground">
          Preencha os dados para criar um novo item no catálogo.
        </p>
      </div>
      <div className="mt-8">
        <ItemForm propertyId={propertyId} />
      </div>
    </div>
  );
}