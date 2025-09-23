// /app/(propriedade)/cafe/breakfast-settings-card.tsx

import { getBreakfastSettings, getExpectedDinerCount } from "@/lib/actions/settings.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, ShoppingBasket, Utensils } from "lucide-react";
import { UpdateBreakfastSettingsModal } from "./update-breakfast-settings-modal";

interface BreakfastSettingsCardProps {
    propertyId: string;
}

export async function BreakfastSettingsCard({ propertyId }: BreakfastSettingsCardProps) {
    const settings = await getBreakfastSettings(propertyId);
    const dinerCount = await getExpectedDinerCount(propertyId);

    const modalityText = {
        delivery: "Delivery (Cestas)",
        salon: "Buffet (Salão)",
        both: "Ambos",
    };

    return (
        <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Status do Serviço de Hoje</CardTitle>
                <UpdateBreakfastSettingsModal settings={settings} propertyId={propertyId} />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                        <Utensils className="h-6 w-6 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Modalidade</p>
                            <p className="font-semibold">{modalityText[settings?.modality || 'delivery']}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Comensais</p>
                            <p className="font-semibold">{dinerCount} previstos</p>
                        </div>
                    </div>
                    {settings?.modality === 'delivery' ? (
                        <div className="flex items-center gap-3">
                            <ShoppingBasket className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Pedidos até</p>
                                <p className="font-semibold">{settings.orderDeadline}h</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Clock className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Serviço</p>
                                <p className="font-semibold">{settings?.servingHours.start}h - {settings?.servingHours.end}h</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}