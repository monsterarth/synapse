// /lib/actions/content.actions.ts

"use server";

import { adminDb } from "@/lib/firebase/server";

interface EquipmentListItem {
    id: string;
    label: string; // O nome do equipamento
}

/**
 * Busca todos os conteúdos do tipo 'manual' (equipamentos) para usar em um seletor.
 */
export async function getEquipmentList(propertyId: string): Promise<EquipmentListItem[]> {
    if (!propertyId) {
        return [];
    }

    try {
        const contentRef = adminDb.collection(`properties/${propertyId}/content`);
        const snapshot = await contentRef.where("type", "==", "manual").get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => ({
            id: doc.id,
            label: doc.data().title || "Equipamento sem nome"
        }));

    } catch (error) {
        console.error("Error fetching equipment list: ", error);
        return [];
    }
}