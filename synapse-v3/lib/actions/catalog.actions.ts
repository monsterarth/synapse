// /lib/actions/catalog.actions.ts

"use server";

import { adminDb } from "@/lib/firebase/server";
import { CatalogItem } from "@/types";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";

// Helper para serializar dados do Firestore
const transformData = (doc: QueryDocumentSnapshot<DocumentData>): CatalogItem => {
    const data = doc.data();
    return { id: doc.id, ...data } as CatalogItem;
};

// createCatalogItem (sem alteração)
export async function createCatalogItem(propertyId: string, itemData: Omit<CatalogItem, 'id'>) {
    if (!propertyId || !itemData) {
        return { success: false, message: "Dados inválidos." };
    }
    try {
        const catalogRef = adminDb.collection(`properties/${propertyId}/catalog`);
        await catalogRef.add(itemData);
        revalidatePath("/catalogo");
        return { success: true, message: "Item criado com sucesso!" };
    } catch (error) {
        console.error("Error creating catalog item:", error);
        return { success: false, message: "Falha ao criar o item." };
    }
}

// getCatalogItems (sem alteração)
export async function getCatalogItems(propertyId: string, type?: CatalogItem['type']): Promise<CatalogItem[]> {
    if (!propertyId) return [];
    try {
        let query: FirebaseFirestore.Query = adminDb.collection(`properties/${propertyId}/catalog`);
        if (type) {
            query = query.where("type", "==", type);
        }
        const snapshot = await query.orderBy("name").get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(transformData);
    } catch (error) {
        console.error("Error fetching catalog items:", error);
        return [];
    }
}

// --- NOVAS FUNÇÕES ---

/**
 * Busca um item específico do catálogo pelo seu ID.
 */
export async function getCatalogItemById(propertyId: string, itemId: string): Promise<CatalogItem | null> {
    if (!propertyId || !itemId) return null;
    try {
        const itemRef = adminDb.doc(`properties/${propertyId}/catalog/${itemId}`);
        const doc = await itemRef.get();
        if (!doc.exists) {
            notFound(); // Redireciona para 404 se o item não for encontrado
        }
        // Aqui usamos um cast direto pois já validamos a existência.
        return { id: doc.id, ...doc.data() } as CatalogItem;
    } catch (error) {
        console.error("Error fetching catalog item by ID:", error);
        return null;
    }
}

/**
 * Atualiza um item existente no catálogo.
 */
export async function updateCatalogItem(propertyId: string, itemId: string, itemData: Partial<CatalogItem>) {
    if (!propertyId || !itemId || !itemData) {
        return { success: false, message: "Dados inválidos." };
    }
    try {
        const itemRef = adminDb.doc(`properties/${propertyId}/catalog/${itemId}`);
        await itemRef.update(itemData);
        revalidatePath("/catalogo");
        revalidatePath(`/catalogo/${itemId}/edit`);
        return { success: true, message: "Item atualizado com sucesso!" };
    } catch (error) {
        console.error("Error updating catalog item:", error);
        return { success: false, message: "Falha ao atualizar o item." };
    }
}

/**
 * Deleta um item do catálogo.
 */
export async function deleteCatalogItem(propertyId: string, itemId: string) {
    if (!propertyId || !itemId) {
        return { success: false, message: "ID do item inválido." };
    }
    try {
        const itemRef = adminDb.doc(`properties/${propertyId}/catalog/${itemId}`);
        await itemRef.delete();
        revalidatePath("/catalogo");
        return { success: true, message: "Item excluído com sucesso!" };
    } catch (error) {
        console.error("Error deleting catalog item:", error);
        return { success: false, message: "Falha ao excluir o item." };
    }
}