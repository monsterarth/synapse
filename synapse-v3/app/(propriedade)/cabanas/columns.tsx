// /app/(propriedade)/cabanas/columns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Cabin } from "@/types";
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
import { useRouter } from "next/navigation";
import { DeleteCabinAlert } from "./components/delete-cabin-alert"; // Importe o novo componente

export const getColumns = (propertyId: string): ColumnDef<Cabin>[] => [
  {
    accessorKey: "name",
    header: "Nome da Cabana",
  },
  {
    accessorKey: "capacity",
    header: "Capacidade",
    cell: ({ row }) => {
        return <div className="text-center">{row.getValue("capacity")}</div>
    }
  },
  {
    accessorKey: "isPetFriendly",
    header: "Aceita Pet",
    cell: ({ row }) => {
      const isPetFriendly = row.getValue("isPetFriendly");
      return (
        <Badge variant={isPetFriendly ? "secondary" : "outline"}>
          {isPetFriendly ? "Sim" : "Não"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <Badge variant={isActive ? "default" : "outline"} className={isActive ? "bg-green-100 text-green-800" : ""}>
          {isActive ? "Ativa" : "Inativa"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const cabin = row.original;
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
              <DropdownMenuItem onClick={() => router.push(`/cabanas/${cabin.id}/edit`)}>
                Editar Cabana
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Integração do componente de exclusão */}
              <DeleteCabinAlert
                propertyId={propertyId}
                cabinId={cabin.id}
                cabinName={cabin.name}
              >
                Excluir Cabana
              </DeleteCabinAlert>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];