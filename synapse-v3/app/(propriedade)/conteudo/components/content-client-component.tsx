// /app/(propriedade)/conteudo/components/content-client-component.tsx

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getColumns } from "../columns";
import { DataTable } from "../data-table";
import { Content } from "@/types";

interface ContentClientComponentProps {
  propertyId: string;
  manuals: Content[];
  guides: Content[];
  policies: Content[];
  procedures: Content[];
  events: Content[];
}

export function ContentClientComponent({ 
  propertyId,
  manuals,
  guides,
  policies,
  procedures,
  events
}: ContentClientComponentProps) {
  
  const columns = getColumns(propertyId);

  return (
    <Tabs defaultValue="manuals">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="manuals">Equipamentos</TabsTrigger>
        <TabsTrigger value="guides">Guias</TabsTrigger>
        <TabsTrigger value="policies">Políticas</TabsTrigger>
        <TabsTrigger value="procedures">Procedimentos</TabsTrigger>
        <TabsTrigger value="events">Eventos</TabsTrigger>
      </TabsList>

      <TabsContent value="manuals">
        <DataTable columns={columns} data={manuals} />
      </TabsContent>
      <TabsContent value="guides">
        <DataTable columns={columns} data={guides} />
      </TabsContent>
      <TabsContent value="policies">
        <DataTable columns={columns} data={policies} />
      </TabsContent>
      <TabsContent value="procedures">
        <DataTable columns={columns} data={procedures} />
      </TabsContent>
      <TabsContent value="events">
        <DataTable columns={columns} data={events} />
      </TabsContent>
    </Tabs>
  );
}