// /app/(propriedade)/cabanas/components/cabins-client-component.tsx

"use client";

import { getColumns } from "../columns";
import { DataTable } from "../data-table";
import { Cabin } from "@/types";

interface CabinsClientComponentProps {
  propertyId: string;
  cabins: Cabin[];
}

export function CabinsClientComponent({ 
  propertyId, 
  cabins 
}: CabinsClientComponentProps) {
  
  const columns = getColumns(propertyId);

  return (
    <DataTable columns={columns} data={cabins} />
  );
}