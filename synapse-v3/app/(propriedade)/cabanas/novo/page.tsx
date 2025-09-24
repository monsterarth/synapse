// /app/(propriedade)/cabanas/novo/page.tsx

import { getEquipmentList } from "@/lib/actions/content.actions";
import { CabinForm } from "../components/cabin-form";

export default async function NewCabinPage() {
  const propertyId = "pousada-fazenda-digital";
  const equipmentList = await getEquipmentList(propertyId);

  return (
    <div className="container mx-auto py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Adicionar Nova Cabana</h1>
        <p className="text-muted-foreground">
          Preencha todos os detalhes da nova acomodação.
        </p>
      </div>
      <div className="mt-8">
        <CabinForm propertyId={propertyId} equipmentList={equipmentList} />
      </div>
    </div>
  );
}