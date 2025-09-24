// /app/(propriedade)/cabanas/components/cabin-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Cabin } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createCabin, updateCabin } from "@/lib/actions/cabins.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


const cabinFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  description: z.string().optional(),
  capacity: z.string().refine(val => /^\d+$/.test(val) && parseInt(val, 10) > 0, {
    message: "Capacidade deve ser um número inteiro maior que 0.",
  }),
  // CORREÇÃO: Removido .default()
  isPetFriendly: z.boolean(),
  isActive: z.boolean(),
  details: z.object({
    bedrooms: z.string().refine(val => /^\d+$/.test(val) && parseInt(val, 10) >= 0, { message: "Deve ser um número."}),
    bathrooms: z.string().refine(val => /^\d+$/.test(val) && parseInt(val, 10) >= 0, { message: "Deve ser um número."}),
    // CORREÇÃO: Removido .default()
    hasKitchen: z.boolean(),
  }),
  accessInfo: z.object({
    wifiSsid: z.string().optional(),
    wifiPassword: z.string().optional(),
    gateCode: z.string().optional(),
  }),
  linkedEquipment: z.array(z.string()).optional(),
});

type CabinFormValues = z.infer<typeof cabinFormSchema>;

interface CabinFormProps {
  propertyId: string;
  initialData?: Cabin | null;
  equipmentList: { id: string; label: string }[];
}

export function CabinForm({ propertyId, initialData, equipmentList }: CabinFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!initialData;

  const form = useForm<CabinFormValues>({
    resolver: zodResolver(cabinFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      capacity: String(initialData?.capacity || 2),
      // O valor padrão é garantido aqui
      isPetFriendly: initialData?.isPetFriendly || false,
      isActive: initialData?.isActive ?? true,
      details: {
        bedrooms: String(initialData?.details?.bedrooms || 1),
        bathrooms: String(initialData?.details?.bathrooms || 1),
        hasKitchen: initialData?.details?.hasKitchen || false,
      },
      accessInfo: {
        wifiSsid: initialData?.accessInfo?.wifiSsid || "",
        wifiPassword: initialData?.accessInfo?.wifiPassword || "",
        gateCode: initialData?.accessInfo?.gateCode || "",
      },
      linkedEquipment: initialData?.linkedEquipment || [],
    },
  });

  const onSubmit = async (values: CabinFormValues) => {
    setIsLoading(true);
    try {
      const dataToSave = {
        ...values,
        capacity: parseInt(values.capacity, 10),
        details: {
            bedrooms: parseInt(values.details.bedrooms, 10),
            bathrooms: parseInt(values.details.bathrooms, 10),
            hasKitchen: values.details.hasKitchen,
        },
        // CORREÇÃO: Garante que os campos opcionais sejam strings vazias se não preenchidos
        accessInfo: {
            wifiSsid: values.accessInfo.wifiSsid || '',
            wifiPassword: values.accessInfo.wifiPassword || '',
            gateCode: values.accessInfo.gateCode || '',
        },
        linkedEquipment: values.linkedEquipment || [],
      };

      let result;
      if (isEditMode && initialData) {
        result = await updateCabin(propertyId, initialData.id, dataToSave);
      } else {
        result = await createCabin(propertyId, dataToSave as Omit<Cabin, 'id'>);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/cabanas");
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Nome da Cabana</FormLabel><FormControl><Input placeholder="Ex: Cabana da Montanha" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea placeholder="Uma breve descrição da cabana..." {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="capacity" render={({ field }) => (
                            <FormItem><FormLabel>Capacidade de Hóspedes</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader><CardTitle>Detalhes da Acomodação</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="details.bedrooms" render={({ field }) => (
                                <FormItem><FormLabel>Quartos</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="details.bathrooms" render={({ field }) => (
                                <FormItem><FormLabel>Banheiros</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                         </div>
                         <FormField control={form.control} name="details.hasKitchen" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5"><FormLabel>Possui Cozinha?</FormLabel></div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}/>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Equipamentos Vinculados</CardTitle>
                        <CardDescription>Selecione os equipamentos existentes nesta cabana para exibir os manuais corretos para o hóspede.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="linkedEquipment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Equipamentos</FormLabel>
                                    <MultiSelect
                                        options={equipmentList}
                                        selected={field.value || []}
                                        onChange={field.onChange}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader><CardTitle>Informações de Acesso</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <FormField control={form.control} name="accessInfo.wifiSsid" render={({ field }) => (
                            <FormItem><FormLabel>Rede Wi-Fi (SSID)</FormLabel><FormControl><Input placeholder="Ex: Pousada Wi-Fi" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="accessInfo.wifiPassword" render={({ field }) => (
                            <FormItem><FormLabel>Senha do Wi-Fi</FormLabel><FormControl><Input placeholder="Senha para os hóspedes" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="accessInfo.gateCode" render={({ field }) => (
                            <FormItem><FormLabel>Código do Portão (opcional)</FormLabel><FormControl><Input placeholder="Ex: 1234#" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                </Card>
            </div>
            
            <div className="lg:col-span-1 space-y-8">
                 <Card>
                    <CardHeader><CardTitle>Publicação e Regras</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                          <FormField control={form.control} name="isActive" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5"><FormLabel>Cabana Ativa</FormLabel><FormDescription>Se inativa, não poderá receber novas hospedagens.</FormDescription></div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="isPetFriendly" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5"><FormLabel>Aceita Pets?</FormLabel></div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}/>
                    </CardContent>
                </Card>
                 <div className="flex flex-col gap-2">
                    <Button type="submit" disabled={isLoading} size="lg">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? "Salvar Alterações" : "Criar Cabana"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/cabanas')}>
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
      </form>
    </Form>
  );
}

interface MultiSelectProps {
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function MultiSelect({ options, selected, onChange }: MultiSelectProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (optionId: string) => {
        const newSelected = selected.includes(optionId)
            ? selected.filter(id => id !== optionId)
            : [...selected, optionId];
        onChange(newSelected);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-auto">
                    <div className="flex gap-1 flex-wrap">
                        {selected.length === 0 && "Selecione os equipamentos..."}
                        {selected
                            .map(id => options.find(opt => opt.id === id))
                            .filter(Boolean)
                            .map(option => (
                                <Badge variant="secondary" key={option!.id}>{option!.label}</Badge>
                            ))}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Buscar equipamento..." />
                    <CommandList>
                        <CommandEmpty>Nenhum equipamento encontrado.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={option.label}
                                    onSelect={() => handleSelect(option.id)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected.includes(option.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}