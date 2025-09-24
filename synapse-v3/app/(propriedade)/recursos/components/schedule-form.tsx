// /app/(propriedade)/recursos/components/schedule-form.tsx

"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DayOfWeek, Resource, ScheduleRule } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateResourceSchedules } from "@/lib/actions/resources.actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, PlusCircle, Trash2, CalendarDays, Clock } from "lucide-react";

const scheduleSchema = z.object({
  schedules: z.array(z.object({
    id: z.string(),
    name: z.string().min(3, "O nome da regra é obrigatório."),
    daysOfWeek: z.array(z.string()).min(1, "Selecione pelo menos um dia da semana."),
    slots: z.array(z.object({
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário de início inválido."),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário de fim inválido."),
    })).min(1, "Adicione pelo menos um slot de horário."),
  })),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface ScheduleFormProps {
  propertyId: string;
  resource: Resource;
}

const weekDays: { id: DayOfWeek; label: string }[] = [
    { id: 'sun', label: 'D' }, { id: 'mon', label: 'S' }, { id: 'tue', label: 'T' }, 
    { id: 'wed', label: 'Q' }, { id: 'thu', label: 'Q' }, { id: 'fri', label: 'S' }, 
    { id: 'sat', label: 'S' }
];

export function ScheduleForm({ propertyId, resource }: ScheduleFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      schedules: resource.schedules || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedules",
  });

  const onSubmit = async (values: ScheduleFormValues) => {
    setIsLoading(true);
    try {
      const result = await updateResourceSchedules(propertyId, resource.id, values.schedules as ScheduleRule[]);
      if (result.success) {
        toast.success(result.message);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <FormField control={form.control} name={`schedules.${index}.name`} render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl><Input placeholder="Ex: Dias de Semana, Feriados" {...field} className="text-lg font-semibold border-none shadow-none focus-visible:ring-0" /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )}/>
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name={`schedules.${index}.daysOfWeek`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><CalendarDays className="h-4 w-4" /> Dias da Semana</FormLabel>
                      <FormControl>
                        <ToggleGroup type="multiple" variant="outline" value={field.value} onValueChange={field.onChange}>
                          {weekDays.map(day => (
                            <ToggleGroupItem key={day.id} value={day.id} aria-label={day.id}>{day.label}</ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                    <FormLabel className="flex items-center gap-2 mb-2 text-sm font-semibold text-muted-foreground"><Clock className="h-4 w-4" /> Slots de Horário</FormLabel>
                    <SlotsFieldArray control={form.control} ruleIndex={index} />
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-8">
            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `rule_${Date.now()}`, name: 'Nova Regra', daysOfWeek: [], slots: [{start: '09:00', end: '10:00'}] })}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Nova Regra
            </Button>
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.push('/recursos')}>
                    Voltar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Horários
                </Button>
            </div>
        </div>
      </form>
    </Form>
  );
}

function SlotsFieldArray({ control, ruleIndex }: { control: any; ruleIndex: number }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `schedules.${ruleIndex}.slots`,
    });

    return (
        <div className="space-y-2 pl-6 border-l-2 ml-2">
            {fields.map((field, slotIndex) => (
                <div key={field.id} className="flex items-center gap-2">
                    <FormField control={control} name={`schedules.${ruleIndex}.slots.${slotIndex}.start`} render={({ field }) => (
                        <FormItem><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <span className="text-sm text-muted-foreground">até</span>
                     <FormField control={control} name={`schedules.${ruleIndex}.slots.${slotIndex}.end`} render={({ field }) => (
                        <FormItem><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(slotIndex)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                    </Button>
                </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={() => append({ start: '10:00', end: '11:00' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Slot
            </Button>
        </div>
    );
}