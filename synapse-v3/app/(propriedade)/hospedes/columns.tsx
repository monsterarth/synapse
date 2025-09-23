// /app/(propriedade)/hospedes/columns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Guest } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Guest>[] = [
  {
    accessorKey: "identity.fullName",
    header: "Nome Completo",
  },
  {
    accessorKey: "identity.email",
    header: "E-mail",
  },
  {
    accessorKey: "identity.phone",
    header: "Telefone",
  },
  {
    accessorKey: "history.totalStays",
    header: "Total de Estadias",
    cell: ({ row }) => {
      const total = row.original.history?.totalStays || 0;
      return <div className="text-center">{total}</div>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const guest = row.original;

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(guest.id)}>
                Copiar CPF
              </DropdownMenuItem>
              <DropdownMenuItem>Ver Perfil Completo</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];