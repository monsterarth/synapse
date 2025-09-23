// /app/(propriedade)/hospedagens/columns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Stay } from "@/types";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mapeia os status para cores e textos específicos
const statusMap: { [key: string]: { label: string; className: string } } = {
  active: { label: "Ativa", className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
  upcoming: { label: "Próxima", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
  completed: { label: "Finalizada", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
  cancelled: { label: "Cancelada", className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300" },
};

export const columns: ColumnDef<Stay>[] = [
  {
    accessorKey: "guestName",
    header: "Hóspede",
  },
  {
    accessorKey: "cabinName",
    header: "Acomodação",
  },
  {
    accessorKey: "checkIn",
    header: "Check-in",
    cell: ({ row }) => {
      const date = new Date(row.getValue("checkIn"));
      return <span>{date.toLocaleDateString("pt-BR")}</span>;
    },
  },
  {
    accessorKey: "checkOut",
    header: "Check-out",
    cell: ({ row }) => {
      const date = new Date(row.getValue("checkOut"));
      return <span>{date.toLocaleDateString("pt-BR")}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // CORREÇÃO APLICADA AQUI:
      // Convertemos o valor 'unknown' para 'string' para usar como chave do mapa.
      const statusKey = row.getValue("status") as string;
      const status = statusMap[statusKey] || { label: "Desconhecido", className: "" };
      return <Badge variant="outline" className={status.className}>{status.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const stay = row.original;

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(stay.id)}>
                Copiar ID da Estadia
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
              <DropdownMenuItem>Fazer Check-in</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];