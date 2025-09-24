// /app/(propriedade)/recursos/[resourceId]/horarios/page.tsx

import { getResourceById } from "@/lib/actions/resources.actions";
import { notFound } from "next/navigation";
import { ScheduleForm } from "../../components/schedule-form";
import { Toaster } from "@/components/ui/sonner";

interface ManageSchedulePageProps {
  params: {
    resourceId: string;
  };
}

export default async function ManageSchedulePage({ params }: ManageSchedulePageProps) {
  const propertyId = "pousada-fazenda-digital";
  const resource = await getResourceById(propertyId, params.resourceId);

  if (!resource) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Toaster richColors position="top-center" />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Horários de "{resource.name}"</h1>
        <p className="text-muted-foreground">
          Defina as regras de disponibilidade e os horários que os hóspedes podem agendar.
        </p>
      </div>
      <div className="mt-8">
        <ScheduleForm propertyId={propertyId} resource={resource} />
      </div>
    </div>
  );
}