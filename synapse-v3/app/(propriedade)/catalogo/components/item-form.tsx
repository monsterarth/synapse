// /app/(propriedade)/catalogo/components/item-form.tsx

"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CatalogItem, CatalogItemFlavor } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createCatalogItem, updateCatalogItem } from "@/lib/actions/catalog.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";

// SOLUÇÃO FINAL: Schema inspirado no projeto antigo.
// Campos numéricos são tratados como strings e validados com .refine().
const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  type: z.enum(["loan", "consumable", "food", "beverage"]),
  category: z.string().min(2, "A categoria é obrigatória."),
  description: z.string().optional(),
  price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Preço deve ser um número válido e não negativo.",
  }),
  // CORREÇÃO APLICADA: Removido o .optional() para evitar tipo 'boolean | undefined'
  isActive: z.boolean().default(true),
  stockControl: z.object({
    enabled: z.boolean(),
    quantity: z.string().refine(val => /^\d+$/.test(val), {
        message: "Estoque deve ser um número inteiro válido.",
    }),
  }).optional(),
  flavors: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(2, "O nome do sabor é obrigatório."),
    description: z.string().optional(),
  })).optional(),
});

type ItemFormValues = z.infer<typeof formSchema>;

interface ItemFormProps {
  propertyId: string;
  initialData?: CatalogItem | null;
}

export function ItemForm({ propertyId, initialData }: ItemFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!initialData;

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "loan",
      category: initialData?.category || "",
      description: initialData?.description || "",
      // Valores iniciais também são convertidos para string.
      price: String(initialData?.price || 0),
      isActive: initialData?.isActive ?? true,
      stockControl: {
        enabled: initialData?.stockControl?.enabled || false,
        quantity: String(initialData?.stockControl?.quantity || 0),
      },
      flavors: initialData?.flavors || [],
    },
  });

  const itemType = form.watch("type");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "flavors",
  });

  const onSubmit = async (values: ItemFormValues) => {
    setIsLoading(true);
    try {
      // Conversão de string para number acontece aqui, antes de enviar.
      const dataToSave = {
          ...values,
          price: parseFloat(values.price),
          stockControl: {
              enabled: values.stockControl?.enabled || false,
              quantity: parseInt(values.stockControl?.quantity || '0', 10)
          },
          imageUrl: initialData?.imageUrl || '',
          flavors: values.flavors?.map(f => ({
              id: f.id || `flavor_${Date.now()}_${Math.random().toString(36).substring(7)}`,
              name: f.name,
              description: f.description,
          })) as CatalogItemFlavor[] | undefined,
      };

      let result;
      if (isEditMode && initialData) {
        result = await updateCatalogItem(propertyId, initialData.id, dataToSave);
      } else {
        result = await createCatalogItem(propertyId, dataToSave as Omit<CatalogItem, 'id'>);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/catalogo");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados principais do item no catálogo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Item</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditMode}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecione o tipo do item" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="loan">Empréstimo</SelectItem>
                      <SelectItem value="consumable">Consumível</SelectItem>
                      <SelectItem value="food">Comida (Café)</SelectItem>
                      <SelectItem value="beverage">Bebida (Café)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Item</FormLabel>
                  <FormControl><Input placeholder="Ex: Toalha de Piscina" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl><Input placeholder="Ex: Amenidades" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl><Textarea placeholder="Detalhes sobre o item..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
             <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço / Multa (R$)</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Item Ativo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Se desmarcado, o item não aparecerá para os hóspedes.
                    </p>
                  </div>
                </FormItem>
            )}/>
          </CardContent>
        </Card>

        {itemType === "consumable" && (
            <Card>
                <CardHeader><CardTitle>Controle de Estoque</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="stockControl.enabled" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5"><FormLabel>Habilitar controle de estoque?</FormLabel></div>
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}/>
                    {form.watch("stockControl.enabled") && (
                        <FormField control={form.control} name="stockControl.quantity" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantidade em Estoque</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    )}
                </CardContent>
            </Card>
        )}

        {(itemType === "food" || itemType === "beverage") && (
            <Card>
                <CardHeader>
                    <CardTitle>Sabores / Variações</CardTitle>
                    <CardDescription>Adicione variações para este item. Deixe em branco se não houver.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-4 p-4 border rounded-md">
                           <div className="flex-1 space-y-2">
                             <FormField control={form.control} name={`flavors.${index}.name`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Sabor</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                             <FormField control={form.control} name={`flavors.${index}.description`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição (Opcional)</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                           </div>
                           <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="mt-8">
                                <Trash2 className="h-4 w-4 text-red-500" />
                           </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `new_${Date.now()}`, name: '', description: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Sabor
                    </Button>
                </CardContent>
            </Card>
        )}

        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/catalogo')}>
                Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Salvar Alterações" : "Criar Item"}
            </Button>
        </div>
      </form>
    </Form>
  );
}