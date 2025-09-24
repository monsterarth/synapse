// /lib/actions/resources.actions.ts

"use server";

import { adminDb } from "@/lib/firebase/server";
import { Resource } from "@/types";
import { revalidatePath } from "next/cache";
import { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";

// Helper para serializar dados do Firestore
const transformData = (doc: QueryDocumentSnapshot<DocumentData>): Resource => {
    const data = doc.data();
    return { id: doc.id, ...data } as Resource;
};

// getResources (sem alteração)
export async function getResources(propertyId: string): Promise<Resource[]> {
    if (!propertyId) {
        console.error("Property ID is required.");
        return [];
    }
    try {
        const resourcesRef = adminDb.collection(`properties/${propertyId}/resources`);
        const snapshot = await resourcesRef.orderBy("name").get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(transformData);
    } catch (error) {
        console.error("Error fetching resources: ", error);
        return [];
    }
}

// --- NOVA FUNÇÃO ---
/**
 * Cria um novo recurso no catálogo.
 */
export async function createResource(propertyId: string, resourceData: Omit<Resource, 'id'>) {
    if (!propertyId || !resourceData) {
        return { success: false, message: "Dados inválidos." };
    }
    try {
        const resourcesRef = adminDb.collection(`properties/${propertyId}/resources`);
        await resourcesRef.add(resourceData);
        revalidatePath("/recursos"); // Atualiza o cache da página de recursos
        return { success: true, message: "Recurso criado com sucesso!" };
    } catch (error) {
        console.error("Error creating resource:", error);
        return { success: false, message: "Falha ao criar o recurso." };
    }
}