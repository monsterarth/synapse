// /app/(propriedade)/hospedagens/page.tsx

import { getStaysForProperty } from "@/lib/actions/stays.actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";

export default async function StaysPage() {
  // Por enquanto, usaremos o ID da propriedade de forma estática.
  // No futuro, isso virá do contexto de autenticação do usuário.
  const propertyId = "pousada-fazenda-digital"; 
  const data = await getStaysForProperty(propertyId);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospedagens</h1>
          <p className="text-muted-foreground">
            Gerencie as estadias da sua propriedade.
          </p>
        </div>
        <Button>Adicionar Hospedagem</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}