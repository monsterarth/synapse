// /app/(propriedade)/catalogo/components/delete-item-alert.tsx

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Importe o useRouter
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteCatalogItem } from "@/lib/actions/catalog.actions";
import { Loader2 } from "lucide-react";

interface DeleteItemAlertProps {
  propertyId: string;
  itemId: string;
  itemName: string;
  // Adicionamos um children prop para mais flexibilidade
  children: React.ReactNode; 
}

export function DeleteItemAlert({ propertyId, itemId, itemName, children }: DeleteItemAlertProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteCatalogItem(propertyId, itemId);
      if (result.success) {
        toast.success(result.message);
        router.refresh(); // Força a atualização dos dados na página
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado ao excluir o item.");
    } finally {
      setIsLoading(false);
      setOpen(false); // Fecha o diálogo após a ação
    }
  };

  return (
    <>
      {/* O DropdownMenuItem agora apenas controla o estado de abertura */}
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        className="text-red-500"
      >
        {children}
      </DropdownMenuItem>
      
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o item
              <span className="font-bold"> "{itemName}" </span>
              do catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}