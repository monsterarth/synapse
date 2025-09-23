// /app/(propriedade)/recursos/novo/page.tsx

import { ResourceForm } from "../components/resource-form";

export default function NewResourcePage() {
  const propertyId = "pousada-fazenda-digital";

  return (
    <div className="container mx-auto py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Adicionar Novo Recurso</h1>
        <p className="text-muted-foreground">
          Preencha os dados para criar um novo recurso agendável.
        </p>
      </div>
      <div className="mt-8">
        <ResourceForm propertyId={propertyId} />
      </div>
    </div>
  );
}