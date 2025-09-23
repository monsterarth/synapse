// /app/(propriedade)/hospedes/page.tsx

import { getGuestsForProperty } from "@/lib/actions/guests.actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";

export default async function GuestsPage() {
  // Usando o ID da propriedade de forma estática, como antes.
  const propertyId = "pousada-fazenda-digital"; 
  const data = await getGuestsForProperty(propertyId);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hóspedes</h1>
          <p className="text-muted-foreground">
            Consulte o histórico de todos os hóspedes da sua propriedade.
          </p>
        </div>
        <Button>Adicionar Hóspede</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}