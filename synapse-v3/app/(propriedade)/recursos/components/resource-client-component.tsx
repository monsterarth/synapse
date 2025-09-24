// /app/(propriedade)/recursos/components/resource-client-component.tsx

"use client";

import { getColumns } from "../columns";
import { DataTable } from "../data-table";
import { Resource } from "@/types";

interface ResourceClientComponentProps {
  propertyId: string;
  resources: Resource[];
}

export function ResourceClientComponent({ 
  propertyId, 
  resources 
}: ResourceClientComponentProps) {
  
  // A chamada para getColumns agora acontece aqui, no lado do cliente.
  const columns = getColumns(propertyId);

  return (
    <DataTable columns={columns} data={resources} />
  );
}