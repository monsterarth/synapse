// /app/(propriedade)/dashboard/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, LogIn, LogOut, Package } from "lucide-react";

// Dados estáticos para a UI
const summaryData = [
  { title: "Hóspedes Ativos", value: "12", icon: Users },
  { title: "Check-ins Hoje", value: "3", icon: LogIn },
  { title: "Check-outs Hoje", value: "2", icon: LogOut },
  { title: "Pedidos Pendentes", value: "5", icon: Package },
];

const upcomingCheckins = [
  { guestName: "Carlos Silva", cabinName: "Cabana da Montanha", time: "14:00" },
  { guestName: "Ana Pereira", cabinName: "Chalé do Lago", time: "15:30" },
  { guestName: "Mariana Costa", cabinName: "Cabana da Floresta", time: "17:00" },
];

// Componente de Card para as estatísticas
function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Controle</h1>
        <p className="text-muted-foreground">Visão geral da sua propriedade em tempo real.</p>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((data) => (
          <StatCard key={data.title} {...data} />
        ))}
      </div>

      {/* Tabela de Próximos Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hóspede</TableHead>
                <TableHead>Acomodação</TableHead>
                <TableHead className="text-right">Horário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingCheckins.map((checkin) => (
                <TableRow key={checkin.guestName}>
                  <TableCell className="font-medium">{checkin.guestName}</TableCell>
                  <TableCell>{checkin.cabinName}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{checkin.time}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}