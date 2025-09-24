// /app/(propriedade)/recursos/[resourceId]/edit/page.tsx

import { getResourceById } from "@/lib/actions/resources.actions";
import { ResourceForm } from "../../components/resource-form";

interface EditResourcePageProps {
  params: {
    resourceId: string;
  };
}

export default async function EditResourcePage({ params }: EditResourcePageProps) {
  const propertyId = "pousada-fazenda-digital";
  const resource = await getResourceById(propertyId, params.resourceId);

  return (
    <div className="container mx-auto py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Recurso</h1>
        <p className="text-muted-foreground">
          Altere os dados do recurso agendável.
        </p>
      </div>
      <div className="mt-8">
        <ResourceForm propertyId={propertyId} initialData={resource} />
      </div>
    </div>
  );
}