// /app/(propriedade)/cabanas/[cabinId]/edit/page.tsx

import { getCabinById } from "@/lib/actions/cabins.actions";
import { getEquipmentList } from "@/lib/actions/content.actions";
import { CabinForm } from "../../components/cabin-form";

interface EditCabinPageProps {
  params: {
    cabinId: string;
  };
}

export default async function EditCabinPage({ params }: EditCabinPageProps) {
  const propertyId = "pousada-fazenda-digital";
  
  // Buscamos os dados da cabana e a lista de equipamentos em paralelo
  const [cabin, equipmentList] = await Promise.all([
    getCabinById(propertyId, params.cabinId),
    getEquipmentList(propertyId)
  ]);

  return (
    <div className="container mx-auto py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Cabana</h1>
        <p className="text-muted-foreground">
          Altere os dados da acomodação.
        </p>
      </div>
      <div className="mt-8">
        <CabinForm 
            propertyId={propertyId} 
            initialData={cabin} 
            equipmentList={equipmentList} 
        />
      </div>
    </div>
  );
}