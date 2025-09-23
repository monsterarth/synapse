// /app/(propriedade)/cafe/update-breakfast-settings-modal.tsx

"use client";

import { useState } from "react";
import { BreakfastSettingsData, updateBreakfastSettings } from "@/lib/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UpdateBreakfastSettingsModalProps {
  settings: BreakfastSettingsData | null;
  propertyId: string;
}

export function UpdateBreakfastSettingsModal({ settings, propertyId }: UpdateBreakfastSettingsModalProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<BreakfastSettingsData>(
    settings || {
      enabled: true,
      modality: "delivery",
      orderDeadline: "20:00",
      servingHours: { start: "08:00", end: "10:00" },
    }
  );

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateBreakfastSettings(propertyId, currentSettings);
    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.message);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Alterar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações Rápidas do Café da Manhã</DialogTitle>
          <DialogDescription>
            Ajuste a modalidade e os horários para o serviço de hoje.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div>
            <Label>Modalidade do Dia</Label>
            <RadioGroup
              value={currentSettings.modality}
              onValueChange={(value: "delivery" | "salon" | "both") =>
                setCurrentSettings({ ...currentSettings, modality: value })
              }
              className="flex gap-4 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivery" id="r-delivery" />
                <Label htmlFor="r-delivery" className="font-normal">Delivery (Cestas)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="salon" id="r-salon" />
                <Label htmlFor="r-salon" className="font-normal">Buffet (Salão)</Label>
              </div>
            </RadioGroup>
          </div>

          {currentSettings.modality === 'delivery' && (
            <div>
              <Label htmlFor="orderDeadline">Janela de Pedidos (encerra às)</Label>
              <Input
                id="orderDeadline"
                type="time"
                value={currentSettings.orderDeadline}
                onChange={(e) =>
                    setCurrentSettings({ ...currentSettings, orderDeadline: e.target.value })
                }
              />
            </div>
          )}

          {currentSettings.modality === 'salon' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="servingStart">Início do Serviço</Label>
                <Input
                  id="servingStart"
                  type="time"
                  value={currentSettings.servingHours.start}
                  onChange={(e) =>
                    setCurrentSettings({ ...currentSettings, servingHours: { ...currentSettings.servingHours, start: e.target.value } })
                  }
                />
              </div>
              <div>
                <Label htmlFor="servingEnd">Fim do Serviço</Label>
                <Input
                  id="servingEnd"
                  type="time"
                  value={currentSettings.servingHours.end}
                  onChange={(e) =>
                    setCurrentSettings({ ...currentSettings, servingHours: { ...currentSettings.servingHours, end: e.target.value } })
                  }
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}