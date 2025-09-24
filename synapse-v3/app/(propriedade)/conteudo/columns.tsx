// /app/(propriedade)/conteudo/columns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Content } from "@/types";
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
import { DeleteContentAlert } from "./components/delete-content-alert"; // Importe o alerta

const typeLabels: Record<Content['type'], string> = {
    manual: "Manual de Equipamento",
    guide: "Guia",
    policy: "Política",
    procedure: "Procedimento",
    event: "Evento"
};

export const getColumns = (propertyId: string): ColumnDef<Content>[] => [
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
        const type = row.getValue("type") as Content['type'];
        return <span>{typeLabels[type] || type}</span>;
    }
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished");
      return (
        <Badge variant={isPublished ? "default" : "outline"} className={isPublished ? "bg-green-100 text-green-800" : ""}>
          {isPublished ? "Publicado" : "Rascunho"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const content = row.original;
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
              <DropdownMenuItem onClick={() => router.push(`/conteudo/${content.id}/edit`)}>
                Editar Conteúdo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteContentAlert
                propertyId={propertyId}
                contentId={content.id}
                contentTitle={content.title}
              >
                Excluir Conteúdo
              </DeleteContentAlert>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];