// /app/(propriedade)/catalogo/columns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CatalogItem } from "@/types";
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DeleteItemAlert } from "./components/delete-item-alert";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

// CORREÇÃO APLICADA AQUI:
// Garantimos que estamos exportando uma função chamada 'getColumns'.
export const getColumns = (propertyId: string): ColumnDef<CatalogItem>[] => [
  {
    accessorKey: "imageUrl",
    header: "",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string;
      const name = row.original.name;
      return imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          width={40}
          height={40}
          className="rounded-md object-cover h-10 w-10"
        />
      ) : (
        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
          Sem foto
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "price",
    header: "Preço / Multa",
    cell: ({ row }) => {
      return <span>{formatCurrency(row.getValue("price"))}</span>;
    },
  },
    {
    accessorKey: "stockControl.quantity",
    header: "Estoque",
    cell: ({ row }) => {
        const stock = row.original.stockControl;
        return stock?.enabled ? <span>{stock.quantity}</span> : <span className="text-muted-foreground">-</span>;
    }
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <Badge variant={isActive ? "default" : "outline"} className={isActive ? "bg-green-100 text-green-800" : ""}>
          {isActive ? "Ativo" : "Inativo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
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
              <DropdownMenuItem onClick={() => router.push(`/catalogo/${item.id}/edit`)}>
                Editar Item
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteItemAlert
                propertyId={propertyId}
                itemId={item.id}
                itemName={item.name}
              >
                Excluir Item
              </DeleteItemAlert>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];