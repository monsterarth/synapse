// /app/(propriedade)/recursos/columns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Resource } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteResourceAlert } from "./components/delete-resource-alert";
import { useRouter } from "next/navigation";

export const getColumns = (propertyId: string): ColumnDef<Resource>[] => [
  {
    accessorKey: "name",
    header: "Nome do Recurso",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const label = type === 'amenity' ? 'Estrutura' : 'Serviço';
      return <span>{label}</span>;
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacidade",
  },
    {
    accessorKey: "bookingDuration",
    header: "Duração (min)",
    cell: ({ row }) => {
        const duration = row.getValue("bookingDuration");
        return <span>{duration ? `${duration} min` : '-'}</span>
    }
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <Badge variant={isActive ? "default" : "outline"} className={isActive ? "bg-green-100 text-green-800" : ""}>
          {isActive ? "Publicado" : "Rascunho"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const resource = row.original;
      const router = useRouter();

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/recursos/${resource.id}/edit`)}>
                Editar Recurso
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/recursos/${resource.id}/horarios`)}>
                Gerenciar Horários
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteResourceAlert
                propertyId={propertyId}
                resourceId={resource.id}
                resourceName={resource.name}
              >
                Excluir Recurso
              </DeleteResourceAlert>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];