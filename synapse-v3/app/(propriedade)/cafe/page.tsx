// /app/(propriedade)/cafe/page.tsx

import { getTodaysBreakfastOrders, BreakfastOrderInfo } from "@/lib/actions/orders.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner"; // Adicione este import
import { BreakfastSettingsCard } from "./breakfast-settings-card"; // ADICIONE ESTE IMPORT

// Função para agrupar os pedidos por cabana (sem alteração)
const groupOrdersByCabin = (orders: BreakfastOrderInfo[]) => {
  return orders.reduce((acc, order) => {
    const cabinName = order.cabinName;
    if (!acc[cabinName]) {
      acc[cabinName] = {
        guestName: order.guestName,
        orders: []
      };
    }
    acc[cabinName].orders.push(order);
    return acc;
  }, {} as Record<string, { guestName: string; orders: BreakfastOrderInfo[] }>);
};

export default async function BreakfastPage() {
  const propertyId = "pousada-fazenda-digital"; 
  const orders = await getTodaysBreakfastOrders(propertyId);
  const ordersByCabin = groupOrdersByCabin(orders);
  const hasOrders = Object.keys(ordersByCabin).length > 0;

  return (
    <div className="container mx-auto py-10">
      <Toaster richColors position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos de Café da Manhã</h1>
          <p className="text-muted-foreground">
            Gerencie os pedidos do dia para a cozinha.
          </p>
        </div>
        <Button variant="outline"><Printer className="mr-2 h-4 w-4" /> Imprimir Resumo</Button>
      </div>

      {/* CARD DE CONFIGURAÇÕES ADICIONADO AQUI */}
      <BreakfastSettingsCard propertyId={propertyId} />

      {hasOrders ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(ordersByCabin).map(([cabinName, data]) => (
            <Card key={cabinName}>
              <CardHeader>
                <CardTitle>{cabinName}</CardTitle>
                <CardDescription>Hóspede: {data.guestName}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.orders.map(order => (
                    <li key={order.id} className="flex justify-between items-center text-sm">
                      <span>{order.quantity}x {order.itemName}</span>
                      <Badge variant={order.status === 'pending' ? 'destructive' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2">
                 <Separator />
                 <Button size="sm" className="w-full">Marcar como Entregue</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12 mt-8">
            <Coffee className="h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Nenhum pedido de café da manhã para hoje</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Quando novos pedidos forem feitos, eles aparecerão aqui.
            </p>
        </div>
      )}
    </div>
  );
}