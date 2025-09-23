// /lib/actions/settings.actions.ts

"use server";

import { adminDb } from "@/lib/firebase/server";
import { Property } from "@/types";
import { revalidatePath } from "next/cache";

// Tipo para os dados que o formulário irá manipular
export type BreakfastSettingsData = Property['settings']['module_breakfast'];

/**
 * Busca apenas as configurações do módulo de café da manhã.
 */
export async function getBreakfastSettings(propertyId: string): Promise<BreakfastSettingsData | null> {
  try {
    const propertyRef = adminDb.doc(`properties/${propertyId}`);
    const doc = await propertyRef.get();

    if (!doc.exists) {
      throw new Error("Property not found");
    }

    const propertyData = doc.data() as Property;
    return propertyData.settings?.module_breakfast || null;
  } catch (error) {
    console.error("Error fetching breakfast settings:", error);
    return null;
  }
}

/**
 * Calcula o número total de hóspedes previstos em estadias ativas.
 * NOTA: Isso assume que você tem um campo 'numberOfGuests' em cada documento de 'stay'.
 * Se não tiver, precisaremos adaptar essa lógica (ex: usando a capacidade da cabana).
 */
export async function getExpectedDinerCount(propertyId: string): Promise<number> {
    try {
        const staysRef = adminDb.collection(`properties/${propertyId}/stays`);
        const activeStaysSnapshot = await staysRef.where('status', '==', 'active').get();

        if (activeStaysSnapshot.empty) {
            return 0;
        }

        let totalGuests = 0;
        activeStaysSnapshot.forEach(doc => {
            // Supondo que cada 'stay' tem um campo 'numberOfGuests'.
            totalGuests += doc.data().numberOfGuests || 0;
        });

        return totalGuests;
    } catch (error) {
        console.error("Error calculating expected diners:", error);
        return 0;
    }
}

/**
 * Atualiza as configurações do café da manhã.
 */
export async function updateBreakfastSettings(propertyId: string, settings: BreakfastSettingsData) {
    try {
        const propertyRef = adminDb.doc(`properties/${propertyId}`);
        await propertyRef.update({
            "settings.module_breakfast": settings
        });

        // Invalida o cache da página do café, fazendo com que os dados sejam recarregados
        revalidatePath("/cafe");

        return { success: true, message: "Configurações atualizadas com sucesso!" };
    } catch (error) {
        console.error("Error updating breakfast settings:", error);
        return { success: false, message: "Falha ao atualizar as configurações." };
    }
}