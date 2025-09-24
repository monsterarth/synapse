// /app/(propriedade)/conteudo/[contentId]/edit/page.tsx

import { getContentItemById } from "@/lib/actions/content.actions";
import { ContentForm } from "../../components/content-form";

interface EditContentPageProps {
  params: {
    contentId: string;
  };
}

export default async function EditContentPage({ params }: EditContentPageProps) {
  const propertyId = "pousada-fazenda-digital";
  const content = await getContentItemById(propertyId, params.contentId);

  return (
    <div className="container mx-auto py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Conteúdo</h1>
        <p className="text-muted-foreground">
          Altere os dados do conteúdo.
        </p>
      </div>
      <div className="mt-8">
        <ContentForm propertyId={propertyId} initialData={content} />
      </div>
    </div>
  );
}