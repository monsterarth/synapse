// /app/(propriedade)/conteudo/components/content-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Content } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createContentItem, updateContentItem } from "@/lib/actions/content.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

// Schema base com campos comuns
const baseSchema = z.object({
  title: z.string().min(3, "O título é obrigatório."),
  category: z.string().min(3, "A categoria é obrigatória."),
  isPublished: z.boolean().default(true),
  body: z.string().optional(),
});

// Schema específico para Eventos
const eventSchema = baseSchema.extend({
  type: z.literal("event"),
  eventDetails: z.object({
    start: z.string().min(1, "Data de início é obrigatória."),
    end: z.string().min(1, "Data de fim é obrigatória."),
    location: z.string().optional(),
  }),
});

// Schema para os outros tipos
const otherSchema = baseSchema.extend({
  type: z.enum(["manual", "guide", "policy", "procedure"]),
});

// Schema dinâmico
const contentFormSchema = z.discriminatedUnion("type", [
  eventSchema,
  otherSchema,
]);

type ContentFormValues = z.infer<typeof contentFormSchema>;

// Função para formatar a data que vem do servidor (string ISO) para o input
const formatISOForInput = (isoString: string | undefined): string => {
    if (!isoString) return "";
    return isoString.substring(0, 16); // Retorna 'YYYY-MM-DDTHH:mm'
};

interface ContentFormProps {
  propertyId: string;
  initialData?: Content | null;
}

export function ContentForm({ propertyId, initialData }: ContentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!initialData;

  // Lógica de valores padrão corrigida para ser explícita
  const getDefaultValues = (): ContentFormValues => {
    if (isEditMode && initialData) {
        if (initialData.type === 'event') {
            return {
                type: 'event',
                title: initialData.title || "",
                category: initialData.category || "",
                isPublished: initialData.isPublished ?? true,
                body: initialData.body || "",
                eventDetails: {
                    start: formatISOForInput(initialData.eventDetails?.start as any),
                    end: formatISOForInput(initialData.eventDetails?.end as any),
                    location: initialData.eventDetails?.location || "",
                }
            };
        }
        return {
            type: initialData.type,
            title: initialData.title || "",
            category: initialData.category || "",
            isPublished: initialData.isPublished ?? true,
            body: initialData.body || "",
        };
    }
    // Valor padrão para um novo formulário
    return {
        type: 'guide',
        title: "",
        category: "",
        isPublished: true,
        body: "",
    };
  }

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: getDefaultValues(),
  });

  const contentType = form.watch("type");

  const onSubmit = async (values: ContentFormValues) => {
    setIsLoading(true);
    try {
        let dataToSave: Omit<Content, 'id' | 'targetAudience'>;

        if (values.type === "event") {
            dataToSave = {
                ...values,
                eventDetails: {
                    ...values.eventDetails,
                    start: new Date(values.eventDetails.start),
                    end: new Date(values.eventDetails.end),
                } as any,
            };
        } else {
            const { ...rest } = values;
            dataToSave = { ...rest, eventDetails: undefined };
        }
      
      let result;
      if (isEditMode && initialData) {
        result = await updateContentItem(propertyId, initialData.id, dataToSave);
      } else {
        result = await createContentItem(propertyId, dataToSave as any);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/conteudo");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Form submission error:", error);
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
            <CardTitle>Informações do Conteúdo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Conteúdo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditMode}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="guide">Guia</SelectItem>
                      <SelectItem value="manual">Manual de Equipamento</SelectItem>
                      <SelectItem value="policy">Política</SelectItem>
                      <SelectItem value="procedure">Procedimento</SelectItem>
                      <SelectItem value="event">Evento</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Categoria</FormLabel><FormControl><Input placeholder="Ex: Guias Locais, Operações Diárias" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="body" render={({ field }) => (
                <FormItem>
                  <FormLabel>Corpo do Conteúdo</FormLabel>
                  <FormControl><Textarea placeholder="Escreva o conteúdo aqui. Suporta Markdown." {...field} rows={15} /></FormControl>
                  <FormDescription>Você pode usar a sintaxe Markdown para formatação.</FormDescription>
                  <FormMessage />
                </FormItem>
            )}/>
            
            {contentType === "event" && (
                <div className="space-y-6 pt-6 border-t">
                    <h3 className="text-lg font-medium">Detalhes do Evento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="eventDetails.start" render={({ field }) => (
                            <FormItem><FormLabel>Início</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="eventDetails.end" render={({ field }) => (
                            <FormItem><FormLabel>Fim</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <FormField control={form.control} name="eventDetails.location" render={({ field }) => (
                        <FormItem><FormLabel>Localização</FormLabel><FormControl><Input placeholder="Ex: Salão de Festas" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
            )}

            <FormField control={form.control} name="isPublished" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Publicado</FormLabel>
                     <FormDescription>Se inativo, o conteúdo não aparecerá.</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
            )}/>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/conteudo')}>
                Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Salvar Alterações" : "Criar Conteúdo"}
            </Button>
        </div>
      </form>
    </Form>
  );
}