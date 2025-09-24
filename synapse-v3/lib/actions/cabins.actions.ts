// /lib/actions/cabins.actions.ts

"use server";

import { adminDb } from "@/lib/firebase/server";
import { Cabin } from "@/types";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

// Helper para serializar dados do Firestore
const transformData = (doc: any): any => {
    const data = doc.data();
    return { id: doc.id, ...data };
};

/**
 * Busca todas as cabanas de uma propriedade.
 */
export async function getCabins(propertyId: string): Promise<Cabin[]> {
    if (!propertyId) {
        console.error("Property ID is required.");
        return [];
    }

    try {
        const cabinsRef = adminDb.collection(`properties/${propertyId}/cabins`);
        const snapshot = await cabinsRef.orderBy("name").get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(transformData) as Cabin[];

    } catch (error) {
        console.error("Error fetching cabins: ", error);
        return [];
    }
}

/**
 * Cria uma nova cabana.
 */
export async function createCabin(propertyId: string, cabinData: Omit<Cabin, 'id'>) {
    if (!propertyId || !cabinData) {
        return { success: false, message: "Dados inválidos." };
    }
    try {
        const cabinsRef = adminDb.collection(`properties/${propertyId}/cabins`);
        await cabinsRef.add(cabinData);
        revalidatePath("/cabanas");
        return { success: true, message: "Cabana criada com sucesso!" };
    } catch (error) {
        console.error("Error creating cabin:", error);
        return { success: false, message: "Falha ao criar a cabana." };
    }
}

/**
 * Busca uma cabana específica pelo seu ID.
 */
export async function getCabinById(propertyId: string, cabinId: string): Promise<Cabin | null> {
    if (!propertyId || !cabinId) return null;
    try {
        const cabinRef = adminDb.doc(`properties/${propertyId}/cabins/${cabinId}`);
        const doc = await cabinRef.get();
        if (!doc.exists) {
            notFound();
        }
        return transformData(doc) as Cabin;
    } catch (error) {
        console.error("Error fetching cabin by ID:", error);
        return null;
    }
}

/**
 * Atualiza uma cabana existente.
 */
export async function updateCabin(propertyId: string, cabinId: string, cabinData: Partial<Cabin>) {
    if (!propertyId || !cabinId || !cabinData) {
        return { success: false, message: "Dados inválidos." };
    }
    try {
        const cabinRef = adminDb.doc(`properties/${propertyId}/cabins/${cabinId}`);
        await cabinRef.update(cabinData);
        revalidatePath("/cabanas");
        revalidatePath(`/cabanas/${cabinId}/edit`);
        return { success: true, message: "Cabana atualizada com sucesso!" };
    } catch (error) {
        console.error("Error updating cabin:", error);
        return { success: false, message: "Falha ao atualizar a cabana." };
    }
}

/**
 * Deleta uma cabana.
 */
export async function deleteCabin(propertyId: string, cabinId: string) {
    if (!propertyId || !cabinId) {
        return { success: false, message: "ID da cabana inválido." };
    }
    try {
        const cabinRef = adminDb.doc(`properties/${propertyId}/cabins/${cabinId}`);
        await cabinRef.delete();
        revalidatePath("/cabanas");
        return { success: true, message: "Cabana excluída com sucesso!" };
    } catch (error) {
        console.error("Error deleting cabin:", error);
        return { success: false, message: "Falha ao excluir a cabana." };
    }
}