// /lib/actions/content.actions.ts

"use server";

import { adminDb } from "@/lib/firebase/server";
import { Content } from "@/types";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

interface ContentListItem {
    id: string;
    label: string;
}

const transformData = (doc: any): any => {
    const data = doc.data();
    const eventDetails = data.eventDetails ? {
        ...data.eventDetails,
        start: data.eventDetails.start?.toDate().toISOString(),
        end: data.eventDetails.end?.toDate().toISOString(),
    } : undefined;

    return { 
        id: doc.id, 
        ...data,
        eventDetails
    };
};

export async function getContentItems(propertyId: string, type: Content['type']): Promise<Content[]> {
    if (!propertyId) return [];
    try {
        const contentRef = adminDb.collection(`properties/${propertyId}/content`);
        const snapshot = await contentRef.where("type", "==", type).orderBy("title").get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(transformData) as Content[];
    } catch (error) {
        console.error(`Error fetching content items of type ${type}: `, error);
        return [];
    }
}

export async function getEquipmentList(propertyId: string): Promise<ContentListItem[]> {
    if (!propertyId) return [];
    try {
        const contentRef = adminDb.collection(`properties/${propertyId}/content`);
        const snapshot = await contentRef.where("type", "==", "manual").get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(doc => ({
            id: doc.id,
            label: doc.data().title || "Equipamento sem nome"
        }));
    } catch (error) {
        console.error("Error fetching equipment list: ", error);
        return [];
    }
}

// --- NOVAS FUNÇÕES CRUD ---

export async function createContentItem(propertyId: string, contentData: Omit<Content, 'id'>) {
    if (!propertyId || !contentData) return { success: false, message: "Dados inválidos." };
    try {
        const contentRef = adminDb.collection(`properties/${propertyId}/content`);
        await contentRef.add(contentData);
        revalidatePath("/conteudo");
        return { success: true, message: "Conteúdo criado com sucesso!" };
    } catch (error) {
        console.error("Error creating content item:", error);
        return { success: false, message: "Falha ao criar o conteúdo." };
    }
}

export async function getContentItemById(propertyId: string, contentId: string): Promise<Content | null> {
    if (!propertyId || !contentId) return null;
    try {
        const contentRef = adminDb.doc(`properties/${propertyId}/content/${contentId}`);
        const doc = await contentRef.get();
        if (!doc.exists) notFound();
        return transformData(doc) as Content;
    } catch (error) {
        console.error("Error fetching content item by ID:", error);
        return null;
    }
}

export async function updateContentItem(propertyId: string, contentId: string, contentData: Partial<Content>) {
    if (!propertyId || !contentId || !contentData) return { success: false, message: "Dados inválidos." };
    try {
        const contentRef = adminDb.doc(`properties/${propertyId}/content/${contentId}`);
        await contentRef.update(contentData);
        revalidatePath("/conteudo");
        revalidatePath(`/conteudo/${contentId}/edit`);
        return { success: true, message: "Conteúdo atualizado com sucesso!" };
    } catch (error) {
        console.error("Error updating content item:", error);
        return { success: false, message: "Falha ao atualizar o conteúdo." };
    }
}

export async function deleteContentItem(propertyId: string, contentId: string) {
    if (!propertyId || !contentId) return { success: false, message: "ID do conteúdo inválido." };
    try {
        const contentRef = adminDb.doc(`properties/${propertyId}/content/${contentId}`);
        await contentRef.delete();
        revalidatePath("/conteudo");
        return { success: true, message: "Conteúdo excluído com sucesso!" };
    } catch (error) {
        console.error("Error deleting content item:", error);
        return { success: false, message: "Falha ao excluir o conteúdo." };
    }
}