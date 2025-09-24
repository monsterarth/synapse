// /app/(propriedade)/conteudo/novo/page.tsx

import { ContentForm } from "../components/content-form";

export default function NewContentPage() {
  const propertyId = "pousada-fazenda-digital";

  return (
    <div className="container mx-auto py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Adicionar Novo Conteúdo</h1>
        <p className="text-muted-foreground">
          Selecione o tipo e preencha os dados para criar um novo conteúdo.
        </p>
      </div>
      <div className="mt-8">
        <ContentForm propertyId={propertyId} />
      </div>
    </div>
  );
}