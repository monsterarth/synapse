// /app/(propriedade)/recursos/components/resource-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Resource } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createResource } from "@/lib/actions/resources.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

// Schema com a solução de tratar números como strings e usar .refine()
const resourceFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  type: z.enum(["amenity", "service"]),
  capacity: z.string().refine(val => /^\d+$/.test(val) && parseInt(val, 10) > 0, {
    message: "Capacidade deve ser um número inteiro maior que 0.",
  }),
  bookingDuration: z.string().refine(val => /^\d+$/.test(val) && parseInt(val, 10) >= 15, {
    message: "Duração deve ser um número inteiro de no mínimo 15.",
  }),
  rules: z.string().optional(),
  requiresConfirmation: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

type ResourceFormValues = z.infer<typeof resourceFormSchema>;

interface ResourceFormProps {
  propertyId: string;
  initialData?: Resource | null;
}

export function ResourceForm({ propertyId, initialData }: ResourceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!initialData;

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "amenity",
      // Valores iniciais convertidos para string
      capacity: String(initialData?.capacity || 1),
      bookingDuration: String(initialData?.bookingDuration || 60),
      rules: initialData?.rules || "",
      requiresConfirmation: initialData?.requiresConfirmation ?? true,
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (values: ResourceFormValues) => {
    setIsLoading(true);
    try {
      // Conversão de string para number antes de enviar para o backend
      const dataToSave = {
        ...values,
        capacity: parseInt(values.capacity, 10),
        bookingDuration: parseInt(values.bookingDuration, 10),
      };

      const result = await createResource(propertyId, dataToSave as Omit<Resource, 'id'>);

      if (result.success) {
        toast.success(result.message);
        router.push("/recursos");
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
            <CardTitle>Detalhes do Recurso</CardTitle>
            <CardDescription>
              Preencha as informações do recurso que poderá ser agendado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Recurso</FormLabel>
                  <FormControl><Input placeholder="Ex: Jacuzzi com Hidromassagem" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Recurso</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="amenity">Estrutura (Ex: Piscina, Sauna)</SelectItem>
                      <SelectItem value="service">Serviço (Ex: Massagem)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="capacity" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Capacidade</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormDescription>Quantas pessoas podem usar ao mesmo tempo.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="bookingDuration" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Duração do Agendamento (minutos)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                     <FormDescription>Tempo que cada agendamento irá durar.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <FormField control={form.control} name="rules" render={({ field }) => (
                <FormItem>
                  <FormLabel>Regras de Utilização</FormLabel>
                  <FormControl><Textarea placeholder="Ex: Obrigatório tomar ducha antes de entrar." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="requiresConfirmation" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Requer Confirmação Manual</FormLabel>
                    <FormDescription>Se ativo, um staff precisará aprovar cada agendamento.</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
            )}/>
            <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Publicado / Ativo</FormLabel>
                     <FormDescription>Se inativo, o recurso não aparecerá para os hóspedes.</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
            )}/>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/recursos')}>
                Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Salvar Alterações" : "Criar Recurso"}
            </Button>
        </div>
      </form>
    </Form>
  );
}